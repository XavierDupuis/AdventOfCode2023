import { part1, part2 } from './solution';

describe('Day 14', () => {
    const platform = [
        'O....#....',
        'O.OO#....#',
        '.....##...',
        'OO.#O....O',
        '.O.....O#.',
        'O.#..O.#.#',
        '..O..#O..O',
        '.......O..',
        '#....###..',
        '#OO..#....'
    ]

    describe('Part 1', () => {
        it('should return 136 as the load on the north beam', () => {
            expect(part1(platform)).toBe(136);
        });
    });

    describe('Part 2', () => {
    });
});