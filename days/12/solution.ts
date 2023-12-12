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

function recursiveValidArrangementCount(states: State[], sizes: number[]): number {
    if (!states.length) {
        return sizes.length ? 0 : 1;
    }
    
    if (!sizes.length) {
        return states.some((state) => state === State.Damaged) ? 0 : 1;
    }

    const currentState = states[0];

    let count = 0
    if (currentState !== State.Damaged) {
        // If currentState is Operationnal or Unknown, recursively count for all states beyond
        count += recursiveValidArrangementCount(states.slice(1), sizes)
    }
    
    if (currentState !== State.Operationnal) {
        // If currentState is Damaged or Unknown
        
        const currentSize = sizes[0];
        const canSizeFitInRemainingStates = currentSize <= states.length
        if (!canSizeFitInRemainingStates) {
            // The following states cannot fit the current size
            return count;
        }

        const nextStates = states.slice(0, currentSize)
        const nextStatesHaveAGap = nextStates.some((nextState) => nextState === State.Operationnal)
        if (nextStatesHaveAGap) {
            // The following states cannot fit the current size, since the states are not contiguous
            return count;
        }

        const isLastSize = currentSize === states.length
        const onePastState = states[currentSize] ?? State.Damaged
        const isStateAfterSizeDamaged = onePastState === State.Damaged
        if (isStateAfterSizeDamaged && !isLastSize) {
            // There isnt another size that fits since
            //      The following state is damaged (or non-existent) AND
            //      There are no other states that could fit the size
            return count;
        }

        // There might be other states that can fit the next size
        count += recursiveValidArrangementCount(states.slice(currentSize + 1), sizes.slice(1))
    }
    return count;
}

function getValidArrangementCount(record: Record): number {
    return recursiveValidArrangementCount(record.states, record.sizes)
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