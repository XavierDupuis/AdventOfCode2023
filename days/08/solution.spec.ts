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

    const instructions3 = [
        "LR",
        "",
        "11A = (11B, XXX)",
        "11B = (XXX, 11Z)",
        "11Z = (11B, XXX)",
        "22A = (22B, XXX)",
        "22B = (22C, 22C)",
        "22C = (22Z, 22Z)",
        "22Z = (22B, 22B)",
        "XXX = (XXX, XXX)"
    ]

    describe('Part 2', () => {
        it('should return 6 steps (3 times 11A -> 11B -> 11Z and 2 times 22A -> 22B -> 22C -> 22Z) ', () => {
            expect(part2(instructions3)).toBe(6);
        });
    });
});