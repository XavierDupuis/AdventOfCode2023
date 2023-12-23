import { solutionner } from "../../utils/solutionner";
import { Day } from "../../utils/days";

enum ModuleType {
    FlipFlop = '%',
    Conjuction = '&',
    Broadcaster = 'broadcaster'
}

enum Pulse {
    Low = '0',
    High = '1'
}

enum FlipFlopState {
    On,
    Off
}

type AnyModule = FlipFlop | Conjuction | Broadcaster;

abstract class Module<State> {
    constructor (
        // TODO : change to protected
        public name: string, 
        protected type: ModuleType, 
        protected inputs: string[],
        protected outputs: string[],
    ) { }

    // TODO : change to protected
    public state: State

    public abstract receive(from: string, pulse: Pulse, modules: Map<string, AnyModule>): { lowCount: number, highCount: number};

    protected send(pulse: Pulse, modules: Map<string, AnyModule>): { lowCount: number, highCount: number} {
        const propagatedCounts = this.outputs.reduce(({ lowCount, highCount }, output) => {
            // console.log(`Sending ${pulse} from ${this.name} to ${output}`);
            const to = modules.get(output);
            if (to) {
                const propagatedPulses = to.receive(this.name, pulse, modules);
                return { lowCount: lowCount + propagatedPulses.lowCount, highCount: highCount + propagatedPulses.highCount };
            }
            // console.warn(`Module ${output} not found`)
            return { lowCount: 0, highCount: 0 };
        }, { lowCount: 0, highCount: 0 })

        if (pulse === Pulse.Low) {
            return { lowCount: propagatedCounts.lowCount + this.outputs.length, highCount: propagatedCounts.highCount };
        } else {
            return { lowCount: propagatedCounts.lowCount, highCount: propagatedCounts.highCount + this.outputs.length };
        }
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

    public receive(from: string, pulse: Pulse, modules: Map<string, AnyModule>): { lowCount: number, highCount: number } {
        if (pulse === Pulse.Low) {
            return { lowCount: 0, highCount: 0 };
        }
        if (pulse === Pulse.High) {
            this.state = this.state === FlipFlopState.Off ? FlipFlopState.On : FlipFlopState.Off;
            const pulseToSend = this.state === FlipFlopState.On ? Pulse.High : Pulse.Low;
            return this.send(pulseToSend, modules);
            // const propagatedPulses = this.send(pulseToSend, modules);
            // if (pulseToSend === Pulse.Low) {
            //     return { lowCount: propagatedPulses.lowCount + 1, highCount: propagatedPulses.highCount };
            // } else {
            //     return { lowCount: propagatedPulses.lowCount, highCount: propagatedPulses.highCount + 1 };
            // }
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

    public receive(from: string, pulse: Pulse, modules: Map<string, AnyModule>): { lowCount: number, highCount: number } {
        this.state.set(from, pulse);
        const allMemorizedPulses = Array.from(this.state.values());
        const isThereALowPulse = allMemorizedPulses.find((pulse) => pulse === Pulse.Low);
        const pulseToSend = isThereALowPulse ? Pulse.Low : Pulse.High;
        return this.send(pulseToSend, modules);
        // const propagatedPulses = this.send(pulseToSend, modules);
        // if (pulseToSend === Pulse.Low) {
        //     return { lowCount: propagatedPulses.lowCount + 1, highCount: propagatedPulses.highCount };
        // } else {
        //     return { lowCount: propagatedPulses.lowCount, highCount: propagatedPulses.highCount + 1 };
        // }
    }

    public get isAtOriginalState(): boolean {
        return Array.from(this.state.values()).every((pulse) => pulse === Conjuction.initialState);
    }
}

class Broadcaster extends Module<boolean> {
    constructor(
        name: string, 
        inputs: string[],
        outputs: string[],
    ) {
        super(name, ModuleType.Broadcaster, inputs, outputs);
        this.state = true;
    }  

    public receive(from: string, pulse: Pulse, modules: Map<string, AnyModule>): { lowCount: number, highCount: number } {
        return this.send(pulse, modules);
    }

    public get isAtOriginalState(): boolean {
        return this.state;
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

function part1(lines: string[]): number {
    const moduleList = parseModuleList(lines);
    const { inputs, outputs } = getInputsAndOutputs(moduleList);
    const modules = buildModules(moduleList, inputs, outputs);

    const broadcaster = modules.get('broadcaster');
    let i = 1;
    let d = { lowCount: 0, highCount: 0 };
    for (; i < 1000; i++) {
        const e = broadcaster.receive('broadcaster', Pulse.High, modules);
        d = { lowCount: d.lowCount + e.lowCount, highCount: d.highCount + e.highCount };
        const b = Array.from(modules.values()).find((module) => !module.isAtOriginalState);
        // console.log(b ? 'Not all modules are at their original state' : 'All modules are at their original state')
        // if (!b) {
        //     break;
        // }
    }
    console.log(i)
    console.log(d)
    return 0;
}

function part2(lines: string[]): number {
    return 0;
}

// solutionner(Day.D20, part1, part2);
export { part1, part2 };