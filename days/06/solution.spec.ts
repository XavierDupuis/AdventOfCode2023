import { part1, part2, getNumberOfWayToWin } from './solution';

describe('Day 06', () => {
    const timesAndDistances = [
        "Time:      7  15   30",
        "Distance:  9  40  200"
    ] 

    describe('Part 1', () => {
        it('should return 4 since there is only 4 ways to beat the record', () => {  
            expect(getNumberOfWayToWin({ time: 7, distance: 9 })).toBe(4);
        });
        it('should return 8 since there is only 8 ways to beat the record', () => {  
            expect(getNumberOfWayToWin({ time: 15, distance: 40 })).toBe(8);
        });
        it('should return 9 since there is only 9 ways to beat the record', () => {  
            expect(getNumberOfWayToWin({ time: 30, distance: 200 })).toBe(9);
        });
        it('should return 5 since there are 5 ways to beat the record', () => {   
            expect(getNumberOfWayToWin({ time: 12, distance: 30 })).toBe(5);
        });
        it('should return 3 since there are 3 ways to beat the record', () => {   
            expect(getNumberOfWayToWin({ time: 12, distance: 32 })).toBe(3);
        });
        it('should return 4 since there are 4 ways to beat the record', () => {   
            expect(getNumberOfWayToWin({ time: 11, distance: 25 })).toBe(4);
        });
        it('should return 2 since there are 2 ways to beat the record', () => {   
            expect(getNumberOfWayToWin({ time: 11, distance: 28 })).toBe(2);
        });
        it('should return 288 since there are 4*8*9 ways to beat the record', () => {
            expect(part1(timesAndDistances)).toBe(288);
        })
    });

    describe('Part 2', () => {
        it('should return 71503 since there are 71503 ways to beat the record', () => {
            expect(part2(timesAndDistances)).toBe(71503);
        });
    });
});