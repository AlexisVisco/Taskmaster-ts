import {CommandLabel, CommandRouter} from "../Commands";
import {Command} from "../Command";

@CommandLabel("hello")
export class Test extends Command{

    @CommandRouter(/^(\w+)$/i, {}, 1)
    testCommand(name: string) {
        console.log("Yeah 2 " + name)
    }

    @CommandRouter(/^(\d+)$/i, {}, 0)
    testCommand2(name: string) {
        console.log("Yeah 3 " + parseInt(name).toString(16))
    }

    @CommandRouter(/^(\d+)$/i, {}, 3)
    testCommand3(name: string) {
        console.log("Yeah 1" + " " + name)
    }

    help() {
        this.helpLine()
            .lineCommand("hello <name>", "Do something $name ...............")
            .lineCommand("hello <number>", "Do something" +
                " .........$number......")
    }

}