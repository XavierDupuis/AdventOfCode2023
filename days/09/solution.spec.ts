import { part1, part2 } from './solution';

describe('Day 09', () => {
    const s1 = "0 3 6 9 12 15";
    const s2 = "1 3 6 10 15 21";
    const s3 = "10 13 16 21 30 45";

    describe('Part 1', () => {
        it('should return 18', () => {
            expect(part1([s1])).toBe(18);
        });
        it('should return 28', () => {
            expect(part1([s2])).toBe(28);
        });
        it('should return 68', () => {
            expect(part1([s3])).toBe(68);
        });
        it('should return 114', () => {
            expect(part1([s1, s2, s3])).toBe(114);
        });
    });

    describe('Part 2', () => {
        it('should return -3', () => {
            expect(part2([s1])).toBe(-3);
        });
        it('should return 0', () => {
            expect(part2([s2])).toBe(0);
        });
        it('should return 5', () => {
            expect(part2([s3])).toBe(5);
        });
        it('should return 2', () => {
            expect(part2([s1, s2, s3])).toBe(2);
        });
    });
});