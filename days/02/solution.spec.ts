import { part1, part2 } from './solution';

describe('Day 02', () => {
    const g1 = "Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green"
    const g2 = "Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue"
    const g3 = "Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red"
    const g4 = "Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red"
    const g5 = "Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green"
    
    describe('Part 1', () => {
        it('should be possible for game 1', () => {
            expect(part1([g1])).toBe(1);
        });
        it('should be possible for game 2', () => {
            expect(part1([g2])).toBe(2);
        });
        it('should be impossible for game 3', () => {
            expect(part1([g3])).toBe(0);
        });
        it('should be possible for game 4', () => {
            expect(part1([g4])).toBe(0);
        });
        it('should be possible for game 5', () => {
            expect(part1([g5])).toBe(5);
        });
        it('should return the sum of only possible configurations', () => {
            expect(part1([g1, g2, g3, g4, g5])).toBe(8);
        })

    });

    describe('Part 2', () => {
        it('should be 4 red, 2 green and 6 blues for game 1 => 48', () => {
            expect(part2([g1])).toBe(48);
        });
        it('should be 12 for game 2', () => {
            expect(part2([g2])).toBe(12);
        });
        it('should be 1560 for game 3', () => {
            expect(part2([g3])).toBe(1560);
        });
        it('should be 630 for game 4', () => {
            expect(part2([g4])).toBe(630);
        });
        it('should be 36 for game 5', () => {
            expect(part2([g5])).toBe(36);
        });
        it('should return the sum of only possible configurations', () => {
            expect(part2([g1, g2, g3, g4, g5])).toBe(2286);
        })
    });
});