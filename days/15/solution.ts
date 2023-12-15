import { solutionner } from "../../utils/solutionner";
import { Day } from "../../utils/days";

enum Operation {
    Add = '=',
    Remove = '-'
}

interface LensInstruction {
    label: string;
    operation: Operation;
    focalLength?: number;
}

function toLensInstruction(value: string): LensInstruction {
    const lastChar = value[value.length - 1];
    if (lastChar === Operation.Remove) {
        return {
            label: value.slice(0, -1),
            operation: Operation.Remove
        }
    } else {
        return {
            label: value.slice(0, -2),
            operation: Operation.Add,
            focalLength: parseInt(lastChar)
        }
    }
}

function parseValues(lines: string[]): string[] {
    return lines[0].split(',')
}

function hash(value: string) {
    let hash = 0;
    for (const char of value) {
        hash += char.charCodeAt(0);
        hash *= 17;
        hash %= 256;
    }
    return hash;
}

function fillLensBoxes(squenceItems: LensInstruction[]): Map<number, LensInstruction[]> {
    const boxes = new Map<number, LensInstruction[]>();
    for (const item of squenceItems) {
        const hashedLabel = hash(item.label);
        if (item.operation === Operation.Remove) {
            const box = boxes.get(hashedLabel);
            if (box) {
                const lensIndexToRemove = box.findIndex((boxItem) => boxItem.label === item.label);
                if (lensIndexToRemove !== -1) {
                    box.splice(lensIndexToRemove, 1);
                }
            }
        }
        else { // item.operation === Operation.Add
            const box = boxes.get(hashedLabel) || [];
            const oldLensIndex = box.findIndex((boxItem) => boxItem.label === item.label);
            if (oldLensIndex !== -1) {
                box[oldLensIndex] = item;
            } else {
                box.push(item);
            }
            boxes.set(hashedLabel, box);
        }
    }
    return boxes;
}

function getTotalFocusingPower(lensBoxes: Map<number, LensInstruction[]>): number {
    let totalFocusingPower = 0;
    for (const [boxNumber, box] of lensBoxes.entries()) {
        totalFocusingPower += box.reduce((sum, lens, lensIndex) => {
            const lensFocusingPower = (boxNumber + 1) * (lensIndex + 1) * lens.focalLength;
            return sum + lensFocusingPower;
        }, 0)
    }
    return totalFocusingPower;
}

function part1(lines: string[]): number {
    const values = parseValues(lines);
    const hashes = values.map(hash);
    const hashesSum = hashes.reduce((acc, hash) => acc + hash, 0);
    return hashesSum;
}

function part2(lines: string[]): number {
    const values = parseValues(lines);
    const squenceItems = values.map(toLensInstruction);
    const lensBoxes = fillLensBoxes(squenceItems);
    const totalFocusingPower = getTotalFocusingPower(lensBoxes);
    return totalFocusingPower;
}

solutionner(Day.D15, part1, part2);
export { part1, part2 };