import { part1, part2 } from './solution';

describe('Day 07', () => {
    const hands = [
        '32T3K 765',
        'T55J5 684',
        'KK677 28',
        'KTJJT 220',
        'QQQJA 483'
    ]

    describe('Part 1', () => {
        it('should return 6440 (765 * 1 + 220 * 2 + 28 * 3 + 684 * 4 + 483 * 5)', () => {
            expect(part1(hands)).toBe(6440);
        });
    });

    describe('Part 2', () => {
        it('should return 5905', () => {
            expect(part2(hands)).toBe(5905);
        });
    });
});