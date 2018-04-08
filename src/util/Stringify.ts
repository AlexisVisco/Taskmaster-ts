import {ProgramHandler} from "../server/ProgramHandler";
import {TableGenerator} from "./TableGenerator";
import {Color} from "./Color";
import {ProcessEntity} from "../server/ProcessEntity";
import {SimpleTable} from "./SimpleTable";
import {humanDuration} from "./Util";
import {ProcessStatus} from "../server/types/ProcessStatus";
import {ProcessConfig, processConfigkeys} from "../server/types/ProcessConfig";

export function stringifyProgramsHandlers(): string {
    const headers = ["Name", "Health", "Processes", "Command", "Launched at"];
    const rows: Array<Array<string>> = [];
    console.log(ProgramHandler.programs);
    ProgramHandler.programs.forEach(e => {
        rows.push([e.config.name, e.stringState,
            e.aliveProcesses.toString() + '/' + e.config.numProcess.toString(),
            `'${e.config.cmd}'`, e.strStartedAt]);
    });
    return TableGenerator.generateTable(headers, rows);
}

export function stringifyProgramHandler(pro: ProgramHandler): string {
    const headers = ["Name", "Alive", "Status", "Uptime", "Pid"];
    const rows: Array<Array<string>> = [];
    Array.from(pro.processes.values()).forEach(entity => {
        rows.push([
            entity.currentName,
            entity.isAlive ? Color.GREEN_BOLD + "Yes" + Color.RESET : Color.RED_BOLD + "No" + Color.RESET,
            stringifyStatus(entity.status),
            humanDuration(entity.duration),
            entity.isAlive ? entity.pid.toString() : "No pid"
        ]);
    });
    return TableGenerator.generateTable(headers, rows);
}

export function stringifyProcessEntity(pe: ProcessEntity): string {
    return new SimpleTable()
        .putStr("Id", pe.id.toString())
        .putStr("Name", pe.currentName)
        .putStr("Parent name", pe.parentName)
        .putStr("Alive", pe.isAlive ? "Yes" : "No")
        .putStr("Status", stringifyStatus(pe.status))
        .putStr("Pid", pe.isAlive ? pe.pid.toString() : "No pid")
        .putStr("Uptime", humanDuration(pe.duration))
        .putStr("Restart", pe.restartTimes + " time(s)")
        .putStr("Fail restart", pe.amountRestartBecauseFail + " time(s)")
        .toStr();
}

export function stringifyStatus(status: ProcessStatus): string {
    switch (status) {
        case ProcessStatus.LAUNCHING :
            return Color.YELLOW + "Launching..." + Color.RESET;
        case ProcessStatus.LAUNCHED :
            return Color.GREEN + "Launched" + Color.RESET;
        case ProcessStatus.TERMINATING :
            return Color.PURPLE + "Terminating..." + Color.RESET;
        case ProcessStatus.TERMINATED:
            return Color.RED + "Terminated" + Color.RESET;
    }
}

export function stringifyConfig(config: ProcessConfig) : string {
    let ret = `${config.name}:\n`;
    for (let key of processConfigkeys()) {
        if (config[key] != undefined)
            ret += `  ${key}: ${JSON.stringify(config[key])}\n`
    }
    return ret;
}

export function stringifyDiffConfig(origin: ProcessConfig, newer: ProcessConfig): string {

    const green = (key, value) => `  ${Color.GREEN}+ ${key}: ${JSON.stringify(value)}${Color.RESET}\n`;
    const red = (key, value) => `  ${Color.RED}- ${key}: ${JSON.stringify(value)}${Color.RESET}\n`;
    const normal = (key, value) => `  ${key}: ${JSON.stringify(value)}\n`;
    const und = (o, v) => !o || o[v] == undefined;

    let ret = `${newer ? newer.name : origin.name}:\n`;
    for (let key of processConfigkeys()) {
        if (!und(origin, key) || !und(newer, key)) {
            if (und(origin, key) && !und(newer, key))
                ret += green(key, newer[key]);
            else if (!und(origin, key) && und(newer, key))
                ret += red(key, origin[key]);
            else if (JSON.stringify(origin[key]) == JSON.stringify(newer[key]))
                ret += normal(key, origin[key]);
            else {
                ret += red(key, origin[key]);
                ret += green(key, newer[key]);
            }
        }
    }
    return ret;
}