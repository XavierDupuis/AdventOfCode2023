import { part1, part2 } from './solution';

describe('Day 03', () => {
    const engineSchematic = [
        '467..114..',
        '...*......',
        '..35..633.',
        '......#...',
        '617*......',
        '.....+.58.',
        '..592.....',
        '......755.',
        '...$.*....',
        '.664.598..' 
    ];

    describe('Part 1', () => {
        it('should be 4361 since only 114 and 58 are not adjacent to a symbol', () => {
            expect(part1(engineSchematic)).toBe(4361);
        });
    });

    describe('Part 2', () => {
        it('should be 467835 since the tow gear ratios are 16345 (467 and 35) and 451490', () => {
            expect(part2(engineSchematic)).toBe(467835);
        });
    });
});