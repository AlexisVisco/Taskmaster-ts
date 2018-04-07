import {Command} from "../Command";
import {CommandLabel, CommandRouter} from "../Commands";
import {app} from "../../index";
import {stringifyConfig, stringifyDiffConfig} from "../../util/Stringify";
import {ProcessConfig} from "../../server/types/ProcessConfig";

@CommandLabel("config", ["cfg", "cf", "conf"])
export class Config extends Command {

    @CommandRouter(/^diff all$/i, {}, 4)
    configDiffAll() {
        const treatedConfig = [];
        const treat = (f: Array<ProcessConfig>, a: Array<ProcessConfig>, inverse: boolean = false) => {
            f.forEach(c => {
                if (!treatedConfig.some(e => e == c.name)) {
                    treatedConfig.push(c.name);
                    const newer = a.find(e => e.name == c.name);
                    if (inverse)
                        this.socket.write(stringifyDiffConfig(newer, c));
                    else
                        this.socket.write(stringifyDiffConfig(c, newer));
                }
            })
        };

        const origins = Array.from(app.configs.values());
        const newers = app.actualDiskConfig();

        treat(origins, newers);
        treat(newers, origins, true);
    }

    @CommandRouter(/^diff (\w+)$/i, {}, 3)
    configDiffName(name) {
        const pc = app.configs.get(name);
        const npc = app.actualDiskConfig().find(e => e.name == name);
        console.log("hey ", pc, npc);
        if (pc || npc)
            this.socket.write(stringifyDiffConfig(pc, npc));
        else this.socket.write(`No config found for the name ${name}.\n`);
    }

    @CommandRouter(/^all$/i, {}, 1)
    configShowAll() {
        Array.from(app.configs.values()).forEach(e => {
            this.socket.write(stringifyConfig(e));
        });
    }

    @CommandRouter(/^(\w+)$/i)
    configShowName(name) {
        const pc = app.configs.get(name);
        if (pc)
            this.socket.write(stringifyConfig(pc));
        else this.socket.write(`No config found for name ${name}.\n`);
    }

    clone() {
        return new Config();
    }

    help() {
        this.helpLine()
            .helpCommand("config <name>", "Show config for processes $name.")
            .helpCommand("config all", "Show all config.")
            .helpCommand("config reload <name>", "Reload config for processes $name.")
            .helpCommand("config reload", "Reload all config.")
            .helpCommand("config diff", "Show the difference between the config loaded and the config on the disk.")
            .helpCommand("config diff <name>", "Show the difference between the config loaded and the config on the disk only for the process $name.")
    }
}