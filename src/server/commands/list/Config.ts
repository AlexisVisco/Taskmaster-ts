import {Command} from "../Command";
import {CommandLabel, CommandRouter} from "../Commands";
import {app} from "../../../index";
import {stringifyConfig, stringifyDiffConfig} from "../../../util/Stringify";
import {ProcessConfig} from "../../types/ProcessConfig";
import {ProgramHandler} from "../../ProgramHandler";

@CommandLabel("config", "Reload, show config or difference with the configuration file.", ["cfg", "cf", "conf"])
export class Config extends Command {

    @CommandRouter(/^reload all$/i, {
        name: "config reload all",
        description: "Reload all config."
    }, 3)
    configReloadAll() {
        const treatedConfig = [];
        const treat = (f: Array<ProcessConfig>) => {
            f.forEach(c => {
                if (!treatedConfig.some(e => e == c.name))
                {
                    this.configReloadName(c.name);
                    treatedConfig.push(c.name);
                }
            })
        };

        treat(Array.from(app.configs.values()));
        treat(app.actualDiskConfig());
    }

    @CommandRouter(/^reload (\w+)$/i, {
        name: "config reload <name>",
        description: "Reload config for processes $name."
    }, 2)
    configReloadName(name) {
        const ph = ProgramHandler.getByName(name);
        const npc = app.actualDiskConfig().find(e => e.name == name);

        if (!ph && !npc) this.socket.write(`No new config or old config found ${name}.\n`);
        else if (!ph && npc) {
            this.socket.write(`Program ${name} added.\n`);
            new ProgramHandler(npc);
        }
        else if (ph && !npc) {
            this.socket.write(`Program ${name} deleted.\n`);
            ph.destroy();
        }
        else {
            this.socket.write(`Update config for ${name}.\n`);
            ph.updateConfig(npc);
        }
    }

    @CommandRouter(/^diff all$/i, {
        name: "config diff all",
        description: "Show the difference between the config loaded and the config on the disk."
    }, 4)
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

    @CommandRouter(/^diff (\w+)$/i, {
        name: "config diff <name>",
        description: "Show the difference between the config loaded and the config on the disk only for the process $name."
    }, 3)
    configDiffName(name) {
        const pc = app.configs.get(name);
        const npc = app.actualDiskConfig().find(e => e.name == name);
        console.log("hey ", pc, npc);
        if (pc || npc)
            this.socket.write(stringifyDiffConfig(pc, npc));
        else this.socket.write(`No config found for the name ${name}.\n`);
    }

    @CommandRouter(/^all$/i, {
        name: "config all",
        description: "Show all config."
    }, 1)
    configShowAll() {
        Array.from(app.configs.values()).forEach(e => {
            this.socket.write(stringifyConfig(e));
        });
    }

    @CommandRouter(/^(\w+)$/i, {
        name: "config <name>",
        description: "Show config for processes $name."
    })
    configShowName(name) {
        const pc = app.configs.get(name);
        if (pc)
            this.socket.write(stringifyConfig(pc));
        else this.socket.write(`No config found for name ${name}.\n`);
    }

    clone() {
        return new Config();
    }
}