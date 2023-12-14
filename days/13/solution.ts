import { solutionner } from "../../utils/solutionner";
import { Day } from "../../utils/days";

enum Reflection {
    None = 0,
    Vertical = 1,
    Horizontal = 100,
}

function parseTerrains(lines: string[]) {
    const terrains: string[][] = [];
    let currentTerrain = [];
    lines.forEach((line) => {
        if (!line.length) {
            terrains.push([...currentTerrain]);
            currentTerrain = [];
            return;
        }
        currentTerrain.push(line);
    })
    terrains.push([...currentTerrain]);
    return terrains;
}

function getColumn(terrain: string[], index: number) {
    return terrain.map((row) => row[index]).join('');
}

function getRow(terrain: string[], index: number) {
    return terrain[index];
}

function isTerrainSymmetric(
    possibleReflectiveIndex: number, 
    terrain: string[], 
    lowerBound: number,
    upperBound: number,
    getLine: (terrain: string[], index: number) => string
) {
    let beforeIndex = possibleReflectiveIndex - 1;
    let afterIndex = possibleReflectiveIndex;
    while (beforeIndex >= lowerBound && afterIndex < upperBound) {
        const rowBefore = getLine(terrain, beforeIndex);
        const rowAfter = getLine(terrain, afterIndex);
        if (rowBefore !== rowAfter) {
            return false;
        }
        beforeIndex--;
        afterIndex++;
    }
    return true;
}

function isTerrainHorizontallySymmetric(possibleReflectiveIndex: number, terrain: string[]) {
    return isTerrainSymmetric(possibleReflectiveIndex, terrain, 0, terrain.length, getRow);
}

function isTerrainVerticallySymmetric(possibleReflectiveIndex: number, terrain: string[]) {
    return isTerrainSymmetric(possibleReflectiveIndex, terrain, 0, terrain[0].length, getColumn);
}

function getReflection(terrain: string[]): { beforeCount: number, type: Reflection } {
    for (let i = 1; i < terrain.length; i++) {
        const rowBefore = getRow(terrain, i - 1);
        const rowAfter = getRow(terrain, i);
        if (rowBefore === rowAfter) {
            const isSymmetric = isTerrainHorizontallySymmetric(i, terrain);
            if (isSymmetric) {
                return { beforeCount: i, type: Reflection.Horizontal };
            }
        }
    }

    for (let j = 1; j < terrain[0].length; j++) {
        const columnBefore = getColumn(terrain, j - 1);
        const columnAfter = getColumn(terrain, j);
        if (columnBefore === columnAfter) {
            const isSymmetric = isTerrainVerticallySymmetric(j, terrain);
            if (isSymmetric) {
                return { beforeCount: j, type: Reflection.Vertical };
            }
        }
    }
    return { beforeCount: 0, type: Reflection.None };
}

function part1(lines: string[]): number {
    const terrains = parseTerrains(lines);
    const reflections = terrains.map((terrain) => getReflection(terrain));
    const reflectionSum = reflections.reduce((sum, reflection) => sum + reflection.beforeCount * reflection.type, 0);
    return reflectionSum;
}

function part2(lines: string[]): number {
    return 0;
}

solutionner(Day.D13, part1, part2);
export { part1, part2 };


