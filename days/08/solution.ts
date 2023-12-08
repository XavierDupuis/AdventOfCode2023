import { solutionner } from "../../utils/solutionner";
import { Day } from "../../utils/days";

const Start = "AAA";
const End = "ZZZ";

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
        const isLeftStored = nodeGraph.has(left);
        const leftNode = isLeftStored ? nodeGraph.get(left) : { name: left, left: null, right: null };
        if (!isLeftStored) {
            nodeGraph.set(left, leftNode);
        }

        const isRightStored = nodeGraph.has(right);
        const rightNode = isRightStored ? nodeGraph.get(right) : { name: right, left: null, right: null };
        if (!isRightStored) {
            nodeGraph.set(right, rightNode);
        }

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

function part1(lines: string[]): number {
    const context = parseContext(lines);
    const nodeGraph = getNodeGraph(context);

    let current = nodeGraph.get(Start);

    let instructionIndex = 0;
    while (current.name !== End) {
        const instruction = context.instructions.at(instructionIndex++ % context.instructions.length)
        if (instruction === Instruction.Left) {
            current = current?.left;
        } else if (instruction === Instruction.Right) {
            current = current?.right;
        } else {
            throw new Error(`Unknown instruction ${instruction}`);
        }
        if (!current) {
            throw new Error(`Unknown node ${current} from instruction ${instruction}`);
        }
    }

    return instructionIndex;
}

function part2(lines: string[]): number {
    return 0;
}

solutionner(Day.D8, part1, part2);
export { part1, part2 };