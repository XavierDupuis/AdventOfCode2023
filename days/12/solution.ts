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
function isArrangementValid(possibleArrangement: State[], sizes: number[]): boolean {
    const newSizes = possibleArrangement.join('').split(OperationnalSplitRegex).map((damagedGroup) => damagedGroup.length).filter((size) => size > 0);
    return arrayEqual(newSizes, sizes);
}

function getValidArrangementCount(record: Record): number {
    const unknownsIndexes = record.states.map((state, index) => state === State.Unknown ? index : -1).filter((index) => index >= 0)
    const unknownsCount = unknownsIndexes.length
    const possibleArrangementCount = Math.pow(2, unknownsCount)
    let validArrangementCount = 0;
    for (let i = 0; i < possibleArrangementCount; i++) {
        const possibleArrangement = [...record.states]
        for (let j = 0; j < unknownsCount; j++) {
            const unknownsIndex = unknownsIndexes[j]
            const newState = (i >> j) % 2 ? State.Damaged : State.Operationnal;
            possibleArrangement[unknownsIndex] = newState
        }
        if (isArrangementValid(possibleArrangement, record.sizes)) {
            validArrangementCount++;
        }

    }
    return validArrangementCount;
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