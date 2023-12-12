import { solutionner } from "../../utils/solutionner";
import { Day } from "../../utils/days";
import { Dir } from "fs";

interface Context {
    tiles: Tile[][];
    start: Coordinates;
}

interface Coordinates {
    i: number;
    j: number;
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

const Mouvements: { [key in Direction]: Coordinates } = {
    [Direction.Up]: { i: -1, j: 0 },
    [Direction.Down]: { i: 1, j: 0 },
    [Direction.Left]: { i: 0, j: -1 } ,
    [Direction.Right]: { i: 0, j: 1 }
}

function parseMaze(lines: string[]): Context {
    const tiles = []
    let start: Coordinates = null; 
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

function getLoopCoordinates(maze: Context): Coordinates[] { 
    let { i, j } = maze.start;
    let current = maze.tiles[i][j];
    let nextDirections = new Set(NextDirections[current]);
    let isBackToStart = false;

    let loopCoordinates = [];

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
                i = adjacentI;
                j = adjacentJ;
                loopCoordinates.push({ i, j });
                nextDirections = excludeDirections(NextDirections[adjacentTile], OppositeDirection[nextDirection]);
                break;
            }
        }
        isBackToStart = current === Tile.Start && loopCoordinates.length > 0;
    }

    return loopCoordinates;
}

function numberOfStepsToFarthestPoint(maze: Context) {
    const loopLength = getLoopCoordinates(maze).length;
    return Math.ceil(loopLength / 2);
}

function getOnlyLoopConnections(maze: Context, loopCoordinates: Coordinates[]) {
    const onlyLoopMaze = [];
    for (let i = 0; i < maze.tiles.length; i++) {
        let row = [];
        for (let j = 0; j < maze.tiles[0].length; j++) {
            row.push(Tile.Empty);
        }
        onlyLoopMaze.push([...row]);
        row = [];
    }
    for (const aLoopCoordinates of loopCoordinates) {
        const i = aLoopCoordinates.i;
        const j = aLoopCoordinates.j;
        onlyLoopMaze[i][j] = maze.tiles[i][j];
    }
    return onlyLoopMaze;
}

function getNumberOfTilesInsideLoop(maze: Context, onlyLoopMaze: any[]) {
    // Assumes first tile is outside the loop
    let insideCount = 0;
    for (let i = 0; i < maze.tiles.length; i++) {
        let isInside = false;
        let previousAngledConnector = null;
        for (let j = 0; j < maze.tiles[0].length; j++) {
            const tile = onlyLoopMaze[i][j];
            switch (tile) {
                case Tile.Empty:
                    if (isInside) {
                        insideCount++;
                    }
                    break;
                case Tile.TopLeft:
                case Tile.BottomLeft:
                    // Loop boundary is crossed
                    isInside = !isInside;
                    // Remember this angled connector so as not to misread crossing the loop boundary again
                    previousAngledConnector = tile;
                    break;
                case Tile.Vertical:
                    // Loop boundary is crossed
                    isInside = !isInside;
                    break;
                case Tile.BottomRight:
                    // If bottom right connector, loop boundary is crossed only if previous connector is not top left (or start)
                    if (previousAngledConnector === Tile.TopLeft || previousAngledConnector === Tile.Start) {
                        // ┌──...──┘
                        previousAngledConnector = null;
                    } else {
                        // └──...──┘
                        isInside = !isInside;
                    }
                    break;
                case Tile.TopRight:
                    // If rop right connector, loop boundary is crossed only if previous connector is not bottom left (or start)
                    if (previousAngledConnector === Tile.BottomLeft || previousAngledConnector === Tile.Start) {
                        // └──...──┐
                        previousAngledConnector = null;
                    } else {
                        // ┌──...──┐
                        isInside = !isInside;
                    }
                    break;
                case Tile.Start:
                    if (previousAngledConnector) { 
                        previousAngledConnector = null;
                        isInside = !isInside;
                    } else {
                        previousAngledConnector = tile;
                    }
                    break;
            }
        }
    }

    return insideCount;
}

function part1(lines: string[]): number {
    const maze = parseMaze(lines);
    const numberOfSteps = numberOfStepsToFarthestPoint(maze);
    return numberOfSteps;
}

function part2(lines: string[]): number {
    const maze = parseMaze(lines);
    const loopCoordinates = getLoopCoordinates(maze);
    const onlyLoopConnections = getOnlyLoopConnections(maze, loopCoordinates);
    const insideCount = getNumberOfTilesInsideLoop(maze, onlyLoopConnections);
    return insideCount;
}

solutionner(Day.D10, part1, part2);
export { part1, part2 };


