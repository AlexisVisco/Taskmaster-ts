import {Command} from "../Command";
import {CommandLabel, CommandRouter} from "../Commands";
import {ProgramHandler} from "../../server/ProgramHandler";

@CommandLabel("stop", "Stop programs, processes, process, pid", ["kill"])
export class Stop extends Command {

    @CommandRouter(/^all$/i, {
        name: 'stop all',
        description: 'Stop all processes actives.'
    }, 2)
    processAll() {
        this.socket.write('Stopping all process !\n');
        ProgramHandler.programs.forEach((program) => program.killAllProcesses());
    }

    @CommandRouter(/^(\w+)$/i, {
        name: 'stop <name>',
        description: 'Stop all processes in program $name.'
    }, 1)
    processName(name) {
        const prog = ProgramHandler.getByName(name);
        if (prog && prog.aliveProcesses != 0) {
            this.socket.write(`Stopping process all processes for program ${prog.config.name}.\n`);
            prog.killAllProcesses();
        }
        else this.socket.write('No program for this name.\n');
    }

    @CommandRouter(/^(\d+)$/i, {
        name: 'stop <pid>',
        description: 'Stop the process with the pid $pid.'
    }, 2)
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

    @CommandRouter(/^(\w+) (\d+)$/i, {
        name: 'stop <name> <id>',
        description: 'Stop the process $id in the program $name.'
    }, 5)
    processNameNum(name, num) {
        const pe = ProgramHandler.getByNum(name, parseInt(num));
        this.processPid(pe ? pe.pid : undefined);
    }

    clone() {
        return new Stop();
    }
}