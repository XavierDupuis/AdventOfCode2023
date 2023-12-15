import { part1, part2 } from './solution';

describe('Day 15', () => {
    const sequence = [
        'rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7'
    ]

    describe('Part 1', () => {
        it('should return 1320 as the sum of all initialization sequence values hashes', () => {
            expect(part1(sequence)).toBe(1320);
        });
    });

    describe('Part 2', () => {
        it('should return 145 as the focusing power', () => {
            expect(part2(sequence)).toBe(145);
        });
    });
});