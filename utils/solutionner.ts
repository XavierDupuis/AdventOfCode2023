import { Day } from "./days";
import { getLines } from "./getLines";

export function solutionner<S1, S2>(day: Day, part1: (lines: string[]) => S1, part2: (lines: string[]) => S2): void {
    const lines = getLines(day)
    console.log(`-> 🎄 Day ${day} <-`);
    console.log('⚡ Part 1: ', part1(lines));
    console.log('⚡ Part 2: ', part2(lines));
}