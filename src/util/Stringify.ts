import {ProgramHandler} from "../server/ProgramHandler";
import {TableGenerator} from "./TableGenerator";
import {Color} from "./Color";
import {ProcessEntity} from "../server/ProcessEntity";
import {SimpleTable} from "./SimpleTable";

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
    const headers = ["Name", "Alive", "Status", "Uptime", "Started", "Pid"];
    const rows : Array<Array<string>> = [];
    Array.from(pro.processes.values()).forEach(entity => {
        rows.push([
            entity.currentName,
            entity.isAlive ? Color.GREEN_BOLD + "Yes" + Color.RESET : Color.RED_BOLD + "No" + Color.RESET,
            entity.status.toString(),
            entity.duration.toString() + 's',
            entity.stringDuration,
            entity.isAlive ? entity.pid.toString() : "No pid"
        ]);
    });
    return TableGenerator.generateTable(headers, rows);
}

export function stringifyProcessEntity(pe: ProcessEntity) : String {
    return new SimpleTable()
        .putStr("Id", pe.id.toString())
        .putStr("Name", pe.currentName)
        .putStr("Parent name", pe.parentName)
        .putStr("Alive", pe.isAlive ? "Yes" : "No")
        .putStr("Status", pe.status)
        .putStr("Pid", pe.isAlive ? pe.pid.toString() : "No pid")
        .putStr("Uptime", pe.duration.toString() + 's')
        .putStr("Restart", pe.restartTimes + " time(s)")
        .putStr("Fail restart", pe.amountRestartBecauseFail + " time(s)")
    .toStr();
}