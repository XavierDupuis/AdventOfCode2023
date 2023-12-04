import { solutionner } from "../../utils/solutionner";
import { Day } from "../../utils/days";

solutionner(Day.D1, part1, part2);


function part1(lines: string[]): number {
    
    function getCalibrationValue(value: string): number {
        const matches = value.match(/\d/gi);
        const first = matches?.at(0);
        const last = matches?.at(-1);
        if (!first && !last) {
            return 0;
        }
        return parseInt(first + last);
    }
    
    const sumOfCalibrationValues = lines.reduce((acc, current) => acc + getCalibrationValue(current), 0);
    return sumOfCalibrationValues
}

function part2(lines: string[]): number {

    const textToDigits = new Map<string, number>([
        ['zero', 0],
        ['one', 1],
        ['two', 2],
        ['three', 3],
        ['four', 4],
        ['five', 5],
        ['six', 6],
        ['seven', 7],
        ['eight', 8],
        ['nine', 9],
    ])

    function getCalibrationValue(value: string): number {
        const matches = value.match(/\d|zero|one|two|three|four|five|six|seven|eight|nine/gi)
        const first = matches?.at(0);
        const last = matches?.at(-1);
        const firstDigit = textToDigits.get(first)?.toString() ?? first 
        const lastDigit = textToDigits.get(last)?.toString() ?? last 
        return parseInt(firstDigit + lastDigit);
    }
    
    const sumOfCalibrationValues = lines.reduce((acc, current) => acc + getCalibrationValue(current), 0);
    return sumOfCalibrationValues
}

export { part1, part2 };


