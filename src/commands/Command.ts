import {Color} from "../util/Color";
import {Socket} from "net";

export abstract class Command {

    commandName: string;
    socket: Socket;

    abstract help();

    helpLine(): Command {
        const colored = Color.to(this.commandName, Color.PURPLE);
        console.log(`Help for command ${colored} >>`);
        return this;
    }

    lineCommand(command, describe) : Command {
        const commandColored = command.replace(/(<[a-zA-Z0-9 ]*>)/g,
                                                Color.to("$1", Color.GREEN));
        const describeColored = describe.replace(/(\$\w+)/g,
                                                Color.to("$1", Color.CYAN));
        console.log(`  * ${commandColored} - ${describeColored}`);
        return this;
    }
}