const commands: Array<CommandInfo> = [];

export type CommandDesc = { name?: string, help?: string, description?: string }
type CommandInfo = { regex: RegExp, priority: number, name: string, target: any, value: any, options: CommandDesc}

export function callCommand(command: string) {
    const sorted = commands.sort((a, b) => b.priority - a.priority);
    for (let commandInfo of sorted) {
        const result = commandInfo.regex.exec(command);
        if (result)
            commandInfo.value.apply(commandInfo.target, result.slice(1))
    }
}

export function CommandRouter(regex: RegExp, options: CommandDesc = {}, priority: number = 0) {
    return (target, key, descriptor) => {
        commands.push({
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