import {CommandLabel, CommandRouter} from "../Commands";
import {Command} from "../Command";
import * as stringify  from "../../util/Stringify";
import {ProgramHandler} from "../../server/ProgramHandler";

@CommandLabel("status", ["st", "stats"])
export class Status extends Command {

    @CommandRouter(/^all$/g, {}, 3)
    showAll() {
        this.socket.write(stringify.stringifyProgramsHandlers());
    }

    @CommandRouter(/^(\w+) (\d+)$/g, {}, 2)
    showNameWithNumber(name, num) {
        const pe = ProgramHandler.getByNum(name, num);
        if (pe)
            this.socket.write(stringify.stringifyProcessEntity(pe));
        else
            this.socket.write(`No process with name ${name}_${num}.`);
    }

    @CommandRouter(/^(\d+)$/g, {}, 1)
    showWithPid(pid) {
        const pe = ProgramHandler.getByPid(pid);
        if (pe)
            this.socket.write(stringify.stringifyProcessEntity(pe));
        else {
            this.socket.write('This PID does not allow to find a processes' +
                ' launched by taskmaster.');
        }
    }

    @CommandRouter(/^([a-zA-Z0-9]+)$/g)
    showWithName(name) {
        const pro = ProgramHandler.getByname(name);
        if (pro)
            this.socket.write(stringify.stringifyProgramHandler(pro));
        else
            this.socket.write('No processes specified with this name.');
    }

    help() {
        this.helpLine()
            .helpCommand("status <pid>", "Show the status of the processes with $pid.")
            .helpCommand("status <name>", "Show the status of the processes that contain $name.")
            .helpCommand("status <name> <num>", "Show the status of the processes that contain $name and the processes number $num.")
            .helpCommand("status all", "Show globally the status of all processes.")
    }

}