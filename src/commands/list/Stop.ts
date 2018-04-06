import {Command} from "../Command";
import {CommandLabel, CommandRouter} from "../Commands";
import {ProgramHandler} from "../../server/ProgramHandler";

@CommandLabel("stop", ["kill"])
export class Stop extends Command {

    @CommandRouter(/^all$/i, {}, 2)
    processAll() {
        this.socket.write('Stopping all process !\n');
        ProgramHandler.programs.forEach((program) => program.killAllProcesses());
    }

    @CommandRouter(/^(\w+)$/i, {}, 1)
    processName(name) {
        const prog = ProgramHandler.getByname(name);
        if (prog && prog.aliveProcesses != 0) {
            this.socket.write(`Stopping process all processes for program ${prog.config.name}.\n`);
            prog.killAllProcesses();
        }
        else this.socket.write('No program for this name.\n');
    }

    @CommandRouter(/^(\d+)$/i, {}, 2)
    processPid(pid) {
        const pe = ProgramHandler.getByPid(parseInt(pid));
        if (pe) {
            if (pe.isAlive) {
                this.socket.write(`Stopping process ${pe.currentName}.\n`);
                pe.stop();
            }
            else this.socket.write('Process is already stopped.\n');
        }
        else this.socket.write('No process found.\n');
    }

    @CommandRouter(/^(\w+) (\d+)$/i, {}, 5)
    processNameNum(name, num) {
        const pe = ProgramHandler.getByNum(name, parseInt(num));
        this.processPid(pe ? pe.pid : undefined);
    }

    help() {
        super.helpLine()
            .helpCommand("stop <name>", "Stop all processes in program $name.")
            .helpCommand("stop all", "Stop all processes actives.")
            .helpCommand("stop <pid>", "Stop the process with the pid $pid.")
            .helpCommand("stop <name> <id>", "Stop the process $id in the program $name.")
    }

    clone() {
        return new Stop();
    }
}