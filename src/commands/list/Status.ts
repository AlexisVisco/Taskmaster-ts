import {CommandLabel} from "../Commands";
import {Command} from "../Command";

@CommandLabel("status", ["st", "stats"])
export class Status extends Command {


    help() {
        this.helpLine()
            .helpCommand("status <pid>", "Show the status of the processes with $pid.")
            .helpCommand("status <name>", "Show the status of the processes that contain $name.")
            .helpCommand("status <name> <num>", "Show the status of the processes that contain $name and the processes number $num.")
            .helpCommand("status all", "Show globally the status of all processes.")
    }

}