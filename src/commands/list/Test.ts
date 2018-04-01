import {CommandRouter} from "../Commands";
import {Command} from "../Command";

export class Test extends Command{

    @CommandRouter(/salut (\d+)/, {}, 3)
    testCommand3(name: string) {
        console.log("Yeah 1" + " " + name)
    }

    @CommandRouter(/hello (\w+)/, {}, 1)
    testCommand(name: string) {
        console.log("Yeah 2")
    }

    @CommandRouter(/hello (\d+)/, {}, 0)
    testCommand2(name: string) {
        console.log("Yeah 3 " + parseInt(name).toString(16))
    }

    help() {
    }

}