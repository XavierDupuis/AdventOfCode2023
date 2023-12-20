import { part1, part2 } from './solution';

describe('Day 18', () => {
    const digPlan = [
        'R 6 (#70c710)',
        'D 5 (#0dc571)',
        'L 2 (#5713f0)',
        'D 2 (#d2c081)',
        'R 2 (#59c680)',
        'D 2 (#411b91)',
        'L 5 (#8ceee2)',
        'U 2 (#caa173)',
        'L 1 (#1b58a2)',
        'U 2 (#caa171)',
        'R 2 (#7807d2)',
        'U 3 (#a77fa3)',
        'L 2 (#015232)',
        'U 2 (#7a21e3)'
    ]

    describe('Part 1', () => {
        it('should return 62 the number of cubic meters of lava', () => {
            expect(part1(digPlan)).toBe(62);
        });
    });

    describe('Part 2', () => {
        it('should return 952408144115 the number of cubic meters of lava', () => {
            expect(part2(digPlan)).toBe(952408144115);
        });
    });
});