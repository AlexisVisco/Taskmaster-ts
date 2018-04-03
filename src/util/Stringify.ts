import {ProgramHandler} from "../server/ProgramHandler";
import {TableGenerator} from "./TableGenerator";
import {Color} from "./Color";
import {ProcessEntity} from "../server/ProcessEntity";

export function stringifyProgramsHandlers() : string {
    const headers = ["Name", "Health", "Amount processes", "Alive processes", "Command", "Launched at"]
                    .map(e => `${Color.WHITE_BOLD}${e}${Color.RESET}`);
    const rows : Array<Array<string>> = [];
    ProgramHandler.programs.forEach(e => {
        rows.push([e.config.name, e.stringState, e.config.numProcess.toString(),
            e.aliveProcesses.toString(), e.config.cmd, e.strStartedAt]);
    });
    return new TableGenerator().generateTable(headers, rows);
}

export function stringifyProgramHandler(pro: ProgramHandler) : string {
    const headers = ["Name", "Alive", "Status", "Uptime", "Started", "Pid"]
        .map(e => `${Color.WHITE_BOLD}${e}${Color.RESET}`);
    const rows : Array<Array<string>> = [];
    Array.from(pro.processes.values()).forEach(entity => {
        rows.push([
            entity.currentName,
            entity.isAlive ? Color.GREEN_BOLD + "Yes" + Color.RESET : Color.RED_BOLD + "No" + Color.RESET,
            entity.status.toString(),
            entity.duration.toString(),
            entity.stringDuration,
            entity.isAlive ? entity.pid.toString() : "No pid"
        ]);
    });
    return new TableGenerator().generateTable(headers, rows);
}