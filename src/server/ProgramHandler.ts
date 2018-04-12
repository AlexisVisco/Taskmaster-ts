import {Level, Logger} from "../util/Logger";
import {ProcessEntity} from "./ProcessEntity";
import {ProcessConfig} from "./types/ProcessConfig";
import {Color} from "../util/Color";
import {dateFormat} from "../util/Util";

export class ProgramHandler {

    static programs : Array<ProgramHandler> = [];
    public out : Logger;

    public config: ProcessConfig;
    public processes: Map<number, ProcessEntity> = new Map();
    public started: boolean = false;
    public startedAt: Date;

    constructor(config: ProcessConfig) {
        this.out = new Logger(config.name, config.name);
        this.out.log(Level.INFO, `--------------- NEW INSTANCE ${config.name.toUpperCase()} ---------------`);
        this.config = config;
        if (config.autoStart) {
            this.startAllProcesses();
        }
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
            this.started = false;
            for (let [_, entity] of this.processes.entries()) entity.stop();
            return true;
        }
        return false;
    }

    public startAllProcesses() : boolean {
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

    public updateConfig(pc: ProcessConfig) {
        this.out.log(Level.INFO, `Reloading config`);
        const numProcess = pc.numProcess;
        const oldProc = this.config.numProcess;
        console.log(this.started, numProcess, oldProc);
        if (this.started) {
            if (numProcess > oldProc) {
                for (let i = oldProc; i < numProcess; i++) {
                    const pe = new ProcessEntity(this, i);
                    this.processes.set(i, pe);
                    this.out.log(Level.INFO, `Adding process ${i} cause reload.`);
                    pe.run();
                }
            }
            else if (oldProc > numProcess) {
                for (let i = oldProc - 1; i > numProcess - 1; i--) {
                    this.out.log(Level.INFO, `Removing process ${i} cause reload.`);
                    const pe = this.processes.get(i);
                    if (pe) pe.stop();
                    this.processes.delete(i);
                }
            }
        }
        this.config = pc;
    }

    public destroy() {
        this.out.log(Level.INFO, `Removing program ${this.config.name}.`);
        if (this.started)
           Array.from(this.processes.values()).forEach(e => e.stop());
        ProgramHandler.programs = ProgramHandler.programs.filter(e => e.config.name != this.config.name);
    }

    public canRestart() : boolean {
        return !Array.from(this.processes.values()).some(e => e.isAlive);
    }

    get aliveProcesses() : number {
        const array : Array<ProcessEntity> = Array.from(this.processes.values());
        return array.filter(a => a.isAlive).length
    }

    get stringState() : string {
        const i = Math.round(((this.aliveProcesses / this.config.numProcess) * 3.0));
        if (i == 1) return Color.RED_BOLD + "Danger" + Color.RESET;
        if (i == 2) return Color.YELLOW_BOLD + "Warning" + Color.RESET;
        if (i == 3) return Color.GREEN_BOLD_BRIGHT + "Ok" + Color.RESET;
        else return Color.WHITE_BRIGHT + Color.RED_BACKGROUND + "Critical" + Color.RESET;
    }

    get strStartedAt() : string {
        return this.startedAt ? dateFormat(this.startedAt, "%d/%m %H:%M:%S", false) : 'Not launched';
    }

    public static getByPid(pid: number) : ProcessEntity | undefined {
        for (let ph of ProgramHandler.programs) {
            for (let [_, entity] of ph.processes.entries())
                if (entity.isAlive && entity.pid == pid) return entity;
        }
        return undefined;
    }

    public static getByNum(name: string, num: number) : ProcessEntity | undefined {
        const prog = ProgramHandler.programs.find(e => e.config.name.toLowerCase() == name.toLowerCase());
        if (prog) {
            const pro = prog.processes.get(num);
            if (pro) return pro;
            else return undefined;
        }
        return undefined;
    }

    public static getByName(name: string) : ProgramHandler | undefined {
        const prog = ProgramHandler.programs.find(e => e.config.name == name);
        if (prog) return prog;
        return undefined;
    }
}