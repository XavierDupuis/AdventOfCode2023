import { solutionner } from "../../utils/solutionner";
import { Day } from "../../utils/days";

solutionner(Day.D3, part1, part2);

type Position = { i: number, j: number }

type Part = { num: number, accountedFor: boolean }

function accumulateLinesTokens(lines: string[], symbolRegex: RegExp, numberRegex: RegExp): {
    symbols: Position[],
    partsPositions:  { position: Position, part: Part }[]
} {
    const symbols: Position[] = [];
    const partsPositions: { position: Position, part: Part }[] = [];
    lines.forEach((line, i) => accumulateLineTokens(line, i, symbols, partsPositions, symbolRegex, numberRegex));
    return { symbols, partsPositions };
}

function accumulateLineTokens(line: string, i: number, symbols: Position[], partsPositions: { position: Position, part: Part }[], symbolRegex: RegExp, numberRegex: RegExp) {
    accumulatePartsPositions(numberRegex, line, partsPositions, i);
    accumulateSymbolPositions(symbolRegex, line, symbols, i);
}

function accumulateSymbolPositions(regex: RegExp, line: string, symbols: Position[], i: number) {
    [...line].forEach((symbol, j) => {
        if (symbol.match(regex)) {
            symbols.push({ i, j });
        }
    });
}

function accumulatePartsPositions(regex: RegExp, line: string, partsPositions: { position: Position; part: Part; }[], i: number) {
    let match = null;
    while ((match = regex.exec(line)) !== null) {
        const numberMatch = match[0];
        const start = match.index;
        const end = start + numberMatch.length - 1;
        const part = { num: parseInt(numberMatch, 10), accountedFor: false };
        for (let j = start; j <= end; j++) {
            partsPositions.push({ position: { i, j }, part });
        }
    }
}

function part1(lines: string[]): number {
    const symbolRegex = /[^\d.]/g
    const numberRegex = /\d+/g

    function addPartsNextToSymbols(symbols: Position[], partsPositions: { position: Position, part: Part }[]): number {
        let sumOfPartsNumbers = 0;
        for (const {i, j} of symbols) {
            sumOfPartsNumbers += addPartsNextToSymbol(i, j, partsPositions)
        }
        return sumOfPartsNumbers
    }

    function addPartsNextToSymbol(i: number, j: number, partsPositions: { position: Position, part: Part }[]): number {
        let symbolPartNumbersSum = 0;
        for (let k = i - 1; k <= i + 1; k++) {
            for (let l = j - 1; l <= j + 1; l++) {
                if (k === i && l === j) {
                    continue;
                }
                const partPosition = partsPositions.find(({ position: {i, j} }) => i === k && j === l);
                if (partPosition?.part && !partPosition?.part.accountedFor) {
                    partPosition.part.accountedFor = true;
                    symbolPartNumbersSum += partPosition.part.num;
                }
            }
        }
        return symbolPartNumbersSum;
    }


    const { symbols, partsPositions } = accumulateLinesTokens(lines, symbolRegex, numberRegex)
    const sumOfPartsNumbers = addPartsNextToSymbols(symbols, partsPositions)
    return sumOfPartsNumbers
}

function part2(lines: string[]): number {
    const symbolRegex = /[*]/g
    const numberRegex = /\d+/g

    function getSumOfGearRatios(symbols: Position[], partsPositions: { position: Position; part: Part; }[]): number {
        let sumOfGearRatios = 0;
        for (const {i, j} of symbols) {
            const partsPositionsNexToSymbol = getPartsNextToSymbol(i, j, partsPositions)
            if (partsPositionsNexToSymbol.length === 2) {
                sumOfGearRatios += partsPositionsNexToSymbol[0].part.num * partsPositionsNexToSymbol[1].part.num
            }
        }
        return sumOfGearRatios
    }

    function getPartsNextToSymbol(i: number, j: number, partsPositions: { position: Position, part: Part }[]) {
        const partsPositionsNexToSymbol: { position: Position, part: Part }[] = []
        for (let k = i - 1; k <= i + 1; k++) {
            for (let l = j - 1; l <= j + 1; l++) {
                if (k === i && l === j) {
                    continue;
                }
                const partPosition = partsPositions.find(({ position: {i, j} }) => i === k && j === l);
                if (partPosition?.part && !partPosition?.part.accountedFor) {
                    partPosition.part.accountedFor = true;
                    partsPositionsNexToSymbol.push(partPosition)
                }
            }
        }
        return partsPositionsNexToSymbol;
    }

    const { symbols, partsPositions } = accumulateLinesTokens(lines, symbolRegex, numberRegex)
    const sumOfGearRatios = getSumOfGearRatios(symbols, partsPositions)
    return sumOfGearRatios;
}

export { part1, part2 };