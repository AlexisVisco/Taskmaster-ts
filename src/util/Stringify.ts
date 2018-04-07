import {ProgramHandler} from "../server/ProgramHandler";
import {TableGenerator} from "./TableGenerator";
import {Color} from "./Color";
import {ProcessEntity} from "../server/ProcessEntity";
import {SimpleTable} from "./SimpleTable";
import {humanDuration} from "./Util";
import {ProcessStatus} from "../server/types/ProcessStatus";

export function stringifyProgramsHandlers() : string {
    const headers = ["Name", "Health", "Processes", "Command", "Launched at"];
    const rows : Array<Array<string>> = [];
    ProgramHandler.programs.forEach(e => {
        rows.push([e.config.name, e.stringState,
            e.aliveProcesses.toString() + '/' + e.config.numProcess.toString(),
            `'${e.config.cmd}'`, e.strStartedAt]);
    });
    return TableGenerator.generateTable(headers, rows);
}

export function stringifyProgramHandler(pro: ProgramHandler) : string {
    const headers = ["Name", "Alive", "Status", "Uptime", "Pid"];
    const rows : Array<Array<string>> = [];
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

export function stringifyProcessEntity(pe: ProcessEntity) : string {
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

export function stringifyStatus(status: ProcessStatus) : string {
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