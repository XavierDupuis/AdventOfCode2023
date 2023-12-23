import { part1, part2 } from './solution';

describe('Day 20', () => {
    const modules1 = [
        'broadcaster -> a, b, c',
        '%a -> b',
        '%b -> c',
        '%c -> inv',
        '&inv -> a'
    ]

    const modules2 = [
        'broadcaster -> a',
        '%a -> inv, con',
        '&inv -> b',
        '%b -> con',
        '&con -> output'
    ]

    describe('Part 1', () => {
        it('should return 32000000 since 8000 low pulses and 4000 high pulses', () => {
            expect(part1(modules1)).toBe(32000000);
        });
        it('should return 11687500 since 4250 low pulses and 2750 high pulses', () => {
            expect(part1(modules2)).toBe(11687500);
        });
    });

    describe('Part 2', () => {
    });
});