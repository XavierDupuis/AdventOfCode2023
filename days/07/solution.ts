import { solutionner } from "../../utils/solutionner";
import { Day } from "../../utils/days";

interface Hand {
    cards: string,
    bid: number
}

enum HandType {
    FiveOfAKind = 6,
    FourOfAKind = 5,
    FullHouse = 4,
    ThreeOfAKind = 3,
    TwoPairs = 2,
    OnePair = 1,
    HighCard = 0,
}

function parseHands(lines: string[]): Hand[] {
    return lines.map((line) => line.split(' ')).map(([cards, bid]) => ({ cards, bid: parseInt(bid) }));
}

function compareCards(
    cardsA: string, 
    cardsB: string, 
    getHandType: (cards: string) => HandType, 
    cardPriority: Map<string, number>
): number {
    const handTypeA = getHandType(cardsA);
    const handTypeB = getHandType(cardsB);

    if (handTypeA !== handTypeB) {
        return handTypeA - handTypeB;
    }

    for (let i = 0; i < cardsA.length; i++) {
        const cardA = cardsA[i];
        const cardB = cardsB[i];
        if (cardA !== cardB) {
            return cardPriority.get(cardA) - cardPriority.get(cardB);
        }
    }

    return 0;
}

function part1(lines: string[]): number {
    const cardPriority = new Map<string, number>([
        ['A', 14],
        ['K', 13],
        ['Q', 12],
        ['J', 11],
        ['T', 10],
        ['9', 9],
        ['8', 8],
        ['7', 7],
        ['6', 6],
        ['5', 5],
        ['4', 4],
        ['3', 3],
        ['2', 2],
    ])

    function getHandType(cards: string): HandType {
        const cardTypeToCount = new Map<string, number>();
        cards.split('').forEach((card) => {
            const previousCount = cardTypeToCount.get(card) || 0;
            cardTypeToCount.set(card, previousCount + 1)
        })

        const cardCounts = [...cardTypeToCount.values()].sort((a, b) => b - a);
        const firstCardCount = cardCounts[0] || 0;
        const secondCardCount = cardCounts[1] || 0;

        if (firstCardCount === 5) {
            return HandType.FiveOfAKind;
        }
        if (firstCardCount === 4) {
            return HandType.FourOfAKind;
        }
        if (firstCardCount === 3 && secondCardCount === 2) {
            return HandType.FullHouse;
        }
        if (firstCardCount === 3) {
            return HandType.ThreeOfAKind;
        }
        if (firstCardCount === 2 && secondCardCount === 2) {
            return HandType.TwoPairs;
        }
        if (firstCardCount === 2) {
            return HandType.OnePair;
        }
        return HandType.HighCard;
    }

    const hands = parseHands(lines);
    const orderedHands = [...hands].sort((a, b) => compareCards(a.cards, b.cards, getHandType, cardPriority));

    const totalWinnings = orderedHands.reduce((acc, hand, index) => {
        const handWinnings = hand.bid * (index + 1)
        return acc + handWinnings;
    }, 0);

    return totalWinnings;
}

function part2(lines: string[]): number {
    const cardPriority = new Map<string, number>([
        ['A', 13],
        ['K', 12],
        ['Q', 11],
        ['T', 10],
        ['9', 9],
        ['8', 8],
        ['7', 7],
        ['6', 6],
        ['5', 5],
        ['4', 4],
        ['3', 3],
        ['2', 2],
        ['J', 1],
    ])

    function getHandType(cards: string): HandType {
        const cardTypeToCount = new Map<string, number>();
        let jokerCount = 0
        cards.split('').forEach((card) => {
            if (card === 'J') {
                jokerCount++;
                return;
            }
            const previousCount = cardTypeToCount.get(card) || 0;
            cardTypeToCount.set(card, previousCount + 1)
        })

        const cardCounts = [...cardTypeToCount.values()].sort((a, b) => b - a);
        const firstCardCount = cardCounts[0] || 0;
        const secondCardCount = cardCounts[1] || 0;

        if (firstCardCount + jokerCount >= 5) {
            return HandType.FiveOfAKind;
        }
        if (firstCardCount + jokerCount >= 4) {
            return HandType.FourOfAKind;
        }
        if (firstCardCount + jokerCount >= 3) {
            const remainingJokers = jokerCount - (3 - firstCardCount);
            if (secondCardCount + remainingJokers >= 2) {
                return HandType.FullHouse;
            }
            return HandType.ThreeOfAKind;
        }
        if (firstCardCount + jokerCount >= 2) {
            const remainingJokers = jokerCount - (2 - firstCardCount);
            if (secondCardCount + remainingJokers >= 2) {
                return HandType.TwoPairs;
            }
            return HandType.OnePair;
    
        }
        return HandType.HighCard;
    }

    const hands = parseHands(lines);
    const orderedHands = [...hands].sort((a, b) => compareCards(a.cards, b.cards, getHandType, cardPriority));

    console.log(orderedHands.map((hand) => `${hand.cards} ${hand.bid}`))

    const totalWinnings = orderedHands.reduce((acc, hand, index) => {
        const handWinnings = hand.bid * (index + 1)
        return acc + handWinnings;
    }, 0);

    return totalWinnings;
}

solutionner(Day.D7, part1, part2);
export { part1, part2 };