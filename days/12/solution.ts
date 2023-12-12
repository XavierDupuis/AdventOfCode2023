import { solutionner } from "../../utils/solutionner";
import { Day } from "../../utils/days";


enum State {
    Operationnal = '.',
    Damaged = '#',
    Unknown = '?'
}

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

function getNextStatesArrangementCount(states: State[], sizes: number[], memo: Map<string, number>): number {
    const currentSize = sizes[0];
    const canSizeFitInRemainingStates = currentSize <= states.length
    if (!canSizeFitInRemainingStates) {
        // The following states cannot fit the current size
        return 0;
    }

    const nextStates = states.slice(0, currentSize)
    const nextStatesHaveAGap = nextStates.some((nextState) => nextState === State.Operationnal)
    if (nextStatesHaveAGap) {
        // The following states cannot fit the current size, since the states are not contiguous
        return 0;
    }

    const isLastSize = currentSize === states.length
    const onePastState = states[currentSize] ?? State.Damaged
    const isStateAfterSizeDamaged = onePastState === State.Damaged
    if (isStateAfterSizeDamaged && !isLastSize) {
        // There isnt another size that fits since
        //      The following state is damaged (or non-existent) AND
        //      There are no other states that could fit the size
        return 0;
    }

    // There might be other states that can fit the next size
    return recursiveValidArrangementCount(states.slice(currentSize + 1), sizes.slice(1), memo)
}

function recursiveValidArrangementCount(states: State[], sizes: number[], memo: Map<string, number>): number {
    const hash = JSON.stringify({states, sizes});
    const memoCount = memo.get(hash);
    if (memoCount) {
        return memoCount;
    }
    
    if (!states.length) {
        return sizes.length ? 0 : 1;
    }
    
    if (!sizes.length) {
        return states.some((state) => state === State.Damaged) ? 0 : 1;
    }

    let count = 0
    const currentState = states[0];
    if (currentState !== State.Damaged) {
        // If currentState is Operationnal or Unknown, recursively count for all states beyond
        count += recursiveValidArrangementCount(states.slice(1), sizes, memo)
    }
    
    if (currentState !== State.Operationnal) {
        // If currentState is Damaged or Unknown
        count += getNextStatesArrangementCount(states, sizes, memo)
    }

    memo.set(hash, count);
    return count;
}

function getValidArrangementCount(record: Record, memo: Map<string, number>): number {
    return recursiveValidArrangementCount(record.states, record.sizes, memo)
}

function part1(lines: string[]): number {
    const records = parseRecords(lines);
    const memo = new Map<string, number>();
    const sumOfValidArrangements = records.reduce((sum, record) => sum += getValidArrangementCount(record, memo), 0)
    return sumOfValidArrangements;
}

function part2(lines: string[]): number {
    const records = parseRecords(lines).map(({ states, sizes }) => {
        states = Array(5).fill([...states, State.Unknown]).flat()
        states = states.slice(0, -1)
        sizes = Array(5).fill([...sizes]).flat()
        return { states, sizes }
    })
    const memo = new Map<string, number>();
    const sumOfValidArrangements = records.reduce((sum, record) => sum += getValidArrangementCount(record, memo), 0)
    return sumOfValidArrangements;
}

solutionner(Day.D12, part1, part2);
export { part1, part2 };