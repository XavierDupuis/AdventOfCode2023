import { part1, part2 } from './solution';

describe('Day 04', () => {
    const c1 = 'Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53'
    const c2 = 'Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19'
    const c3 = 'Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1'
    const c4 = 'Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83'
    const c5 = 'Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36'
    const c6 = 'Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11'

    describe('Part 1', () => {
        it('should return 8 for card 1 since it has 4 winning numbers (48, 83, 17, and 86)', () => {
            expect(part1([c1])).toBe(8);
        });
        it('should return 2 for card 2 since it has 2 winning numbers (32 and 61)', () => {
            expect(part1([c2])).toBe(2);
        });
        it('should return 2 for card 3 since it has 2 winning number (1 and 21)', () => {
            expect(part1([c3])).toBe(2);
        });
        it('should return 1 for card 4 since it has 1 winning number (84)', () => {
            expect(part1([c4])).toBe(1);
        });
        it('should return 0 for card 5 since it has no winning numbers', () => {
            expect(part1([c5])).toBe(0);
        });
        it('should return 0 for card 6 since it has no winning numbers', () => {
            expect(part1([c6])).toBe(0);
        });
        it('should return 13 for the 5 cards', () => {
            expect(part1([c1, c2, c3, c4, c5, c6])).toBe(13);
        });
    });

    describe('Part 2', () => {
        it('should return 30 scratchcards for the 6 cards', () => {
            expect(part2([c1, c2, c3, c4, c5, c6])).toBe(30);
        });
    });
});