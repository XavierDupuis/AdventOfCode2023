import { solutionner } from "../../utils/solutionner";
import { Day } from "../../utils/days";

enum Tile {
    Empty = '.',
    HorizontalSplitter = '-',
    VerticalSplitter = '|',
    PositiveDiagonalMirror = '/',
    NegativeDiagonalMirror = '\\',
}

enum Direction {
    Up,
    Down,
    Left,
    Right,
}

interface Coordinates {
    i: number;
    j: number;
}

interface Beam { 
    coordinates: Coordinates;
    direction: Direction;
}

function parseLayout(lines: string[]): Tile[][] {
    return lines.map((line) => line.split('').map((tile) => tile as Tile));
}

const NextCoordinates: { [key in Direction]: Coordinates } = {
    [Direction.Up]: { i: -1, j: 0 },
    [Direction.Down]: { i: 1, j: 0 },
    [Direction.Left]: { i: 0, j: -1 } ,
    [Direction.Right]: { i: 0, j: 1 }
}

const NextDirection: { [key in Tile]: { [key in Direction]: Direction[] } } = {
    [Tile.Empty]: {
        [Direction.Up]: [Direction.Up],
        [Direction.Down]: [Direction.Down],
        [Direction.Left]: [Direction.Left],
        [Direction.Right]: [Direction.Right],
    },
    [Tile.PositiveDiagonalMirror]: {
        [Direction.Up]: [Direction.Right],
        [Direction.Down]: [Direction.Left],
        [Direction.Left]: [Direction.Down],
        [Direction.Right]: [Direction.Up],
    },
    [Tile.NegativeDiagonalMirror]: {
        [Direction.Up]: [Direction.Left],
        [Direction.Down]: [Direction.Right],
        [Direction.Left]: [Direction.Up],
        [Direction.Right]: [Direction.Down],
    },
    [Tile.HorizontalSplitter]: {
        [Direction.Up]: [Direction.Right, Direction.Left],
        [Direction.Down]: [Direction.Right, Direction.Left],
        [Direction.Left]: [Direction.Left],
        [Direction.Right]: [Direction.Right],
    },
    [Tile.VerticalSplitter]: {
        [Direction.Up]: [Direction.Up],
        [Direction.Down]: [Direction.Down],
        [Direction.Left]: [Direction.Up, Direction.Down],
        [Direction.Right]: [Direction.Up, Direction.Down],
    },
}

function getNextCoordinates(coordinates: Coordinates, direction: Direction): Coordinates {
    const i = coordinates.i + NextCoordinates[direction].i;
    const j = coordinates.j + NextCoordinates[direction].j;
    return { i, j };
}

function isInLayout({ i, j }: Coordinates, layout: Tile[][]): boolean {
    return i >= 0 && j >= 0 && i < layout.length && j < layout[0].length;
}

function getNextBeams(tile: Tile, beam: Beam, layout: Tile[][]): Beam[] {
    const nextDirections = NextDirection[tile][beam.direction];

    const nextBeams: Beam[] = [];
    for(const direction of nextDirections) {
        const coordinates = getNextCoordinates(beam.coordinates, direction);
        if (isInLayout(coordinates, layout)) {
            nextBeams.push({ coordinates, direction });
        }
    }

    return nextBeams;
}

function contains<T>(set: Set<T>, element: T, comparer: (a: T, b: T) => boolean) {
    for(const item of set) {
        if (comparer(item, element)) {
            return true;
        }
    }
    return false;
}

function compareCoordinates(c1: Coordinates, c2: Coordinates): boolean {
    return c1.i === c2.i && c1.j === c2.j;
}

function compareBeams(b1: Beam, b2: Beam): boolean {
    return compareCoordinates(b1.coordinates, b2.coordinates) && b1.direction === b2.direction;
}

function hasBeam(energizedTiles: Set<Beam>, beam: Beam): boolean {
    return contains(energizedTiles, beam, compareBeams);
}

function hasCoordinates(energizedCoordinates: Set<Coordinates>, coordinates: Coordinates): boolean {
    return contains(energizedCoordinates, coordinates, compareCoordinates);
}


function getEnergizedCoordinates(startingBeam: { coordinates: { i: number; j: number; }; direction: Direction; }, layout: Tile[][]) {
    const beams: Beam[] = [startingBeam];
    const energizedTiles = new Set<Beam>();

    while (beams.length) {
        const beam = beams.shift();
        const { i, j } = beam.coordinates;
        const tile = layout[i][j];
        if (hasBeam(energizedTiles, beam)) {
            continue;
        }
        energizedTiles.add(beam);
        const nextBeams = getNextBeams(tile, beam, layout);
        beams.push(...nextBeams);
    }

    const uniqueCoordinates = new Set<Coordinates>();
    for (const beam of energizedTiles) {
        if (!hasCoordinates(uniqueCoordinates, beam.coordinates)) {
            uniqueCoordinates.add(beam.coordinates);
        }
    }
    
    return uniqueCoordinates;
}

function part1(lines: string[]): number {
    const layout = parseLayout(lines);
    const startingBeam = { coordinates: { i: 0, j: 0 }, direction: Direction.Right }
    const energizedCoordinates = getEnergizedCoordinates(startingBeam, layout);
    return energizedCoordinates.size;
}

function part2(lines: string[]): number {
    return 0;
}

solutionner(Day.D16, part1, part2);
export { part1, part2 };