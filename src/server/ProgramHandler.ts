import {Logger} from "../util/Logger";
import {ProcessEntity} from "./ProcessEntity";
import {ProcessConfig} from "./types/ProcessConfig";

export class ProgramHandler {

    public out : Logger;

    public config: ProcessConfig;
    public processes: Map<number, ProcessEntity> = new Map();
    public started: boolean = false;
    public startedAt: Date;

    constructor(config: ProcessConfig) {
        this.out = new Logger(config.name, `/${config.name}/at`);
        this.config = config;
    }
}