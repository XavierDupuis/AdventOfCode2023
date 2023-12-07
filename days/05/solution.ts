import { solutionner } from "../../utils/solutionner";
import { Day } from "../../utils/days";

class MapRange {
    private delta: number;
    public sourceEnd: number;

    constructor(public destinationStart: number, public sourceStart: number, public length: number) {
        this.delta = destinationStart - sourceStart
        this.sourceEnd = sourceStart + length - 1
    }

    public isInSourceRange(input: number): boolean {
        return input >= this.sourceStart && input <= this.sourceStart + this.length
    }

    public map(input: number): number {
        if (!this.isInSourceRange(input)) {
            throw new Error(`Input ${input} is not in range ${this.sourceStart} - ${this.sourceStart + this.length}`) 
        }
        return input + this.delta
    }

    public mapRange(range: SeedRange): { mapped: SeedRange[], unmapped: SeedRange[] } {
        const unmapped: SeedRange[] = []
        const mapped: SeedRange[] = []

        if (this.sourceStart > range.start) {
            const beforeEnd = Math.min(range.end, this.sourceStart - 1)
            unmapped.push({ start: range.start, end: beforeEnd })
        }

        if (this.sourceEnd < range.end) {
            const afterStart = Math.max(range.start, this.sourceEnd + 1)
            unmapped.push({ start: afterStart, end: range.end})
        }

        if (this.sourceStart <= range.end && this.sourceEnd >= range.start) {
            const overlapStart = Math.max(range.start, this.sourceStart)
            const overlapEnd = Math.min(range.end, this.sourceEnd)
            mapped.push({ start: this.map(overlapStart), end: this.map(overlapEnd)})
        }
        return { mapped, unmapped };
    }
}

interface SeedRange {
    start: number,
    end: number
}

type Mapper = MapRange[]

interface Context {
    seeds: number[],
    almanac: Mapper[]
}

function getContext(lines: string[]): Context {
    const context = {
        seeds: [],
        almanac: [],
    }

    const mapHeaderEndDelimiter = ":";

    let mapRanges: MapRange[] = []

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
        const line = lines[lineIndex];
        if (line.at(-1) === mapHeaderEndDelimiter) {
            continue
        } else if (line.length === 0) {
            context.almanac.push([...mapRanges])
            mapRanges = []
        } else if (line.includes("seeds:")) {
            context.seeds = line.split(": ").at(-1).split(" ").map(seed => parseInt(seed))
            lineIndex++
        } else {
            const [source, destination, range] = line.split(" ").map(s => parseInt(s));
            mapRanges.push(new MapRange(source, destination, range))
        }
    }

    context.almanac.push([...mapRanges])
    return context;
}

function getMinSeedValue(seeds: number[], almanac: Mapper[]) {
    let min = Number.MAX_SAFE_INTEGER
    seeds.forEach(seed => {
        let value = seed;
        almanac.forEach((mapper) => {
            value = getDestinationFromMapper(mapper, value);
        });
        if (value < min) {
            min = value;
        }
    });
    return min;
}

function getDestinationFromMapper(mapper: Mapper, value: number) {
    for (const mapperFunction of mapper) { 
        if (mapperFunction.isInSourceRange(value)) {
            return mapperFunction.map(value);
        }
    }
    return value;
}

function getSeedRanges(seedsRanges: number[]): SeedRange[] {
    const seedRanges = [];
    for (let i = 0; i < seedsRanges.length; i += 2) {
        const start = seedsRanges[i];
        const rangeLength = seedsRanges[i + 1];
        const end = start + rangeLength - 1;
        seedRanges.push({ start, end });
    }
    return seedRanges;
}

function getMinSeedValueFromRanges(seedRanges: SeedRange[], almanac: Mapper[]) {
    const propagatedSeedRanges: SeedRange[] = [...getPropagatedSeedRanges(seedRanges, almanac)]
    const seedBounds = propagatedSeedRanges.map((seedRange) => [seedRange.start, seedRange.end]).flat()
    const min = seedBounds.reduce((min, value) => value < min ? value : min, Number.MAX_SAFE_INTEGER)
    return min;
}

function getPropagatedSeedRanges(originalSeedRanges: SeedRange[], almanac: Mapper[]): SeedRange[] {
    let propagatedSeedRanges: SeedRange[] = [...originalSeedRanges]
    almanac.forEach((mapper) => {
        propagatedSeedRanges = getPropagatedSeedRangesFromMapper(propagatedSeedRanges, mapper)
    })
    return propagatedSeedRanges;
}

function getPropagatedSeedRangesFromMapper(seedRanges: SeedRange[], mapper: Mapper): SeedRange[] {
    let propagated = [];
    let toPropagate = [...seedRanges]
    mapper.forEach((mapRange) => {
        const { propagated: propagatedFromMapRange, toPropagate: toPropagateFromMapRange } = getPropagatedSeedRangesFromMapRange(toPropagate, mapRange);
        propagated.push(...propagatedFromMapRange)
        toPropagate = toPropagateFromMapRange
    })
    return propagated.concat(toPropagate).flat()
}

function getPropagatedSeedRangesFromMapRange(seedRanges: SeedRange[], mapRange: MapRange): { propagated: SeedRange[], toPropagate: SeedRange[] } {
    let propagated = [];
    let toPropagate = [];
    seedRanges.forEach((seedRange) => {
        const { mapped, unmapped } = mapRange.mapRange(seedRange);
        propagated.push(...mapped)
        toPropagate.push(...unmapped)
    })
    return { propagated, toPropagate }
}

function part1(lines: string[]): number {
    const { seeds, almanac } = getContext(lines)
    const min = getMinSeedValue(seeds, almanac);
    return min;
}

function part2(lines: string[]): number {
    const { seeds, almanac } = getContext(lines)
    const seedRanges = getSeedRanges(seeds);
    const min = getMinSeedValueFromRanges(seedRanges, almanac);
    return min;
}

solutionner(Day.D5, part1, part2);
export { part1, part2 };