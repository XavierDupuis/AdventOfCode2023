import { solutionner } from "../../utils/solutionner";
import { Day } from "../../utils/days";

enum Direction {
    Up = 'U',
    Down = 'D',
    Left = 'L',
    Right = 'R'
}

function numberToDirection(value: number): Direction | null {
    switch (value) {
        case 0: return Direction.Right;
        case 1: return Direction.Down;
        case 2: return Direction.Left;
        case 3: return Direction.Up;
        default: return null;
    }
}

interface Coordinates {
    i: number;
    j: number;
}

const NextCoordinates: { [key in Direction]: Coordinates } = {
    [Direction.Up]: { i: -1, j: 0 },
    [Direction.Down]: { i: 1, j: 0 },
    [Direction.Left]: { i: 0, j: -1 } ,
    [Direction.Right]: { i: 0, j: 1 }
}

interface DigInstruction {
    direction: Direction;
    distance: number;
    color: string;
}

type DigPlan = DigInstruction[];

function parseDigPlan(lines: string[]): DigPlan {
    return lines.map((line) => line.split(' ')).map(([direction, distance, color]) => 
        ({ direction: direction as Direction, distance: parseInt(distance), color })
    );
}

function getNextCoordinates({i: previousI, j: previousJ }: Coordinates, direction: Direction, distance: number): Coordinates {
    const { i: deltaI, j: deltaJ } = NextCoordinates[direction];
    const i = previousI + deltaI * distance;
    const j = previousJ + deltaJ * distance;
    return { i, j };
}

function getPolygonPoints(digPlan: DigPlan): Coordinates[] {
    const points: Coordinates[] = [];
    let current: Coordinates = { i: 0, j: 0 };
    digPlan.forEach(({ direction, distance }) => {
        points.push(current);
        current = getNextCoordinates(current, direction, distance);
    });
    return points;
}

// https://en.wikipedia.org/wiki/Shoelace_formula
function getPolygonArea(points: Coordinates[]): number {
    let area = 0;
    for (let k = 0; k < points.length; k++) {
        const k1 = (k) % points.length;
        const k2 = (k + 1) % points.length;
        const { i: i1, j: j1 } = points[k1];
        const { i: i2, j: j2 } = points[k2];
        area += (i1 * j2) - (i2 * j1);
    }
    area = Math.abs(area) / 2;
    return area;
}

// https://en.wikipedia.org/wiki/Pick%27s_theorem
function getInternalPointCount(area: number, boundaryPointsCount: number): number {
    // A = i + b/2 - 1 
    // i = A - b/2 + 1
    return area - boundaryPointsCount / 2 + 1;
}

function getDistance(p1: Coordinates, p2: Coordinates): number {
    return Math.sqrt(Math.pow(p2.i - p1.i, 2) + Math.pow(p2.j - p1.j, 2));
}

function getPolygonPerimeter(points: Coordinates[]): number {
    let perimeter = 0;
    for (let k = 0; k < points.length; k++) {
        const k1 = (k) % points.length;
        const k2 = (k + 1) % points.length;
        perimeter += getDistance(points[k1], points[k2]);
    }
    return perimeter;
}

function getFixedDigPlan(digPlan: DigPlan): DigPlan {
    return [...digPlan].map(({ direction: _wrongDirection, distance: _wrongDistance, color }) => {
        const directionValue = parseInt(color.at(-2))
        const direction = numberToDirection(directionValue);
        const distance = parseInt(color.slice(2, -2), 16);
        return { direction, distance, color };
    });
}

function part1(lines: string[]): number {
    const digPlan = parseDigPlan(lines);
    const points = getPolygonPoints(digPlan);
    const area = getPolygonArea(points);
    const boundaryPointsCount = getPolygonPerimeter(points);
    const internalPointsCount = getInternalPointCount(area, boundaryPointsCount);
    const totalArea = internalPointsCount + boundaryPointsCount;
    return totalArea;
}

function part2(lines: string[]): number {
    const digPlan = getFixedDigPlan(parseDigPlan(lines));
    const points = getPolygonPoints(digPlan);
    const area = getPolygonArea(points);
    const boundaryPointsCount = getPolygonPerimeter(points);
    const internalPointsCount = getInternalPointCount(area, boundaryPointsCount);
    const totalArea = internalPointsCount + boundaryPointsCount;
    return totalArea;
}

solutionner(Day.D18, part1, part2);
export { part1, part2 };