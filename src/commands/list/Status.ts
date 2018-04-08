import {CommandLabel, CommandRouter} from "../Commands";
import {Command} from "../Command";
import * as stringify  from "../../util/Stringify";
import {ProgramHandler} from "../../server/ProgramHandler";

@CommandLabel("status", ["st", "stats"])
export class Status extends Command {

    @CommandRouter(/^all$/i, {}, 3)
    showAll() {
        this.socket.write(stringify.stringifyProgramsHandlers());
    }

    @CommandRouter(/^(\w+) (\d+)$/i, {}, 2)
    showNameWithNumber(name, num) {
        const pe = ProgramHandler.getByNum(name, parseInt(num));
        if (pe)
            this.socket.write(stringify.stringifyProcessEntity(pe));
        else
            this.socket.write(`No process with name ${name}_${num}.\n`);
    }

    @CommandRouter(/^(\d+)$/i, {}, 1)
    showWithPid(pid) {
        const pe = ProgramHandler.getByPid(parseInt(pid));
        if (pe)
            this.socket.write(stringify.stringifyProcessEntity(pe));
        else {
            this.socket.write('This PID does not allow to find a processes' +
                ' launched by taskmaster.\n');
        }
    }

    @CommandRouter(/^([a-zA-Z0-9]+)$/i)
    showWithName(name) {
        const pro = ProgramHandler.getByName(name);
        if (pro)
            this.socket.write(stringify.stringifyProgramHandler(pro));
        else
            this.socket.write('No processes specified with this name.\n');
    }

    help() {
        this.helpLine()
            .helpCommand("status <pid>", "Show the status of the processes with $pid.")
            .helpCommand("status <name>", "Show the status of the processes that contain $name.")
            .helpCommand("status <name> <num>", "Show the status of the processes that contain $name and the processes number $num.")
            .helpCommand("status all", "Show globally the status of all processes.")
    }

    clone() {
        return new Status();
    }

}