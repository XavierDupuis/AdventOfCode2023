import { solutionner } from "../../utils/solutionner";
import { Day } from "../../utils/days";
import Heap from "heap-js";

type HeatMap = number[][];

enum Direction {
    North,
    South,
    West,
    East,
}

interface Coordinates {
    i: number;
    j: number;
}

interface Mouvement {
    coordinates: Coordinates;
    direction: Direction;
    consecutiveSteps: number;
    cumulatedHeatLoss: number;
    parent: Mouvement | null;
    priority: number;
}

function parseHeatMap(lines: string[]): HeatMap {
    return lines.map((line) => line.split('').map(Number))
}

const NextDirection: { [key in Direction]: Direction[] } = {
    [Direction.North]: [Direction.North, Direction.East, Direction.West],
    [Direction.South]: [Direction.South, Direction.East, Direction.West],
    [Direction.West]: [Direction.North, Direction.South, Direction.West],
    [Direction.East]: [Direction.North, Direction.South, Direction.East]
};

const NextCoordinates: { [key in Direction]: Coordinates } = {
    [Direction.North]: { i: -1, j: 0 },
    [Direction.South]: { i: 1, j: 0 },
    [Direction.West]: { i: 0, j: -1 } ,
    [Direction.East]: { i: 0, j: 1 }
}

function getNextCoordinates(coordinates: Coordinates, direction: Direction): Coordinates {
    const i = coordinates.i + NextCoordinates[direction].i;
    const j = coordinates.j + NextCoordinates[direction].j;
    return { i, j };
}

function getCumulatedHeatLoss(mouvement: Mouvement, heatmap: HeatMap, nextCoordinates: Coordinates) {
    return mouvement.cumulatedHeatLoss + getHeatLoss(heatmap, nextCoordinates);
}

function getMouvementConsecutiveSteps(mouvement: Mouvement, nextDirection: Direction) {
    return mouvement.direction === nextDirection ? mouvement.consecutiveSteps + 1 : 0;
}

function isInBounds({ i, j }: Coordinates, heatmap: HeatMap): boolean {
    return i >= 0 && j >= 0 && i < heatmap.length && j < heatmap[0].length;
}

function getNextMovements(mouvement: Mouvement, heatmap: HeatMap, isNextMouvementValid: (mouvement: Mouvement) => boolean, end: Coordinates): Mouvement[] {
    const nextMovements: Mouvement[] = [];
    const nextDirections = NextDirection[mouvement.direction];
    for (const nextDirection of nextDirections) {
        const nextCoordinates = getNextCoordinates(mouvement.coordinates, nextDirection);
        const isMouvementInBounds = isInBounds(nextCoordinates, heatmap);
        if (!isMouvementInBounds) {
            continue;
        }
        
        const consecutiveSteps = getMouvementConsecutiveSteps(mouvement, nextDirection);
        const cumulatedHeatLoss = getCumulatedHeatLoss(mouvement, heatmap, nextCoordinates);
        const priority = getPriority(heatmap, nextCoordinates, mouvement, nextCoordinates);
        
        const nextMouvement = { coordinates: nextCoordinates, direction: nextDirection, cumulatedHeatLoss, consecutiveSteps, parent: mouvement, priority };
        const isMouvementValid = isNextMouvementValid(nextMouvement);
        if (isMouvementValid) {
            nextMovements.push(nextMouvement);
        }
    }
    return nextMovements;
}

function compareCoordinates(c1: Coordinates, c2: Coordinates): boolean {
    return c1.i === c2.i && c1.j === c2.j;
}

function hash(mouvement: Mouvement): string {
    return `${mouvement.coordinates.i},${mouvement.coordinates.j},${mouvement.consecutiveSteps},${mouvement.direction}`;
}

function getHeatLoss(heatmap: HeatMap, {i, j}: Coordinates): number {
    if (isInBounds({i, j}, heatmap)) {
        return heatmap[i][j];
    }
    return Number.MAX_SAFE_INTEGER;
}

function manhattanDistance(c1: Coordinates, c2: Coordinates): number {
    return Math.abs(c1.i - c2.i) + Math.abs(c1.j - c2.j);
}

function getHeuristic(start: Coordinates, end: Coordinates): number {
    return manhattanDistance(start, end);
}

function getCost(heatmap: HeatMap, coordinates: Coordinates, previousMouvement: Mouvement): number {
    return getHeatLoss(heatmap, coordinates) + previousMouvement.cumulatedHeatLoss;
}

function getPriority(heatmap: HeatMap, coordinates: Coordinates, previousMouvement: Mouvement, end: Coordinates): number {
    return getCost(heatmap, coordinates, previousMouvement) + getHeuristic(coordinates, end);
}

function aStarSearch(heatmap: HeatMap, isNextMouvementValid: (mouvement: Mouvement) => boolean, start: Coordinates, end: Coordinates): number {
    const queue = new Heap<Mouvement>((a, b) => a.priority - b.priority);
    queue.push({ coordinates: start, direction: Direction.South, cumulatedHeatLoss: 0, consecutiveSteps: 0, parent: null, priority: 0 });
    queue.push({ coordinates: start, direction: Direction.East, cumulatedHeatLoss: 0, consecutiveSteps: 0, parent: null, priority: 0 });
    
    const visited: Set<String> = new Set();

    while (!queue.isEmpty()) {
        const mouvement = queue.pop()!;
        const { i, j } = mouvement.coordinates;

        const mouvementHash = hash(mouvement);
        if (visited.has(mouvementHash)) {
            continue;
        }
        visited.add(mouvementHash);

        if (compareCoordinates({ i, j }, end)) {
            return mouvement.cumulatedHeatLoss;
        }

        const nextMovements = getNextMovements(mouvement, heatmap, isNextMouvementValid, end);
        nextMovements.map((nextMovement) => queue.push(nextMovement));
    }
    
    return 0;
}

function part1(lines: string[]): number {
    const heatmap = parseHeatMap(lines);
    const maxConsecutiveSteps = 3;
    const isNextMouvementValid = (mouvement: Mouvement): boolean => mouvement.consecutiveSteps < maxConsecutiveSteps;
    const start: Coordinates = { i: 0, j: 0 };
    const end: Coordinates = { i: heatmap.length - 1, j: heatmap[0].length - 1 };
    const minHeatLoss = aStarSearch(heatmap, isNextMouvementValid, start, end);
    return minHeatLoss;
}

function part2(lines: string[]): number {
    const heatmap = parseHeatMap(lines);
    const minConsecutiveSteps = 4;
    const maxConsecutiveSteps = 10;
    const isNextMouvementValid = (mouvement: Mouvement): boolean => {
        if (mouvement.parent.consecutiveSteps + 1 < minConsecutiveSteps) {
            return mouvement.direction === mouvement.parent.direction;
        } 
        if (mouvement.parent.consecutiveSteps + 1 >= maxConsecutiveSteps) {
            return mouvement.direction !== mouvement.parent.direction;
        }
        return true;
    }
    const start: Coordinates = { i: 0, j: 0 };
    const end: Coordinates = { i: heatmap.length - 1, j: heatmap[0].length - 1 };
    const minHeatLoss = aStarSearch(heatmap, isNextMouvementValid, start, end);
    return minHeatLoss;
}

solutionner(Day.D17, part1, part2);
export { part1, part2 };