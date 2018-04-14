import {CommandLabel, CommandRouter} from "../Commands";
import {Command} from "../Command";
import * as stringify  from "../../../util/Stringify";
import {ProgramHandler} from "../../ProgramHandler";

@CommandLabel("status", "Show the status of programs, processes, process, pid.",["st", "stats"])
export class Status extends Command {

    @CommandRouter(/^all$/i, {
        name: 'status all',
        description: 'Show globally the status of all processes.'
    }, 3)
    showAll() {
        this.socket.write(stringify.stringifyProgramsHandlers());
    }

    @CommandRouter(/^(\w+) (\d+)$/i, {
        name: 'status <name> <num>',
        description: 'Show the status of the processes that contain $name and the processes number $num.'
    }, 2)
    showNameWithNumber(name, num) {
        const pe = ProgramHandler.getByNum(name, parseInt(num));
        if (pe)
            this.socket.write(stringify.stringifyProcessEntity(pe));
        else
            this.socket.write(`No process with name ${name}_${num}.\n`);
    }

    @CommandRouter(/^(\d+)$/i, {
        name: 'status <pid>',
        description: 'Show the status of the processes with $pid.'
    }, 1)
    showWithPid(pid) {
        const pe = ProgramHandler.getByPid(parseInt(pid));
        if (pe)
            this.socket.write(stringify.stringifyProcessEntity(pe));
        else {
            this.socket.write('This PID does not allow to find a processes' +
                ' launched by taskmaster.\n');
        }
    }

    @CommandRouter(/^([a-zA-Z0-9]+)$/i, {
        name: 'status <name>',
        description: 'Show the status of the processes that contain $name.'
    })
    showWithName(name) {
        const pro = ProgramHandler.getByName(name);
        if (pro)
            this.socket.write(stringify.stringifyProgramHandler(pro));
        else
            this.socket.write('No processes specified with this name.\n');
    }

    clone() {
        return new Status();
    }
}