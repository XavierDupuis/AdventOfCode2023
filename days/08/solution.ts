import { solutionner } from "../../utils/solutionner";
import { Day } from "../../utils/days";

enum Instruction {
    Left = "L",
    Right = "R",
}

interface Node {
    name: string,
    left: Node | null,
    right: Node | null,
}

interface Context {
    instructions: string;
    nodes: {
        name: string,
        left: string,
        right: string,
    }[];
}

function parseContext(lines: string[]): Context {
    const instructions = lines[0]
    const nodes = lines.slice(2).map((line) => {
        const [name, left, right] = line.match(/\w+/g);
        return {
            name,
            left,
            right
        }
    })

    return {
        instructions,
        nodes
    }
}

function getNodeGraph(context: Context) {
    const nodeGraph = new Map<string, Node>();
    context.nodes.forEach(({ name, left, right }) => {
        const leftNode = setNode(nodeGraph, left);
        const rightNode = setNode(nodeGraph, right);
        const newNode = nodeGraph.get(name);
        if (newNode) {
            newNode.left = leftNode;
            newNode.right = rightNode;
        } else {
            nodeGraph.set(name, { name, left: leftNode, right: rightNode });
        }
    });
    return nodeGraph;
}

function setNode(nodeGraph: Map<string, Node>, name: string) {
    const isStored = nodeGraph.has(name);
    const node = isStored ? nodeGraph.get(name) : { name, left: null, right: null };
    if (!isStored) {
        nodeGraph.set(name, node);
    }
    return node;
}

function getNumberOfSteps(start: Node, EndToken: string, instructions: string) {
    let current = start;
    let instructionIndex = 0;
    while (!current.name.endsWith(EndToken)) {
        current = getNextStep(instructions, instructionIndex++, current);
    }
    return instructionIndex;
}

function getNextStep(instructions: string, instructionIndex: number, current: Node): Node {
    const instruction = instructions.at(instructionIndex++ % instructions.length);
    switch (instruction) {
        case Instruction.Left:
            current = current?.left;
            break;
        case Instruction.Right:
            current = current?.right;
            break;
        default:
            throw new Error(`Unknown instruction ${instruction}`);
    }
    if (!current) {
        throw new Error(`Unknown node ${current} from instruction ${instruction}`);
    }
    return current;
}

function greatestCommonDivisor(x: number, y: number): number {
    return !y ? x : greatestCommonDivisor(y, x % y);
}


function leastCommonDivisor(x: number, y: number) {
    return (x * y) / greatestCommonDivisor(x, y);
} 

function arrayLeastCommonDivisor(values: number[]): number {
    return values.reduce((lcm, current) => leastCommonDivisor(lcm, current));
};

function part1(lines: string[]): number {
    const context = parseContext(lines);
    const nodeGraph = getNodeGraph(context);
    const startIdentifier = "AAA";
    const endIdentifier = "ZZZ";
    const numberOfSteps = getNumberOfSteps(nodeGraph.get(startIdentifier), endIdentifier, context.instructions);
    return numberOfSteps;
}

function part2(lines: string[]): number {
    const context = parseContext(lines);
    const nodeGraph = getNodeGraph(context);

    const startIdentifier = "A";
    const endIdentifier = "Z";

    const startNodes = new Set<Node>([...nodeGraph.values()].filter((node) => node.name.endsWith(startIdentifier)));
    const numbersOfSteps = [...startNodes].map((startNode) => getNumberOfSteps(startNode, endIdentifier, context.instructions));
    const stepsLeastCommonDivisor = arrayLeastCommonDivisor(numbersOfSteps)
    return stepsLeastCommonDivisor;
}

solutionner(Day.D8, part1, part2);
export { part1, part2 };