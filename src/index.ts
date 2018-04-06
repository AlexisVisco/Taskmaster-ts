#!/usr/bin/env node

import {
    defaultConfigProcess, isValidconfigProcess,
    ProcessConfig
} from "./server/types/ProcessConfig";
import * as fs from "fs";
import {SocketHandler} from "./server/Sockethandler";
import {Level, Logger} from "./util/Logger";
import {ProgramHandler} from "./server/ProgramHandler";
import {Status} from "./commands/list/Status";
import {Stop} from "./commands/list/Stop";
import {TableGenerator} from "./util/TableGenerator";

type Options = { port?: number, config: string, generate?: string, help?: string }

const options: Options = require('minimist')(process.argv, {
    default: { port: 9898, config: "./config.json" },
    alias: { "port": ["p"], "config": ["cfg"], "generate": ["g", "gen"]}
});
const global : Logger = new Logger("global", "global.log");

export {global};

class Application {

    options: Options;

    constructor(options: Options) {
        this.options = options;
    }

    public main() {
        if (this.options.generate)
            this.generateConfigAt();
        else if (this.options.help)
            this.showHelp();
        else
            this.launchServer();
    }

    private generateConfigAt() {
        fs.writeFile(this.options.generate, JSON.stringify(defaultConfigProcess(), null, 2), (err) => {
            if (err) console.log("Something wrong when creating file !");
            else console.log("A config file was generated.");
        })
    }

    private launchServer() {
        this.registerCommands();
        this.launchPrograms();
        new SocketHandler(this.options.port);
    }

    private launchPrograms() {
        global.log(Level.INFO, 'Retrieving configuration');
        if (fs.existsSync(this.options.config)) {
            const arrayProcessConfig : Array<ProcessConfig> = require('../cfg.json');
            for (let processConfig of arrayProcessConfig) {
                const res = isValidconfigProcess(processConfig);
                if (res == true) new ProgramHandler(processConfig);
                else if (typeof res == "string") global.log(Level.WARN, `${res} This process can't be launched.`);
            }
        }
        else {
            global.log(Level.ERROR, 'No configuration found');
            process.exit(0);
        }
    }

    private showHelp() {
        console.log("Help: ...")
    }

    private registerCommands() {
        new Stop();
        new Status();
    }
}

new Application(options).main();