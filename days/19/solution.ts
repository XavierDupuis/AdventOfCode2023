import { solutionner } from "../../utils/solutionner";
import { Day } from "../../utils/days";
import { parse } from "path";

enum Category {
    x = 'x',
    m = 'm',
    a = 'a',
    s = 's'
}

enum Operator {
    GT = '>',
    LT = '<',
}

interface Condition {
    category: Category;
    operator: Operator;
    value: number;
}

enum PartStatus {
    Accepted = 'A',
    Rejected = 'R'
}

type WorkflowName = string;

type RuleOutput = WorkflowName | PartStatus.Accepted | PartStatus.Rejected;

interface Rule {
    condition?: Condition;
    next: RuleOutput;
}

type Workflow = Rule[]

type Part = {
    [k in Category]: number;
}

function parseWorkflowsAndParts(lines: string[]): { workflows: Map<WorkflowName, Workflow>, parts: Part[] } {
    const workflows = new Map<WorkflowName, Workflow>();
    const parts: Part[] = [];

    let currentLineIndex = 0;
    let currentLine;
    while ((currentLine = lines.at(currentLineIndex++))?.length) {
        const [workflowName, workflowRules] = currentLine.split('{');
        const workflow = workflowRules.slice(0, -1).split(',').map((rule) => {
            const beforeAndNext = rule.split(':');
            if (beforeAndNext.length === 1) {
                const next = beforeAndNext[0] as RuleOutput;
                return { next };
            }
            const category = beforeAndNext[0].at(0) as Category;
            const operator = beforeAndNext[0].at(1) as Operator;
            const value = parseInt(beforeAndNext[0].slice(2));
            const next = beforeAndNext[1] as RuleOutput;
            const condition: Condition = { category, operator, value };
            return { condition, next };
        });
        workflows.set(workflowName, workflow);
    }
    while ((currentLine = lines.at(currentLineIndex++))?.length) {
        const [x, m, a, s] = currentLine.slice(1, -1).split(',').map((value) => parseInt(value.slice(2)));
        parts.push({ x, m, a, s });
    }

    return { workflows, parts };
}

function isRuleAppliedForPart(rule: Rule, part: Part): boolean {
    if (rule.condition) {
        const { category, operator, value } = rule.condition;
        switch (operator) {
            case Operator.GT: return part[category] > value;
            case Operator.LT: return part[category] < value;
        }
    }
    return true;
}

function processPart(start: Workflow, workflows: Map<WorkflowName, Workflow>, part: Part): PartStatus | null {
    let current = start;
    while (true) {
        const rule = current.find((rule) => isRuleAppliedForPart(rule, part));
        if (!rule) {
            return null;
        }
        if (rule.next === PartStatus.Accepted || rule.next === PartStatus.Rejected) {
            return rule.next;
        }
        current = workflows.get(rule.next);
    }
}

function part1(lines: string[]): number {
    const { workflows, parts } = parseWorkflowsAndParts(lines);
    const start = workflows.get('in');
    const acceptedParts = parts.filter((part) => processPart(start, workflows, part) === PartStatus.Accepted);
    const acceptedPartsSum = acceptedParts.reduce((sum, { x, m, a, s }) => sum + x + m + a + s, 0);
    return acceptedPartsSum;
}

function part2(lines: string[]): number {
    return 0;
}

solutionner(Day.D19, part1, part2);
export { part1, part2 };