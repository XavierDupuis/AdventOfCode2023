import { solutionner } from "../../utils/solutionner";
import { Day } from "../../utils/days";

solutionner(Day.D2, part1, part2);

interface Game {
    id: number,
    revelations: RGB[]
}

interface RGB {
    red: number,
    green: number,
    blue: number,
}

function parseGame(line: string): Game {
    const [game, revelations] = line.split(': ');

    const gameIdMatch = game.match(/\d+/);
    const id = gameIdMatch ? parseInt(gameIdMatch[0], 10) : null;

    const RGBs = revelations.split('; ').map((revelation) => {
        const values = revelation.split(', ').map((item) => {
            const [count, color] = item.split(' ')
            return {
                [color]: parseInt(count, 10)
            }
        })
        return Object.assign({}, ...values) as RGB
    })

    return {
        id,
        revelations: RGBs
    }
}

function part1(lines: string[]): number {
    const limits: RGB = {
        red: 12,
        green: 13,
        blue: 14,
    }

    const games = lines.map(parseGame)
    const sumOfIds = games.reduce((sum, game) => {
        const { id, revelations } = game
        const isValid = revelations.every((revelation) => {
            return Object.entries(revelation).every(([color, count]) => {
                return count <= limits[color]
            })
        })
        return isValid ? sum + id : sum
    }, 0)
    return sumOfIds
}

function part2(lines: string[]): number {
    const games = lines.map(parseGame)
    const sumOfPowers = games.reduce((sum, game) => {
        const { revelations } = game
        const maxRGBs = {
            red: 0,
            green: 0,
            blue: 0,
        }
        revelations.forEach((revelation) => {
            return Object.entries(revelation).forEach(([color, count]) => {
                if (maxRGBs[color] < count) {
                    maxRGBs[color] = count
                }
            })
        })
        const powerOfRevelation = maxRGBs.red * maxRGBs.green * maxRGBs.blue
        return powerOfRevelation + sum
    }, 0)
    return sumOfPowers
}

export { part1, part2 };


