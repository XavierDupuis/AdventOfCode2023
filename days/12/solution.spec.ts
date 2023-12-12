import { part1, part2 } from './solution';

describe('Day 12', () => {
    const records1 = [
        '???.### 1,1,3',
        '.??..??...?##. 1,1,3',
        '?#?#?#?#?#?#?#? 1,3,1,6',
        '????.#...#... 4,1,1',
        '????.######..#####. 1,6,5',
        '?###???????? 3,2,1'
    ];

    describe('Part 1', () => {
        it('should return 21 possible arrangements', () => {
            expect(part1(records1)).toBe(21);
        })
    });

    describe('Part 2', () => {
        it('should return 525152 possible arrangements', () => {
            expect(part2(records1)).toBe(525152);
        })
    });
});