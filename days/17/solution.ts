import { solutionner } from "../../utils/solutionner";
import { Day } from "../../utils/days";
import { get } from "http";

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
}

class PriorityQueue<T> {
    private data: [number, T][] = [];

    constructor(private comparer: (a: [number, T], b: [number, T]) => number) {}

    public push(item: T, priority: number): void {
        let index = this.data.length - 1;
        while (index >= 0 && this.comparer(this.data[index], [priority, item]) < 0) {
            index--;
        }
        this.data.splice(index + 1, 0, [priority, item]);
    }
    
    public get size(): number {
        return this.data.length;
    }

    public get isEmpty(): boolean {
        return this.size == 0;
    }

    public pop(): T | null {
        return this.data.pop()?.[1];
    }

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

function getNextMovements(mouvement: Mouvement, heatmap: HeatMap, isNextMouvementValid: (mouvement: Mouvement) => boolean): Mouvement[] {
    const nextMovements: Mouvement[] = [];
    const nextDirections = NextDirection[mouvement.direction];
    for (const nextDirection of nextDirections) {
        const nextCoordinates = getNextCoordinates(mouvement.coordinates, nextDirection);
        const isMouvementInBounds = isInBounds(nextCoordinates, heatmap);
        if (!isMouvementInBounds) {
            continue;
        }
        const consecutiveSteps = mouvement.direction === nextDirection ? mouvement.consecutiveSteps + 1 : 0;
        const cumulatedHeatLoss = mouvement.cumulatedHeatLoss + getHeatLoss(heatmap, nextCoordinates);
        const nextMouvement = { coordinates: nextCoordinates, direction: nextDirection, cumulatedHeatLoss, consecutiveSteps, parent: mouvement };
        const isMouvementValid = isNextMouvementValid(nextMouvement);
        if (isMouvementValid) {
            nextMovements.push(nextMouvement);
        }
    }
    return nextMovements;
}

function isInBounds({ i, j }: Coordinates, heatmap: HeatMap): boolean {
    return i >= 0 && j >= 0 && i < heatmap.length && j < heatmap[0].length;
}

function compareCoordinates(c1: Coordinates, c2: Coordinates): boolean {
    return c1.i === c2.i && c1.j === c2.j;
}

function hash(mouvement: Mouvement): string {
    // return `${mouvement.coordinates.i},${mouvement.coordinates.j},${mouvement.consecutiveSteps},${mouvement.parent?.direction}`;
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

function getHeuristic(mouvement: Mouvement, end: Coordinates): number {
    return manhattanDistance(mouvement.coordinates, end);
}

function getCost(heatmap: HeatMap, mouvement: Mouvement, previousMouvement: Mouvement): number {
    return getHeatLoss(heatmap, mouvement.coordinates) + previousMouvement.cumulatedHeatLoss;
}

function getPriority(heatmap: HeatMap, mouvement: Mouvement, previousMouvement: Mouvement, end: Coordinates): number {
    return getCost(heatmap, mouvement, previousMouvement) + getHeuristic(mouvement, end);
}

function aStarSearch(heatmap: HeatMap, isNextMouvementValid: (mouvement: Mouvement) => boolean, start: Coordinates, end: Coordinates): number {
    const queue: PriorityQueue<Mouvement> = new PriorityQueue((a, b) => a[0] - b[0]);
    queue.push({ coordinates: start, direction: Direction.South, cumulatedHeatLoss: 0, consecutiveSteps: 0, parent: null }, 0);
    queue.push({ coordinates: start, direction: Direction.East, cumulatedHeatLoss: 0, consecutiveSteps: 0, parent: null }, 0);
    
    const visited: Set<String> = new Set();

    while (!queue.isEmpty) {
        const mouvement = queue.pop()!;
        const { i, j } = mouvement.coordinates;

        const mouvementHash = hash(mouvement);
        if (visited.has(mouvementHash)) {
            continue;
        }
        visited.add(mouvementHash);

        if (compareCoordinates({ i, j }, end)) {
            let current = mouvement;
            const heatMapDirections = heatmap.map((row) => [...row].map(() => '.'));
            const heatMapLosses = heatmap.map((row) => [...row].map(() => '.'));
            while (current.parent !== null) {
                heatMapDirections[current.coordinates.i][current.coordinates.j] = 
                    current.direction === Direction.North ? '↑' : 
                    current.direction === Direction.South ? '↓' : 
                    current.direction === Direction.West ? '←' : '→';
                heatMapLosses[current.coordinates.i][current.coordinates.j] = getHeatLoss(heatmap, current.coordinates).toString();
                current = current.parent;
            }
            console.log(heatMapDirections.map((row) => row.join('')).join('\n'));
            console.log('\n')
            console.log(heatMapLosses.map((row) => row.join('')).join('\n'));
            return mouvement.cumulatedHeatLoss;
        }

        const nextMovements = getNextMovements(mouvement, heatmap, isNextMouvementValid);
        nextMovements.map((nextMovement) => queue.push(nextMovement, getPriority(heatmap, nextMovement, mouvement, end)));
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
        } else if (mouvement.parent.consecutiveSteps + 1 >= maxConsecutiveSteps) {
            return mouvement.direction !== mouvement.parent.direction;
        } else {
            return true;
        }
    }
    const start: Coordinates = { i: 0, j: 0 };
    const end: Coordinates = { i: heatmap.length - 1, j: heatmap[0].length - 1 };
    const minHeatLoss = aStarSearch(heatmap, isNextMouvementValid, start, end);
    return minHeatLoss;
}

solutionner(Day.D17, part1, part2);
export { part1, part2 };