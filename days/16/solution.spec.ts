import { part1, part2 } from './solution';

describe('Day 16', () => {
    const layout = [
        '.|...\\....',
        '|.-.\\.....',
        '.....|-...',
        '........|.',
        '..........',
        '.........\\',
        '..../.\\\\..',
        '.-.-/..|..',
        '.|....-|.\\',
        '..//.|....',
    ]

    describe('Part 1', () => {
        it('should return 46 for the 46 energized tiles', () => {
            expect(part1(layout)).toBe(46);
        });
    });

    describe('Part 2', () => {
    });
});