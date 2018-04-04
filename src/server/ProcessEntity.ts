import {ChildProcess} from "child_process";
import {ProgramHandler} from "./ProgramHandler";
import {ProcessStatus} from "./types/ProcessStatus";
import {Level} from "../util/Logger";
import {exec} from "child_process";
import * as fs from "fs";
import {WriteStream} from "fs";
import {dateFormat, diffBetweenDates} from "../util/Util";
import {RestartCondition} from "./types/RestartCondition";
import {ProcessConfig} from "./types/ProcessConfig";

export class ProcessEntity {

    private parent: ProgramHandler;

    public id: number;
    public process: ChildProcess;
    public timeAtLaunch: Date;
    public startRetries: number = 0;
    public restartTimes: number = 0;
    public needToBeRestarted: boolean = true;
    public endAt: Date;
    private _status: ProcessStatus;

    private wsOut: WriteStream;
    private wsErr: WriteStream;

    constructor(parent: ProgramHandler, id: number) {
        this.parent = parent;
        this.id = id;
    }

    private buildOption(): any {
        const c = this.parent.config;
        const opt: any = {};
        if (c.workingDirectory) opt.cwd = c.workingDirectory;
        if (c.environment) opt.env = c.environment;
        if (c.stopSignal) opt.killSignal = c.stopSignal;
        opt.maxBuffer =  1000 * 1000 * 1000;
        return opt;
    }

    public run() {
        const c = this.parent.config;
        this.parent.out.log(Level.INFO, `Launching: process ${c.name}.`);
        this.needToBeRestarted = true;
        this.restartTimes++;
        const currentUmask = process.umask();
        if (c.umask)
            process.umask(parseInt(c.umask, 8));
        this.timeAtLaunch = new Date();
        this._status = ProcessStatus.LAUNCHING;
        this.process = exec(c.cmd, this.buildOption());
        this.atExit();
        this.redirectProcess();
        process.umask(currentUmask);
    }

    private atExit() {
        const c = this.parent.config;
        this.process.on('exit', (code) => {
            this.closeRedirectedProcess();
            this.endAt = new Date();
            this.parent.out.log(Level.INFO, `Exit: process ${c.name} with value ${code}.`);
            this.updateStatus();
            if (this.needToBeRestarted && !this.restartOnFail() && this._status == ProcessStatus.LAUNCHED) {
                this._status = ProcessStatus.TERMINATED;
                if ((c.autoRestart == RestartCondition.ALWAYS) ||
                    (c.autoRestart == RestartCondition.UNEXPECTED && !c.exitCodes.some(e => e == code)))
                    this.run();
            }
            else
                this._status = ProcessStatus.TERMINATED;
        })
    }

    private kill(fn?: any) {
        if (this.isAlive) {
            this._status = ProcessStatus.TERMINATING;
            this.needToBeRestarted = false;
            if (fn != undefined)
                this.process.on('exit', fn());
            this.process.kill();
            setTimeout(() => {
                if (this.isAlive) this.kill(fn);
            }, this.parent.config.stopTimeSuccessful * 1000)
        }
    }


    private redirectProcess() {
        const c = this.parent.config;
        if (c.stderr) {
            this.wsErr = fs.createWriteStream(c.stderr + this.id, {encoding: 'utf8'});
            this.process.stderr.pipe(this.wsErr);
        }
        if (c.stdout) {
            this.wsOut = fs.createWriteStream(c.stdout + this.id, {encoding: 'utf8'});
            this.process.stdout.pipe(this.wsOut);
        }
    }

    private closeRedirectedProcess() {
        if (this.wsErr) this.wsErr.close();
        if (this.wsOut) this.wsOut.close();
    }

    private restartOnFail() {
        const c = this.parent.config;
        if (this._status == ProcessStatus.LAUNCHING && c.startRetries >= this.startRetries) {
            this.parent.out.log(Level.INFO, `Restarting because fail: process ${c.name}, remaining ${c.startRetries - this.startRetries}.`);
            this._status = ProcessStatus.TERMINATED;
            this.startRetries++;
            this.run();
            return true;
        }
        return false;
    }

    public stop() {
        this.parent.out.log(Level.INFO, `Terminating: process ${this.parent.config.name}.`);
        this.kill(undefined);
    }

    public restart() {
        this.parent.out.log(Level.INFO, `Restarting: process ${this.parent.config.name}.`);
        if (this.isAlive) this.kill(() => this.run());
        else this.run();
    }

    private updateStatus() {
        const startedSuccessfully = diffBetweenDates(this.timeAtLaunch, new Date()) >= this.parent.config.startTimeSuccessful;
        if (startedSuccessfully && this._status == ProcessStatus.LAUNCHING)
            this._status = ProcessStatus.LAUNCHED;
    }

    get duration() : number {
        if (this.status == ProcessStatus.TERMINATED)
            return 0;
        return diffBetweenDates(this.timeAtLaunch, new Date());
    }

    get status() : ProcessStatus {
        this.updateStatus();
        return this._status;
    }

    get isAlive() : boolean { return this._status != ProcessStatus.TERMINATED; }

    get parentName() : string { return this.parent.config.name }

    get currentName() : string { return `${this.parentName}_${this.id}` }

    get stringDuration() : string { return dateFormat(this.timeAtLaunch, "%d/%m %H:%M:%S", false) }

    get amountRestartBecauseFail() : number { return this.startRetries }

    get pid() : number { return process.pid }

    get config() : ProcessConfig { return this.parent.config }

}