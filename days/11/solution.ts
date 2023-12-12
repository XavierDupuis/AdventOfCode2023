import { solutionner } from "../../utils/solutionner";
import { Day } from "../../utils/days";

type Galaxy = '#'
type Empty = '.'
type Space = Galaxy | Empty

interface Coordinates {
    i: number;
    j: number;
}

interface Context {
    map: Space[][];
    galaxies: Coordinates[];
}

function parseUniverse(lines: string[]): Context {
    const map: Space[][] = [];
    const galaxies: Coordinates[] = [];

    lines.forEach((line, i) => {
        map[i] = [];
        line.split('').forEach((space, j) => {
            map[i][j] = space as Space;
            if (space === '#') {
                galaxies.push({ i, j });
            }
        });
    });

    return { map, galaxies };
}

function getEmptyRowsAndColumns(map: Space[][], galaxies: Coordinates[]): { emptyRows: Set<number>, emptyColumns: Set<number> } {
    const rowsWithGalaxy = galaxies.reduce((acc, current) => acc.add(current.i), new Set<number>())
    const emptyRows = new Set<number>();
    for (let i = 0; i < map.length; i++) {
        if (!rowsWithGalaxy.has(i)) {
            emptyRows.add(i)
        }
    }
    
    const columnsWithGalaxy = galaxies.reduce((acc, current) => acc.add(current.j), new Set<number>())
    const emptyColumns = new Set<number>();
    for (let j = 0; j < map[0].length; j++) {
        if (!columnsWithGalaxy.has(j)) {
            emptyColumns.add(j)
        }
    }

    return { emptyRows, emptyColumns }
}

function getExpansionDistance(k1: number, k2: number, expansion: number, expanded: Set<number>): number {
    let expansionDistance = 0;
    let deltaExpansion = expansion - 1;
    for (let k = Math.min(k1, k2); k < Math.max(k1, k2); k++) {
        if (expanded.has(k)) {
            expansionDistance += deltaExpansion;
        }
    }
    return expansionDistance;
}

function expandedManhattanDistance(p1: Coordinates, p2: Coordinates, expansion: number, emptyRows: Set<number>, emptyColumns: Set<number>) {
    const rowExpansionDistance = getExpansionDistance(p1.i, p2.i, expansion, emptyRows)
    const columnExpansionDistance = getExpansionDistance(p1.j, p2.j, expansion, emptyColumns)
    const expansionDistance = rowExpansionDistance + columnExpansionDistance
    return Math.abs(p1.i - p2.i) + Math.abs(p1.j - p2.j) + expansionDistance
}

function getExpandedDistanceForGalaxies(galaxies: Coordinates[], expansion: number, emptyRows: Set<number>, emptyColumns: Set<number>) {
    let totalDistance = 0;
    for (let i = 0; i < galaxies.length; i++) {
        for (let j = i; j < galaxies.length; j++) {
            totalDistance += expandedManhattanDistance(galaxies[i], galaxies[j], expansion, emptyRows, emptyColumns);
        }
    }
    return totalDistance;
}

function part1(lines: string[]): number {
    const expansion = 2;
    const { map, galaxies } = parseUniverse(lines);
    const { emptyRows, emptyColumns } = getEmptyRowsAndColumns(map, galaxies);
    const totalDistance = getExpandedDistanceForGalaxies(galaxies, expansion, emptyRows, emptyColumns, );
    return totalDistance;
}

function part2(lines: string[]): number {
    const expansion = Math.pow(10, 6)
    const { map, galaxies } = parseUniverse(lines);
    const { emptyRows, emptyColumns } = getEmptyRowsAndColumns(map, galaxies);
    const totalDistance = getExpandedDistanceForGalaxies(galaxies, expansion, emptyRows, emptyColumns);
    return totalDistance;
}

solutionner(Day.D11, part1, part2);
export { part1, part2 };