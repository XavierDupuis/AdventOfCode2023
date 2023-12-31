import { part1, part2 } from './solution';

describe('Day 17', () => {
    const heatMap = [
        '2413432311323',
        '3215453535623',
        '3255245654254',
        '3446585845452',
        '4546657867536',
        '1438598798454',
        '4457876987766',
        '3637877979653',
        '4654967986887',
        '4564679986453',
        '1224686865563',
        '2546548887735',
        '4322674655533'
    ]

    describe('Part 1', () => {
        it('should return 102 as the minimized heat loss', () => {
            expect(part1(heatMap)).toBe(102);
        });
    });

    describe('Part 2', () => {
        it('should return 94 as the minimized heat loss', () => {
            expect(part2(heatMap)).toBe(94);
        });
    });
});