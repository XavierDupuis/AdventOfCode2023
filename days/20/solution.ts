import { solutionner } from "../../utils/solutionner";
import { Day } from "../../utils/days";
import { get } from "http";

class Queue<T> {
    private data: T[] = [];
  
    enqueue(item: T): void {
        this.data.push(item);
    }

    dequeue(): T | undefined {
        return this.data.shift();
    }

    get size(): number {
      return this.data.length;
    }

    get isEmpty(): boolean {
        return this.size === 0;
    }
}

type PulseTransition = { from: string, pulse: Pulse, to: string }

enum ModuleType {
    FlipFlop = '%',
    Conjuction = '&',
    Broadcaster = 'broadcaster'
}

enum Pulse {
    Low = 'low',
    High = 'high'
}

enum FlipFlopState {
    On,
    Off
}

type AnyModule = FlipFlop | Conjuction | Broadcaster;

abstract class Module<State> {
    constructor (
        protected name: string, 
        protected type: ModuleType, 
        protected inputs: string[],
        protected outputs: string[],
    ) { }

    protected state: State

    public abstract receive(from: string, pulse: Pulse): PulseTransition[];

    protected createOutputPulses(pulse: Pulse): PulseTransition[] {
        return this.outputs.map((output) => ({ from: this.name, pulse, to: output }));
    }

    public abstract get isAtOriginalState(): boolean;
}

class FlipFlop extends Module<FlipFlopState> {
    static initialState = FlipFlopState.Off;
    
    constructor(
        name: string, 
        inputs: string[],
        outputs: string[],
    ) {
        super(name, ModuleType.FlipFlop, inputs, outputs);
        this.state = FlipFlop.initialState;
    }

    public receive(from: string, pulse: Pulse): PulseTransition[] {
        if (pulse === Pulse.High) {
            return [];
        }
        if (pulse === Pulse.Low) {
            this.state = this.state === FlipFlopState.Off ? FlipFlopState.On : FlipFlopState.Off;
            const nextPulse = this.state === FlipFlopState.On ? Pulse.High : Pulse.Low;
            return this.createOutputPulses(nextPulse);
        }
    }

    public get isAtOriginalState(): boolean {
        return this.state === FlipFlop.initialState;
    }
}

class Conjuction extends Module<Map<string, Pulse>> {
    static initialState = Pulse.Low;
    
    constructor(
        name: string, 
        inputs: string[],
        outputs: string[],
    ) {
        super(name, ModuleType.FlipFlop, inputs, outputs);
        this.state = new Map<string, Pulse>();
        inputs.forEach((input) => this.state.set(input, Conjuction.initialState));
    }

    public receive(from: string, pulse: Pulse): PulseTransition[] {
        this.state.set(from, pulse);
        const allMemorizedPulses = Array.from(this.state.values());
        const isThereALowPulse = allMemorizedPulses.some((pulse) => pulse === Pulse.Low);
        const nextPulse = isThereALowPulse ? Pulse.High : Pulse.Low;
        return this.createOutputPulses(nextPulse);
    }

    public get isAtOriginalState(): boolean {
        return Array.from(this.state.values()).every((pulse) => pulse === Conjuction.initialState);
    }
}

class Broadcaster extends Module<Pulse | null> {
    constructor(
        name: string, 
        inputs: string[],
        outputs: string[],
    ) {
        super(name, ModuleType.Broadcaster, inputs, outputs);
        this.state = null;
    }  

    public receive(from: string, pulse: Pulse): PulseTransition[] {
        this.state = pulse;
        return this.createOutputPulses(pulse);
    }

    public get isAtOriginalState(): boolean {
        return true;
    }
}

function getNameAndType(typeAndName: string): { name: string, type: ModuleType } {
    if (typeAndName[0] === ModuleType.FlipFlop) {
        return { type: ModuleType.FlipFlop, name: typeAndName.slice(1) };
    }
    if (typeAndName[0] === ModuleType.Conjuction) {
        return { type: ModuleType.Conjuction, name: typeAndName.slice(1) };
    }
    if (typeAndName === ModuleType.Broadcaster) {
        return { type: ModuleType.Broadcaster, name: typeAndName };
    }
    throw new Error('Unknown module type');
}

function moduleBuilder(name: string, type: ModuleType, inputs: string[], outputs: string[]): AnyModule {
    if (type === ModuleType.FlipFlop) {
        return new FlipFlop(name, inputs, outputs);
    }
    if (type === ModuleType.Conjuction) {
        return new Conjuction(name, inputs, outputs);
    }
    if (type === ModuleType.Broadcaster) {
        return new Broadcaster(name, inputs, outputs);
    }
    throw new Error('Unknown module type');
}

function parseModuleList(lines: string[]): { typeAndName: string, destinations: string[] }[] {
    return lines.map((line) => {
        const [typeAndName, destinations] = line.split(' -> ');
        return { typeAndName, destinations: destinations.split(', ') };
    });
}

function getInputsAndOutputs(
    modules: { typeAndName: string, destinations: string[] }[]
): { 
    inputs: Map<string, string[]>, 
    outputs: Map<string, string[]> 
} {
    const inputs = new Map<string, string[]>();
    const outputs = new Map<string, string[]>();
    modules.forEach((module) => {
        const name = getNameAndType(module.typeAndName).name;
        outputs.set(name, module.destinations);
        module.destinations.forEach((destination) => {
            if (inputs.has(destination)) {
                inputs.get(destination).push(name);
            } else {
                inputs.set(destination, [name]);
            }
        });
    });
    return { inputs, outputs };
}

function buildModules(
    moduleList: { typeAndName: string, destinations: string[] }[], 
    inputs: Map<string, string[]>,
    outputs: Map<string, string[]>
): Map<string, AnyModule> {
    const modules = new Map<string, AnyModule>();
    moduleList.forEach((module) => {
        const { type, name } = getNameAndType(module.typeAndName);
        modules.set(name, moduleBuilder(name, type, inputs.get(name), outputs.get(name)));
    });
    return modules;
}

function processPulse(
    modules: Map<string, AnyModule>, 
    start: PulseTransition = { from: 'button', pulse: Pulse.Low, to: 'broadcaster' }
): { 
    lowCount: number, 
    highCount: number, 
} {
    let lowCount = 0;
    let highCount = 0;

    const queue = new Queue<PulseTransition>();
    queue.enqueue(start);

    while (!queue.isEmpty) {
        const item = queue.dequeue();
        if (item.pulse === Pulse.Low) {
            lowCount++;
        } else {
            highCount++;
        }
        const to = modules.get(item.to);
        if (!to) {
            continue;
        }
        const newItems = to.receive(item.from, item.pulse);
        newItems.forEach((newItem) => queue.enqueue(newItem));
    }
    return { lowCount, highCount };
}

function getPulseCounts(
    modules: Map<string, AnyModule>, 
    maxPressCount: number
): { 
    totalLowCount: number, 
    totalHighCount: number, 
} {
    const pressEpochPulseCounts = new Map<number, { lowCount: number, highCount: number }>(); 

    let pressCount = 0;
    let loopSize = 0;
    let totalLowCount = 0;
    let totalHighCount = 0;

    while (pressCount < maxPressCount) {
        pressCount++;
        const { lowCount, highCount } = processPulse(modules);
        pressEpochPulseCounts.set(pressCount, { lowCount, highCount });
        totalHighCount += highCount;
        totalLowCount += lowCount;
        const areAllModulesAtOriginalState = Array.from(modules.values()).every((module) => module.isAtOriginalState);
        if (areAllModulesAtOriginalState) {
            loopSize = pressCount;
            break;
        }
    }

    const totalLoopCount = loopSize ? Math.floor(maxPressCount / loopSize) : 1;
    const remainingLoopCount = totalLoopCount - 1;
    totalHighCount += remainingLoopCount * totalHighCount;
    totalLowCount += remainingLoopCount * totalLowCount;

    const jumpedPressCount = pressCount + remainingLoopCount * loopSize;
    for (pressCount = jumpedPressCount; pressCount < maxPressCount; pressCount++) {
        const { lowCount, highCount } = pressEpochPulseCounts.get(pressCount % loopSize);
        totalHighCount += highCount;
        totalLowCount += lowCount;
    }

    return { totalLowCount, totalHighCount };
}

function part1(lines: string[]): number {
    const maxPressCount = 1000;
    const moduleList = parseModuleList(lines);
    const { inputs, outputs } = getInputsAndOutputs(moduleList);
    const modules = buildModules(moduleList, inputs, outputs);
    const { totalLowCount, totalHighCount } = getPulseCounts(modules, maxPressCount);
    const productOfPulses = totalHighCount * totalLowCount;
    return productOfPulses;
}

function part2(lines: string[]): number {
    return 0;
}

solutionner(Day.D20, part1, part2);
export { part1, part2 };