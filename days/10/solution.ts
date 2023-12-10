import { solutionner } from "../../utils/solutionner";
import { Day } from "../../utils/days";
import { Dir } from "fs";

interface Context {
    tiles: Tile[][];
    start: { i: number, j: number };
}

enum Tile {
    Start = "S",
    Empty = ".",
    Vertical = "|",
    Horizontal = "-",
    BottomRight = "J",
    BottomLeft = "L",
    TopRight = "7",
    TopLeft = "F",
}

function stringToTile(str: string): Tile {
    const tileKeys = Object.keys(Tile)
    const tile = tileKeys.find((tileKey) => Tile[tileKey] === str)
    return Tile[tile];
}

enum Direction {
    Up = "U",
    Down = "D",
    Left = "L",
    Right = "R",
}

const Directions = new Set([Direction.Up, Direction.Down, Direction.Left, Direction.Right]);

function excludeDirections(directions: Set<Direction> = Directions, ...excludedDirections: Direction[]): Set<Direction> {
    const set = new Set(directions);
    excludedDirections.forEach((excludedDirection) => set.delete(excludedDirection));
    return set;
}

const OppositeDirection = {
    [Direction.Up]: Direction.Down,
    [Direction.Down]: Direction.Up,
    [Direction.Left]: Direction.Right,
    [Direction.Right]: Direction.Left,
}

const Connectors: { [key in Direction]: Set<Tile> } = {
    [Direction.Up]: new Set([Tile.TopRight, Tile.TopLeft, Tile.Vertical, Tile.Start]),
    [Direction.Down]: new Set([Tile.BottomRight, Tile.BottomLeft, Tile.Vertical, Tile.Start]),
    [Direction.Left]: new Set([Tile.BottomLeft, Tile.TopLeft, Tile.Horizontal, Tile.Start]),
    [Direction.Right]: new Set([Tile.BottomRight, Tile.TopRight, Tile.Horizontal, Tile.Start])
}

const NextDirections: { [key in Tile]: Set<Direction> } = {   
    [Tile.BottomLeft]: new Set([Direction.Up, Direction.Right]),
    [Tile.BottomRight]: new Set([Direction.Up, Direction.Left]),
    [Tile.TopLeft]: new Set([Direction.Down, Direction.Right]),
    [Tile.TopRight]: new Set([Direction.Down, Direction.Left]),
    [Tile.Horizontal]: new Set([Direction.Left, Direction.Right]),
    [Tile.Vertical]: new Set([Direction.Up, Direction.Down]),
    [Tile.Start]: new Set([Direction.Up, Direction.Down, Direction.Left, Direction.Right]),
    [Tile.Empty]: new Set(),
}

const Mouvements: { [key in Direction]: { i: number, j: number} } = {
    [Direction.Up]: { i: -1, j: 0 },
    [Direction.Down]: { i: 1, j: 0 },
    [Direction.Left]: { i: 0, j: -1 } ,
    [Direction.Right]: { i: 0, j: 1 }
}

function parseMaze(lines: string[]): Context {
    const tiles = []
    let start: { i: number, j: number } = null; 
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        let row = []
        for (let j = 0; j < line.length; j++) {
            const tile = stringToTile(line[j]);
            row.push(tile);
            if (tile === Tile.Start) {
                start = { i, j };
            }
        }
        tiles.push([...row]);
        row = [];
    }
    return {
        tiles,
        start,
    }
}

function isInBounds(maze: Context, i: number, j: number): boolean {
    return i >= 0 && i < maze.tiles.length && j >= 0 && j < maze.tiles[0].length;
}

function mazeSafeGet(maze: Context, i: number, j: number): Tile {
    if (isInBounds(maze, i, j)) {
        return maze.tiles[i][j];
    }
    return null;
}

function numberOfStepsToFarthestPoint(maze: Context) {
    let steps = 0;
    let { i, j } = maze.start;
    let current = maze.tiles[i][j];
    let nextDirections = new Set(NextDirections[current]);
    let isBackToStart = false;

    while (!isBackToStart) {

        // Check for all possible directions
        for (const nextDirection of nextDirections) {
            const mouvement = Mouvements[nextDirection];
            const adjacentI = i + mouvement.i;
            const adjacentJ = j + mouvement.j;
            const adjacentTile = mazeSafeGet(maze, adjacentI, adjacentJ);

            // If the tile in the specified direction is a valid connector
            if (Connectors[nextDirection].has(adjacentTile)) {
                current = adjacentTile;
                steps++;
                i = adjacentI;
                j = adjacentJ;
                nextDirections = excludeDirections(NextDirections[adjacentTile], OppositeDirection[nextDirection]);
                break;
            }
        }
        isBackToStart = current === Tile.Start && steps > 0;
    }

    return Math.ceil(steps / 2);
}

function part1(lines: string[]): number {
    const maze = parseMaze(lines);
    const numberOfSteps = numberOfStepsToFarthestPoint(maze);
    return numberOfSteps;
}


function part2(lines: string[]): number {
    return 0;
}

solutionner(Day.D10, part1, part2);
export { part1, part2 };


