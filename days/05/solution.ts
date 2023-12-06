import { solutionner } from "../../utils/solutionner";
import { Day } from "../../utils/days";


class MapRange {
    private delta: number;

    constructor(public destination: number, public source: number, public length: number) {
        this.delta = destination - source
    }

    public isInSourceRange(input: number): boolean {
        return input >= this.source && input <= this.source + this.length
    }

    public map(input: number): number {
        if (!this.isInSourceRange(input)) {
            throw new Error(`Input ${input} is not in range ${this.source} - ${this.source + this.length}`) 
        }
        return input + this.delta
    }

    public isInDestinationRange(input: number): boolean {
        return input >= this.destination && input <= this.destination + this.length
    }

    public unmap(input: number): number {
        if (!this.isInDestinationRange(input)) {
            throw new Error(`Input ${input} is not in range ${this.destination} - ${this.destination + this.length}`) 
        }
        return input - this.delta
    }
}

class SeedRange {
    public end: number;

    constructor(public start: number, length: number) {
        this.end = start + length - 1
    }

    public isInRange(input: number): boolean {
        return input >= this.start && input <= this.end
    }
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

    let mapperFunctions = []

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
        const line = lines[lineIndex];
        if (line.at(-1) === mapHeaderEndDelimiter) {
            continue
        } else if (line.length === 0) {
            context.almanac.push([...mapperFunctions.sort((a, b) => a.source - b.source)])
            mapperFunctions = []
        } else if (line.includes("seeds:")) {
            context.seeds = line.split(": ").at(-1).split(" ").map(seed => parseInt(seed))
            lineIndex++
        } else {
            const [source, destination, range] = line.split(" ").map(s => parseInt(s));
            mapperFunctions.push(new MapRange(source, destination, range))
        }
    }

    context.almanac.push([...mapperFunctions.sort((a, b) => a.source - b.source)])
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

function getSourceFromMapper(mapper: Mapper, value: number) {
    for (const mapperFunction of mapper) { 
        if (mapperFunction.isInDestinationRange(value)) {
            return mapperFunction.unmap(value);
        }
    }
    return value;
}

function getSeedRanges(seedsRanges: number[]): SeedRange[] {
    const seedRanges = [];
    for (let i = 0; i < seedsRanges.length; i += 2) {
        const rangeStart = seedsRanges[i];
        const rangeLength = seedsRanges[i + 1];
        seedRanges.push(new SeedRange(rangeStart, rangeLength));
    }
    return seedRanges;
}

function getMinSeedValueFromRanges(seedRanges: SeedRange[], almanac: Mapper[]) {
    let min = Number.MAX_SAFE_INTEGER
    const alamancLimits = getAlmanacLimits(almanac);
    seedRanges.forEach((seedRange) => {
        const minFromSeedRange = getMinSeedValueFromRange(seedRange, almanac, alamancLimits);
        if (minFromSeedRange < min) {
            min = minFromSeedRange;
        }
    })
    return min;
}

function getMapRangeLimits(mapRange: MapRange) {
    const first = mapRange.destination;
    const last = mapRange.destination + mapRange.length;
    const before = first - 1;
    const after = last + 1;
    return [first, last, before, after];
}

function getAlmanacLimits(almanac: Mapper[]): Set<number> {
    let limits = new Set<number>();
    for (const mapper of [...almanac].reverse()) {
        for (const mapRange of mapper) {
            const rangeLimits = getMapRangeLimits(mapRange);
            for (const limit of rangeLimits) {
                limits.add(limit)
            }
        }
        limits = new Set([...limits].map((limit) => getSourceFromMapper(mapper, limit)))
    }
    return limits;
}

function getMinSeedValueFromRange(seedRange: SeedRange, almanac: Mapper[], alamancLimits: Set<number>): number {
    const values = [...alamancLimits].filter((value) => seedRange.isInRange(value))
    values.push(seedRange.start)
    values.push(seedRange.end)
    const valuesToCheck = new Set(values)

    let min = Number.MAX_SAFE_INTEGER
    for (const value of valuesToCheck) {
        let current = value;
        const currents = [current]
        almanac.forEach((mapper) => {
            current = getDestinationFromMapper(mapper, current);
            currents.push(current)
        });
        if (current < min) {
            min = current;
        }
    }
    return min;
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