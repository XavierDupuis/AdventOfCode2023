import { solutionner } from "../../utils/solutionner";
import { Day } from "../../utils/days";

solutionner(Day.D4, part1, part2);

interface Card {
    id: number,
    winningNumbers: Set<number>
    numbersYouHave: Set<number>
}

function parseCard(card: string): Card {
    const [name, numbers] = card.split(':')
    const id = parseInt(name.split(' ').at(-1), 10)
    const [winningNumbersList, numbersYouHaveList] = numbers.split('|').map((numArray) => numArray.trim().split(' ').filter((num) => num !== '').map((num) => parseInt(num, 10)))
    const winningNumbers = new Set(winningNumbersList)
    const numbersYouHave = new Set(numbersYouHaveList)
    return {
        id,
        winningNumbers,
        numbersYouHave
    }
}


function getCardNumberInCommonCount(card: Card) {
    let numberInCommonCount = 0
    for (const num of card.numbersYouHave) {
        if (card.winningNumbers.has(num)) {
            numberInCommonCount += 1;
        }
    }
    return numberInCommonCount;
}

function part1(lines: string[]): number {
    function getCardScore(card: Card): number {
        const numberInCommonCount = getCardNumberInCommonCount(card);
        const score = numberInCommonCount === 0 ? 0 : Math.pow(2, numberInCommonCount - 1)
        return score;
    }
    
    const cards = lines.map(parseCard)
    const cardsTotalSum = cards.reduce((sum, card) => sum + getCardScore(card), 0)
    return cardsTotalSum
}

function part2(lines: string[]): number {
    const cardCopies = new Map<number, number>()
    
    function createCopiesFromCard(card: Card) {
        const numberInCommonCount = getCardNumberInCommonCount(card);
        const copiesCount = cardCopies.get(card.id) ?? 0;
        const multiplier = copiesCount + 1;
        for (let i = 1; i <= numberInCommonCount; i++) {
            const nextCardId = card.id + i;
            const nextCardCopiesCount = cardCopies.get(nextCardId) ?? 0;
            const newNextCardCopiesCount = nextCardCopiesCount + multiplier;
            cardCopies.set(nextCardId, newNextCardCopiesCount);
        }
        return { numberInCommonCount, multiplier };
    }
    
    const cards = lines.map(parseCard)
    let cardsWon = 0
    cards.forEach((card) => {
        const { numberInCommonCount, multiplier } = createCopiesFromCard(card);
        const copiesWonFromCard = numberInCommonCount * multiplier
        cardsWon += copiesWonFromCard
    })
    const totalCards = cardsWon + cards.length
    return totalCards

}


export { part1, part2 };


