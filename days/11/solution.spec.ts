import { part1, part2 } from './solution';

describe('Day 11', () => {
    const universe1 = [
        '...#......',
        '.......#..',
        '#.........',
        '..........',
        '......#...',
        '.#........',
        '.........#',
        '..........',
        '.......#..',
        '#...#.....'
    ];

    describe('Part 1', () => {
        it('should return 374 for the sum of shortest paths of 36 pairs of galaxy', () => {
            expect(part1(universe1)).toBe(374);
        });
    });

    describe('Part 2', () => {
        it('should return 82000210 for the sum of shortest paths of 36 pairs of galaxy (with expansion 10^6)', () => {
            expect(part2(universe1)).toBe(82000210);
        });
    });
});