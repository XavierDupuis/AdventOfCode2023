import { solutionner } from "../../utils/solutionner";
import { Day } from "../../utils/days";

function parseValues(lines: string[]): string[] {
    return lines[0].split(',')
}

function hash(value: string) {
    let hash = 0;
    for (const char of value) {
        hash += char.charCodeAt(0);
        hash *= 17;
        hash %= 256;
    }
    return hash;
}

function part1(lines: string[]): number {
    const values = parseValues(lines);
    const hashes = values.map(hash);
    const hashesSum = hashes.reduce((acc, hash) => acc + hash, 0);
    return hashesSum;
}

function part2(lines: string[]): number {
    return 0;
}

solutionner(Day.D15, part1, part2);
export { part1, part2 };