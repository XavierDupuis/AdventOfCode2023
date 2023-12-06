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
function part1(lines: string[]): number {
    const { seeds, almanac } = getContext(lines)
    const min = getMinSeedValue(seeds, almanac);
    return min;
}

function part2(lines: string[]): number {
    return 0;
}

solutionner(Day.D5, part1, part2);
export { part1, part2 };