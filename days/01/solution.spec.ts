import { part1, part2 } from './solution';

describe('Day 01', () => {
    describe('Part 1', () => {
        it('should return 0 for an empty list', () => {
            const lines: string[] = [];
            expect(part1(lines)).toEqual(0);
        });
        it('should return 12 for an 1abc2', () => {
            const lines: string[] = ["1abc2"];
            expect(part1(lines)).toEqual(12);
        });
        it('should return 38 for an pqr3stu8vwx', () => {
            const lines: string[] = ["pqr3stu8vwx"];
            expect(part1(lines)).toEqual(38);
        });
        it('should return 15 for an a1b2c3d4e5f', () => {
            const lines: string[] = ["a1b2c3d4e5f"];
            expect(part1(lines)).toEqual(15);
        });
        it('should return 77 for an treb7uchet', () => {
            const lines: string[] = ["treb7uchet"];
            expect(part1(lines)).toEqual(77);
        });
        it('should return 142 for a list of calibratable values', () => {
            const lines: string[] = ['1abc2', 'pqr3stu8vwx', 'a1b2c3d4e5f', 'treb7uchet'];
            expect(part1(lines)).toEqual(142);
        });
    });

    describe('Part 2', () => {
        it('should return 29 for an two1nine', () => {
            const lines: string[] = ["two1nine"];
            expect(part2(lines)).toEqual(29);
        });
        it('should return 83 for an eightwothree', () => {
            const lines: string[] = ["eightwothree"];
            expect(part2(lines)).toEqual(83);
        });
        it('should return 13 for an abcone2threexyz', () => {
            const lines: string[] = ["abcone2threexyz"];
            expect(part2(lines)).toEqual(13);
        });
        it('should return 24 for an xtwone3four', () => {
            const lines: string[] = ["xtwone3four"];
            expect(part2(lines)).toEqual(24);
        });
        it('should return 42 for an 4nineeightseven2', () => {
            const lines: string[] = ["4nineeightseven2"];
            expect(part2(lines)).toEqual(42);
        });
        it('should return 14 for an zoneight234', () => {
            const lines: string[] = ["zoneight234"];
            expect(part2(lines)).toEqual(14);
        });
        it('should return 76 for an 7pqrstsixteen', () => {
            const lines: string[] = ["7pqrstsixteen"];
            expect(part2(lines)).toEqual(76);
        });
        it('should return 281 for a list of calibratable values', () => {
            const lines: string[] = ['two1nine', 'eightwothree', 'abcone2threexyz', 'xtwone3four', '4nineeightseven2', 'zoneight234', '7pqrstsixteen'];
            expect(part2(lines)).toEqual(281);
        });
        it('should return 82 for eightwo', () => {
            const lines: string[] = ['eightwo'];
            expect(part2(lines)).toEqual(82);
        });
    });
});