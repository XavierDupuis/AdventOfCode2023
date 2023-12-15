import { solutionner } from "../../utils/solutionner";
import { Day } from "../../utils/days";

enum Tile {
    RoundRock = 'O',
    SquareRock = '#',
    Empty = '.'
}

function parsePlatform(lines: string[]): string[][] {
    return lines.map(line => line.split(''));
}

function slideNorth(platform: string[][]): string[][] {
    const slidedPlatform = [...platform.map((line) => [...line])];
    for (let i = 1; i < slidedPlatform.length; i++) {
        for (let j = 0; j < platform[0].length; j++) {
            const tile = slidedPlatform[i][j];
            if (tile === Tile.RoundRock) {
                let k = i;
                while (k > 0 && slidedPlatform[k - 1][j] === Tile.Empty) {
                    slidedPlatform[k - 1][j] = Tile.RoundRock;
                    slidedPlatform[k][j] = Tile.Empty;
                    k--;
                }
            }
        }
    }   
    return slidedPlatform; 
}

function calculatePlatformLoad(platform: string[][]): number {
    return platform.reduce((acc, line, lineIndex) => {
        const lineWeight = platform.length - lineIndex; 
        return acc + lineWeight * line.filter(tile => tile === Tile.RoundRock).length;
    }, 0);
}

function part1(lines: string[]): number {
    const platform = parsePlatform(lines);
    const slidedPlatform = slideNorth(platform);
    const platformLoad = calculatePlatformLoad(slidedPlatform);
    return platformLoad;
}

function part2(lines: string[]): number {
    return 0;
}

solutionner(Day.D14, part1, part2);
export { part1, part2 };