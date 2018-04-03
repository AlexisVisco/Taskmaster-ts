import {Level, Logger} from "../util/Logger";
import {ProcessEntity} from "./ProcessEntity";
import {ProcessConfig} from "./types/ProcessConfig";
import {Color} from "../util/Color";
import {dateFormat} from "../util/Util";

export class ProgramHandler {

    private static programs : Array<ProgramHandler> = [];
    public out : Logger;

    public config: ProcessConfig;
    public processes: Map<number, ProcessEntity> = new Map();
    public started: boolean = false;
    public startedAt: Date;

    constructor(config: ProcessConfig) {
        this.out = new Logger(config.name, `/${config.name}/at`);
        this.out.log(Level.INFO, `--------------- NEW INSTANCE ${config.name.toUpperCase()} ---------------`);
        this.config = config;
        if (config.autoStart)
            this.startAll();
        ProgramHandler.programs.push(this);
    }

    public killProcess(num: number) : boolean {
        const pro = this.processes.get(num);
        if (pro) {
            pro.stop();
            return true;
        }
        return false;
    }

    public killAllProcesses() : boolean {
        if (this.started) {
            for (let [_, entity] of this.processes.entries())
                entity.stop();
            return true;
        }
        return false;
    }

    private startAll() : boolean {
        if (!this.started || this.canRestart()) {
            this.started = true;
            this.startedAt = new Date();
            for (let i = 0; i < this.config.numProcess; i++) {
                const pe = new ProcessEntity(this, i);
                pe.run();
                this.processes.set(i, pe);
            }
            return true;
        }
        return false;
    }

    private canRestart() : boolean {
        for (const [_, entity] of this.processes.entries()) {
            if (entity.isAlive) return false;
        }
        return true;
    }

    get aliveProcesses() : number {
        const array : Array<ProcessEntity> = Array.from(this.processes.values());
        return array.filter(a => a.isAlive).length
    }

    get stringState() : string {
        const i = Math.round(((this.aliveProcesses / this.config.numProcess) * 3.0));
        if (i == 1) return Color.RED_BOLD + "danger :x" + Color.RESET;
        if (i == 2) return Color.YELLOW_BOLD + "warning :o" + Color.RESET;
        if (i == 3) return Color.GREEN_BOLD_BRIGHT + "like a charm c:" + Color.RESET;
        else return Color.WHITE_BRIGHT + Color.RED_BACKGROUND + "critical :z" + Color.RESET;
    }

    get strStartedAt() : string {
        return dateFormat(this.startedAt, "%d/%m %H:%M:%S", false);
    }

    public static getByPid(pid: number) : ProcessEntity | undefined {
        for (let ph of ProgramHandler.programs) {
            for (let [_, entity] of ph.processes.entries())
                if (entity.isAlive && entity.pid) return entity;
        }
        return undefined;
    }

    public static getByNum(name: string, num: number) : ProcessEntity | undefined {
        const prog = ProgramHandler.programs.find(e => e.config.name == name);
        if (prog) {
            const pro = prog.processes.get(num);
            if (pro) return pro;
            else return undefined;
        }
        return undefined;
    }

    public static getByname(name: string) : ProgramHandler | undefined {
        const prog = ProgramHandler.programs.find(e => e.config.name == name);
        if (prog) return prog;
        return undefined;
    }
}