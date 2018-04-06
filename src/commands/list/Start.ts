import {Command} from "../Command";
import {CommandLabel, CommandRouter} from "../Commands";
import {ProgramHandler} from "../../server/ProgramHandler";

@CommandLabel("start", ["start", "go"])
export class Start extends Command {

    @CommandRouter(/^not-launched$/i, {}, 3)
    launchNotLaunched() {
        ProgramHandler.programs.forEach(e => {
            Array.from(e.processes.values()).forEach(a => {
                if (!a.isAlive) {
                    this.socket.write(`Launching process ${a.currentName} !\n`);
                    a.run();
                }
            })
        })
    }

    @CommandRouter(/(\w+)/i)
    startProcess(name) {
        const prog = ProgramHandler.getByname(name);
        if (prog) {
            if (!prog.canRestart()) this.socket.write(`Can't start all processes.\n`);
            else {
                this.socket.write(`Starting all processes ${prog.config.cmd}.\n`);
                prog.startAllProcesses();
            }
        }
        else this.socket.write(`No program found for ${name}.\n`)
    }

    @CommandRouter(/^not-launched (\w+)$/i, {}, 2)
    startProcessNotLaunched(name) {
        const prog = ProgramHandler.getByname(name);
        if (prog) {
            Array.from(prog.processes.values()).forEach(a => {
                if (!a.isAlive) {
                    this.socket.write(`Launching process ${a.currentName} !\n`);
                    a.run();
                }
            })
        }
        else this.socket.write(`No program found for ${name}.\n`)
    }

    @CommandRouter(/(\w+) (\d+)/i, {}, 4)
    startSpecificProcess(name, num) {
        num = parseInt(num);
        const proc = ProgramHandler.getByNum(name, num);
        if (proc) {
            if (!proc.isAlive) {
                this.socket.write(`Launching process ${proc.currentName}.\n`);
                proc.run();
            }
            else this.socket.write(`Process ${proc.currentName} is already launched.\n`);
        }
        else this.socket.write(`The process is unknown or has never been initialized, to initialize it: 'start not-launched'.\n`);
    }

    clone() {
        return new Start();
    }

    help() {
        this.helpLine()
            .helpCommand("start <name>", "Launch processes for the program named $name in the configuration.")
            .helpCommand("start <name> <number>", "Launch the processes number $number of the program $name.")
            .helpCommand("start not-launched", "Start all processes that are not launched yet.")
            .helpCommand("start not-launched <name>", "Start all processes that are not launched yet in program $name.")
    }

}