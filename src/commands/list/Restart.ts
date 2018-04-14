import {CommandLabel, CommandRouter} from "../Commands";
import {Command} from "../Command";
import {ProgramHandler} from "../../server/ProgramHandler";

@CommandLabel("restart", "Restart programs, program, processes, process, pid.", ["relaunch", "reexecute"])
export class Restart extends Command {

    @CommandRouter(/^all$/i, {
        name: "restart all",
        description: "Restart all processes of each programs."
    }, 2)
    processAll() {
        this.socket.write('Restarting all processes !\n');
        ProgramHandler.programs.forEach(e => Array.from(e.processes.values()).forEach(x => x.restart()))
    }

    @CommandRouter(/^(\w+)$/i, {
        name: "restart <name>",
        description: "Restart all processes in program $name"
    }, 1)
    processName(name) {
        const prog = ProgramHandler.getByName(name);
        if (prog) {
            this.socket.write(`Restarting all processes of ${name}.\n`);
            Array.from(prog.processes.values()).forEach(e => e.restart());
        }
        else this.socket.write(`No program named ${name}.\n`);
    }

    @CommandRouter(/^(\w+) (\d+)$/i, {
        name: "restart <name> <num>",
        description: "Restart process number $num in program $name."
    }, 3)
    processNameNum(name, num) {
        num = parseInt(num);
        const proc = ProgramHandler.getByNum(name, num);
        if (proc) {
            this.socket.write(`Restarting process ${proc.currentName}.\n`);
            proc.restart();
        }
        else this.socket.write(`No process named ${name}_${num}.\n`);
    }

    @CommandRouter(/^(\d+)$/i, {
        name: "restart <pid>",
        description: "Restart the processes with pid $pid."
    }, 2)
    processPid(pid) {
        pid = parseInt(pid);
        const proc = ProgramHandler.getByPid(pid);
        if (proc) this.processNameNum(proc.parentName, proc.id);
        else this.socket.write(`No process for pid ${pid}.\n`)
    }

    clone() {
        return new Restart();
    }
}