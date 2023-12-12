import { solutionner } from "../../utils/solutionner";
import { Day } from "../../utils/days";


enum State {
    Operationnal = '.',
    Damaged = '#',
    Unknown = '?'
}

const NotDamagedSplitRegex = new RegExp(/[?|\.]+/gi)
const OperationnalSplitRegex = new RegExp(/\.+/gi)

interface Record {
    states: State[]
    sizes: number[]
}

function parseRecords(lines: string[]): Record[] {
    return lines.map((line) => {
        const [statesStr, sizesStr] = line.split(' ')
        const states = statesStr.split('') as State[]
        const sizes = sizesStr.split(',').map(Number)
        return { states, sizes } 
    })
}

function arrayEqual<T>(a1: T[], a2: T[]): boolean {
    if (a1.length !== a2.length) {
        return false;
    }
    for (let i = 0; i < a1.length; i++) {
        if (a1[i] !== a2[i]) {
            return false;
        }
    }
    return true;
}

function arrayIncluded<T>(partial: T[], full: T[]): boolean {
    for (let i = 0; i < partial.length; i++) {
        if (partial[i] > full[i]) {
            return false;
        }
    }
    return true;
}

function isArrangementPossiblyValid(possibleArrangement: State[], sizes: number[]): boolean {
    const newSizes = possibleArrangement.join('').split(NotDamagedSplitRegex).map((damagedGroup) => damagedGroup.length).filter((size) => size > 0);
    return arrayIncluded(newSizes, sizes);
}

function isArrangementValid(possibleArrangement: State[], sizes: number[]): boolean {
    const newSizes = possibleArrangement.join('').split(OperationnalSplitRegex).map((damagedGroup) => damagedGroup.length).filter((size) => size > 0);
    return arrayEqual(newSizes, sizes);
}

function recursiveValidArrangementCount(states: State[], sizes: number[], unknownsIndexes: number[], currentUnknownIndex: number): number {
    const withOperationnal = [...states]
    withOperationnal[unknownsIndexes[currentUnknownIndex]] = State.Operationnal
    const withDamaged = [...states]
    withDamaged[unknownsIndexes[currentUnknownIndex]] = State.Damaged

    if (currentUnknownIndex === (unknownsIndexes.length - 1)) {
        let count = 0;
        if (isArrangementValid(withOperationnal, sizes)) {
            count++;
        }
        if (isArrangementValid(withDamaged, sizes)) {
            count++;
        }
        return count
    }

    const withOperationnalCount = isArrangementPossiblyValid(withOperationnal.slice(0, unknownsIndexes[currentUnknownIndex]), sizes) 
        ? recursiveValidArrangementCount(withOperationnal, sizes, unknownsIndexes, currentUnknownIndex + 1)
        : 0

    const withDamagedCount = isArrangementPossiblyValid(withDamaged.slice(0, unknownsIndexes[currentUnknownIndex]), sizes) 
        ? recursiveValidArrangementCount(withDamaged, sizes, unknownsIndexes, currentUnknownIndex + 1)
        : 0

    return withOperationnalCount + withDamagedCount
}

function getValidArrangementCount(record: Record): number {
    const unknownsIndexes = record.states.map((state, index) => state === State.Unknown ? index : -1).filter((index) => index >= 0)
    return recursiveValidArrangementCount(record.states, record.sizes, unknownsIndexes, 0)
}

function part1(lines: string[]): number {
    const records = parseRecords(lines);
    const sumOfValidArrangements = records.reduce((sum, record) => sum += getValidArrangementCount(record), 0)
    return sumOfValidArrangements;
}

function part2(lines: string[]): number {
    return 0;
}

solutionner(Day.D12, part1, part2);
export { part1, part2 };