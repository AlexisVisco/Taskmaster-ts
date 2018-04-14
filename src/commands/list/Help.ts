import {CommandLabel, CommandRouter, getCommandInfo, getCommandList} from "../Commands";
import {Command} from "../Command";
import sprintf from "sprintf-js"
import {Color} from "../../util/Color";

@CommandLabel("help", "Show help of taskmaster.", ["h"])
export class Help extends Command {

    help() {
        console.log(JSON.stringify(getCommandList(), null, 2));
        console.log(typeof getCommandList());
        const max = getCommandList().reduce((max, e) => {
            return (e.label.length > max) ? e.label.length : max
        }, 0) + 2;
        this.socket.write('Usage: taskmaster COMMAND\n');
        this.socket.write('\nSelf manager of processes !\n\n');
        this.socket.write('Commands:\n');
        getCommandList().forEach(e => this.socket.write(sprintf.sprintf(` \x1b[1m%-${max}s${Color.RESET} %s\n`, `${e.label}`, e.desc)));
        this.socket.write(`\nSub-commands of each commands:\n`);
        getCommandList().forEach(e => {
            this.socket.write(` \x1b[1m${e.label}:${Color.RESET}\n`);
            const cmdInfos = getCommandInfo().get(e.className);
            if (cmdInfos && cmdInfos.length > 0) {
                cmdInfos.forEach(x => {
                    if (x.options.name && x.options.description)
                        this.socket.write(`   taskmaster ${x.options.name} - ${x.options.description}\n`);
                })
            }
            else this.socket.write('   Only default command available.\n');
            this.socket.write('\n');
        })
    }

    clone() {
        return new Help();
    }

}