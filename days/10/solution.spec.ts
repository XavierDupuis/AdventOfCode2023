import { part1, part2 } from './solution';

describe('Day 10', () => {
    const maze1 = [
        '.....',
        '.S-7.',
        '.|.|.',
        '.L-J.',
        '.....'
    ];

    const maze2 = [
        '..F7.',
        '.FJ|.',
        'SJ.L7',
        '|F--J',
        'LJ...'
    ];

    describe('Part 1', () => {
        it('should return 4', () => {
            expect(part1(maze1)).toBe(4);
        });
        it('should return 8', () => {
            expect(part1(maze2)).toBe(8);
        });
    });

    describe('Part 2', () => {
    });
});