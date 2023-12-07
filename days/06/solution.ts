import { solutionner } from "../../utils/solutionner";
import { Day } from "../../utils/days";

interface RaceRecord {
    time: number;
    distance: number;
}

interface Context {
    races: RaceRecord[]
} 

const numberRegex = /\d+/g;

function parseContext(lines: string[]): Context {
    const numbers = lines.map(((line) => line.match(numberRegex).map(Number)))
    const races: RaceRecord[] = numbers[0].map((time, index) => ({ time, distance: numbers[1][index] }));
    return { races };
}


function getNumberOfWayToWin(race: RaceRecord): number {
    // T: race.time 
    // D: race.distance
    // t: time
    // x: distance
    // x = at^2 + bt + c
    // D = -1*t^2 + Tt + 0
    //      a = -1
    //      b = T
    //      c = -D
    // t = (-b +- sqrt(b^2 - 4ac)) / 2a
    // t = (-T +- sqrt(T^2 - 4D)) / 2

    const T = race.time;
    const D = race.distance;
    const discriminant = T*T - 4*D
    if (discriminant <= 0) {
        // No solution, the record is on or above the quadratic curve
        // No way to beat the record
        return 0;
    }
    // 2 solutions, the record is below the quadratic curve
    // There are N = t2 - t1 whole number solutions above the curve
    // N = t2 - t1 = [(-T - Math.sqrt(discriminant) ) / -2] - [(-T + Math.sqrt(discriminant) ) / -2]
    // N = (-T+T - 2 * Math.sqrt(discriminant) ) / -2
    // N = Math.sqrt(discriminant)

    // const numberOfWaysToWin = Math.ceil(Math.sqrt(discriminant)) + 1 - 2 * ((D+1) % 2)
    // return numberOfWaysToWin;

    let low = (-T + Math.sqrt(discriminant) ) / -2
    let high = (-T - Math.sqrt(discriminant) ) / -2
    low = Math.floor(low+1);
    high = Math.ceil(high-1);
    const numberOfWaysToWin = high - low + 1
    return numberOfWaysToWin;
}

function part1(lines: string[]): number {
    const context = parseContext(lines);
    const numberOfWaysToWin = context.races.reduce((acc, race) => acc *= getNumberOfWayToWin(race), 1)
    return numberOfWaysToWin;
}

function part2(lines: string[]): number {
    return 0;
}

solutionner(Day.D6, part1, part2);
export { part1, part2, getNumberOfWayToWin };