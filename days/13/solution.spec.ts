import { part1, part2 } from './solution';

describe('Day 13', () => {
    const terrains = [
        '#.##..##.',
        '..#.##.#.',
        '##......#',
        '##......#',
        '..#.##.#.',
        '..##..##.',
        '#.#.##.#.',
        '',
        '#...##..#',
        '#....#..#',
        '..##..###',
        '#####.##.',
        '#####.##.',
        '..##..###',
        '#....#..#'
    ]

    describe('Part 1', () => {
        it('should return 405 for 4 rows above and 5 columns before', () => {
            expect(part1(terrains)).toBe(405);
        });
    });

    describe('Part 2', () => {
    });
});