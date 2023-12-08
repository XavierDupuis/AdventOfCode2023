import { part1, part2 } from './solution';

describe('Day 08', () => {
    const instructions1 = [
        "LLR",
        "",
        "AAA = (BBB, BBB)",
        "BBB = (AAA, ZZZ)",
        "ZZZ = (ZZZ, ZZZ)"
    ]

    const instructions2 = [
        "RL",
        "",
        "AAA = (BBB, CCC)",
        "BBB = (DDD, EEE)",
        "CCC = (ZZZ, GGG)",
        "DDD = (DDD, DDD)",
        "EEE = (EEE, EEE)",
        "GGG = (GGG, GGG)",
        "ZZZ = (ZZZ, ZZZ)"
    ]

    describe('Part 1', () => {
        it('should return 6 steps (AAA -> BBB -> AAA -> BBB -> AAA -> BBB -> ZZZ)', () => {
            expect(part1(instructions1)).toBe(6);
        });
        it('should return 2 steps (AAA -> CCC -> ZZZ)', () => {
            expect(part1(instructions2)).toBe(2);
        });
    });

    describe('Part 2', () => {
    });
});