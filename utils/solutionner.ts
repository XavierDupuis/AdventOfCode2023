import { Day } from "./days";
import { getLines } from "./getLines";

export function solutionner<S1, S2>(day: Day, part1: (lines: string[]) => S1, part2: (lines: string[]) => S2, showTime: boolean = false): void {
    const lines = getLines(day)
    console.log(`-> 🎄 Day ${day} <-`);

    const parts: [string, (lines: string[]) => any][] = [['Part 1', part1], ['Part 2', part2]]

    for (const [name, part] of parts) {
        const start = performance.now()
        const result = part(lines);
        const end = performance.now()
        const elapsed = (end - start).toFixed(3);
        console.log(`⚡ ${name} :`, result, `${showTime ? `[🕓 ${elapsed} ms]` : ''}`);
    }
}