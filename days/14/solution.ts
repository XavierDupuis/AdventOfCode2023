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
    for (let i = 0; i < slidedPlatform.length; i++) {
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

function rotateRight(platform: string[][]): string[][] {
    const rotatedPlatform = [...platform.map((line) => [...line])];
    for (let i = 0; i < rotatedPlatform.length; i++) {
        for (let j = 0; j < platform[0].length; j++) {
            rotatedPlatform[i][j] = platform[platform[0].length - 1 - j][i];
        }
    }
    return rotatedPlatform;
}

function cyclePlatform(platform: string[][]): string[][] {
    const northSlidedPlatform = slideNorth(platform);
    const westSlidedPlatform = slideNorth(rotateRight(northSlidedPlatform));
    const southSlidedPlatform = slideNorth(rotateRight(westSlidedPlatform));
    const eastSlidedPlatform = slideNorth(rotateRight(southSlidedPlatform));
    const cycledPlatform = rotateRight(eastSlidedPlatform)
    return cycledPlatform;
}

function calculatePlatformLoad(platform: string[][]): number {
    return platform.reduce((acc, line, lineIndex) => {
        const lineWeight = platform.length - lineIndex; 
        return acc + lineWeight * line.filter(tile => tile === Tile.RoundRock).length;
    }, 0);
}

function getPlatformAfterCycles(platform: string[][], cycles: number): string[][] {
    let currentPlatform = [...platform.map((line) => [...line])];
    let platformsEpochs = new Map<string, number>();
    let loopStartEpoch = 0;
    let loopEndEpoch = 0;
    let epoch = 0;
    while (epoch < cycles) {
        const platformHash = currentPlatform.map(line => line.join('')).join('');
        if (platformsEpochs.has(platformHash)) {
            loopStartEpoch = platformsEpochs.get(platformHash);
            loopEndEpoch = epoch;
            break;
        }
        platformsEpochs = platformsEpochs.set(platformHash, epoch);
        currentPlatform = cyclePlatform(currentPlatform);
        epoch++;
    }

    const remainingCycles = cycles - loopStartEpoch;
    const loopLength = loopEndEpoch - loopStartEpoch;
    const remainingCyclesInLoop = remainingCycles % loopLength;

    for (let i = 0; i < remainingCyclesInLoop; i++) {
        currentPlatform = cyclePlatform(currentPlatform);
    }

    return currentPlatform;
}

function part1(lines: string[]): number {
    const platform = parsePlatform(lines);
    const slidedPlatform = slideNorth(platform);
    const platformLoad = calculatePlatformLoad(slidedPlatform);
    return platformLoad;
}

function part2(lines: string[]): number {
    const cycles = Math.pow(10, 9);
    const platform = parsePlatform(lines);
    const slidedPlatform = getPlatformAfterCycles(platform, cycles);
    const platformLoad = calculatePlatformLoad(slidedPlatform);
    return platformLoad;
}

solutionner(Day.D14, part1, part2);
export { part1, part2 };