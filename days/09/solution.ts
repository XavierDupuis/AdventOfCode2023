import { solutionner } from "../../utils/solutionner";
import { Day } from "../../utils/days";

function parseSequences(lines: string[]): number[][] {
    return lines.map(line => line.split(' ').map(Number));
}

function getSequenceNextNumber(sequence: number[]): number {
    const differences = getSequenceDifferences(sequence);
    let next = 0;
    for (const i of differences.reverse()) {
        let last = i.at(-1);
        next = last + next;
    }
    return next;
}

function getSequenceDifferences(sequence: number[]) {
    const currents = [sequence];
    while (currents.at(-1).some((current) => current !== 0)) {
        let differences = [];
        let previousDifferences = currents.at(-1);
        for (let i = 0; i < previousDifferences.length - 1; i++) {
            const current = previousDifferences[i];
            const next = previousDifferences[i + 1];
            const difference = next - current;
            differences.push(difference);
        }
        currents.push([...differences]);
        differences = [];
    }
    return currents;
}

function part1(lines: string[]): number {
    const sequences = parseSequences(lines);
    const sum = sequences.reduce((acc, sequence) => acc + getSequenceNextNumber(sequence), 0);
    return sum;
}

function part2(lines: string[]): number {
    return 0;
}

solutionner(Day.D9, part1, part2);
export { part1, part2 };