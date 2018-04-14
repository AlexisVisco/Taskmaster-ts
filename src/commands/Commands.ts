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
        let list = commandsInfo.get(pureCommand.className);
        if (list) {
            list = list.sort((a, b) => b.priority - a.priority);
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
            if (ref) {
                generateHelp(ref, list);
            }
        }
        else {
            const {Help} = require(`./list/Help`);
            ref = new Help();
            ref.socket = socket;
            ref.help();
        }
    }
}

export function getCommandList() {
    return commands;
}
export function getCommandInfo() {
    return commandsInfo;
}

export class PureCommand {

    className: string;
    label: string;
    aliases: string[];
    desc: string;

    constructor(className: string, label: string, desc: string, alias: string[]) {
        this.label = label;
        this.className = className;
        this.aliases = alias;
        this.desc = desc;
    }

    isCommand(command: string): boolean {
        const cmd = command.split(' ')[0];
        return this.aliases.some(e => e.toLowerCase() == cmd.toLowerCase()) || this.label.toLowerCase() == cmd.toLowerCase();
    }
}

export function CommandLabel(label: string, desc: string, alias: string[] = []) {
    return function (target: Function) {
        commands.push(new PureCommand(target.name, label, desc, alias));
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

function generateHelp(ref: Command, list: CommandInfo[]) {
    ref.helpLine();
    list.forEach(e => {
        if (e.options.name && e.options.description)
            ref.helpCommand(e.options.name, e.options.description);
    });
}