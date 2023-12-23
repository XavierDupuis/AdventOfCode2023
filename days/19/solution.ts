import { solutionner } from "../../utils/solutionner";
import { Day } from "../../utils/days";

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

type RuleResult = WorkflowName | PartStatus.Accepted | PartStatus.Rejected;

interface Rule {
    condition?: Condition;
    next: RuleResult;
}

type Workflow = Rule[]

type Part = {
    [k in Category]: number;
}

interface Range {
    min: number;
    max: number;
}

type RangeGroup = {
    [k in Category]: Range | null;
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
                const next = beforeAndNext[0] as RuleResult;
                return { next };
            }
            const category = beforeAndNext[0].at(0) as Category;
            const operator = beforeAndNext[0].at(1) as Operator;
            const value = parseInt(beforeAndNext[0].slice(2));
            const next = beforeAndNext[1] as RuleResult;
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

function getAcceptedRangesForWorkflow(
    range: RangeGroup, 
    workflow: Workflow, 
    workflows: Map<WorkflowName, Workflow>
): RangeGroup[] {
    return getRangesForWorkflowRecursive(range, workflow, workflows).accepted;
}

function getRangesForWorkflowRecursive(
    range: RangeGroup, 
    workflow: Workflow, 
    workflows: Map<WorkflowName, Workflow>
): { 
    toPropagate: RangeGroup[], 
    accepted: RangeGroup[], 
} {
    const ranges: { ruleResult: RuleResult, updatedRange: RangeGroup}[] = [];
    let remainingRange = { ...range };
    for (let rule of workflow) {
        let updatedRange = remainingRange;
        if (rule.condition) {
            const { used, remaining } = getRange(rule.condition, remainingRange);
            remainingRange = remaining;
            updatedRange = used;
        } else {
            updatedRange = remainingRange;
            remainingRange = null;
        }
        ranges.push({ ruleResult: rule.next, updatedRange });
    }

    const newToPropagate: RangeGroup[] = [];
    const newAccepted: RangeGroup[] = [];

    for (let { ruleResult, updatedRange } of ranges) {
        switch (ruleResult) {
            case PartStatus.Accepted:
                newAccepted.push(updatedRange);
                break;
            case PartStatus.Rejected:
                break;
            default: // WorkflowName
                const nextWorkflow = workflows.get(ruleResult);
                const { toPropagate, accepted } = getRangesForWorkflowRecursive(updatedRange, nextWorkflow, workflows);
                newToPropagate.push(...toPropagate);
                newAccepted.push(...accepted);
                break;
        }
    }
    return { toPropagate: newToPropagate, accepted: newAccepted };
}

function getRange({ category, operator, value }: Condition, range: RangeGroup): { used: RangeGroup, remaining: RangeGroup } {
    // Assumes that max (or min) is included in the range
    switch (operator) {
        case Operator.GT: {
            const min = Math.max(range[category].min, value + 1);
            const max = range[category].max;
            const used = { ...range, [category]: { min, max } };
            const remaining = { ...range, [category]: { min: range[category].min, max: value } };
            return { used, remaining };
        }
        case Operator.LT: {
            const min = range[category].min;
            const max = Math.min(range[category].max, value - 1);
            const used = { ...range, [category]: { min, max } };
            const remaining = { ...range, [category]: { min: value, max: range[category].max } };
            return { used, remaining };
        }
    }
}

function getUniqueAcceptedPartsCount(ranges: RangeGroup[]): number {
    return ranges.reduce((count, range) => {
        const { x, m, a, s } = range;
        return count + (x.max - x.min + 1) * (m.max - m.min + 1) * (a.max - a.min + 1) * (s.max - s.min + 1);
    }, 0);
}

function part1(lines: string[]): number {
    const { workflows, parts } = parseWorkflowsAndParts(lines);
    const start = workflows.get('in');
    const acceptedParts = parts.filter((part) => processPart(start, workflows, part) === PartStatus.Accepted);
    const acceptedPartsSum = acceptedParts.reduce((sum, { x, m, a, s }) => sum + x + m + a + s, 0);
    return acceptedPartsSum;
}

function part2(lines: string[]): number {
    const { workflows, parts } = parseWorkflowsAndParts(lines);
    const start = workflows.get('in');
    const startRange: RangeGroup = {
        x: { min: 1, max: 4000 },
        m: { min: 1, max: 4000 },
        a: { min: 1, max: 4000 },
        s: { min: 1, max: 4000 },
    };
    const acceptedRanges = getAcceptedRangesForWorkflow(startRange, start, workflows);
    const acceptedPartsCount = getUniqueAcceptedPartsCount(acceptedRanges);
    return acceptedPartsCount;
}

solutionner(Day.D19, part1, part2);
export { part1, part2 };