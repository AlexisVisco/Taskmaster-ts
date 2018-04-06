import {Command} from "./Command";
import {capitalize} from "../util/Util";
import {Socket} from "net";

const commands: Array<PureCommand> = [];
const commandsInfo: Map<string, Array<CommandInfo>> = new Map();

export type CommandDesc = { name?: string, help?: string, description?: string }
export type CommandInfo = {
    regex: RegExp, priority: number, name: string,
    target: Command, value: any, options: CommandDesc
}

export function callCommand(command: string, socket: Socket) {
    command = command.replace('\n', '');
    const pureCommand = commands.find(e => e.isCommand(command));
    if (pureCommand) {
        let ref: Command = undefined;
        const list = commandsInfo.get(pureCommand.className)
            .sort((a, b) => b.priority - a.priority);
        for (let commandInfo of list) {
            const result = commandInfo.regex.exec(command.split(' ').slice(1).join(' '));
            if (!ref) {
                ref = commandInfo.target.clone();
                ref.commandName = capitalize(pureCommand.label);
                ref.socket = socket;
            }
            if (result) {
                commandInfo.value.apply(ref, result.slice(1));
                return;
            }
        }
        if (ref)
            ref.help();
    }
}

class PureCommand {

    className: string;
    label: string;
    aliases: string[];

    constructor(className: string, label: string, alias: string[]) {
        this.label = label;
        this.className = className;
        this.aliases = alias;
    }

    isCommand(command: string): boolean {
        const cmd = command.split(' ')[0];
        return this.aliases.some(e => e.toLowerCase() == cmd.toLowerCase()) || this.label.toLowerCase() == cmd.toLowerCase();
    }
}

export function CommandLabel(label: string, alias: string[] = []) {
    return function (target: Function) {
        commands.push(new PureCommand(target.name, label, alias));
    }
}

export function CommandRouter(regex: RegExp, options: CommandDesc = {},
                              priority: number = 0) {
    return (target : Command, key, descriptor) => {
        if (!commandsInfo.get(target.constructor.name))
            commandsInfo.set(target.constructor.name, []);
        commandsInfo.get(target.constructor.name).push({
            regex,
            priority,
            name: `${target.constructor.name}.${key}`,
            target,
            value: descriptor.value,
            options
        });
        return descriptor;
    };
}