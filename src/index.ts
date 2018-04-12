#!/usr/bin/env node

import {
    defaultConfigProcess, isValidconfigProcess, maskDefault,
    ProcessConfig
} from "./server/types/ProcessConfig";
import * as fs from "fs";
import {SocketHandler} from "./server/Sockethandler";
import {Level, Logger} from "./util/Logger";
import {ProgramHandler} from "./server/ProgramHandler";
import {Status} from "./commands/list/Status";
import {Stop} from "./commands/list/Stop";
import {Restart} from "./commands/list/Restart";
import {Start} from "./commands/list/Start";
import {Config} from "./commands/list/Config";
import {Help} from "./commands/list/Help";

type Options = { port?: number, config: string, generate?: string, help?: string }

const options: Options = require('minimist')(process.argv, {
    default: { port: 9898, config: "./config.json" },
    alias: { "port": ["p"], "config": ["cfg"], "generate": ["g", "gen"]}
});

const global : Logger = new Logger("global");

export {global};

export class Application {

    private options: Options;
    public configs : Map<string, ProcessConfig> = new Map();

    private constructor(options: Options) {
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
            if (err) global.log(Level.ERROR, "Something wrong when creating file !");
            else global.log(Level.INFO, "A config file was generated.");
        })
    }

    private launchServer() {
        this.registerCommands();
        this.launchPrograms();
        new SocketHandler(this.options.port);
    }

    private launchPrograms() {
        global.log(Level.INFO, 'Retrieving configuration');
        console.log(this.options.config);
        if (fs.existsSync(this.options.config)) {
            const arrayProcessConfig : Array<ProcessConfig> = this.actualDiskConfig();
            for (let processConfig of arrayProcessConfig) {
                const res = isValidconfigProcess(processConfig);
                if (res == true) {
                    this.configs.set(processConfig.name, Object.assign({}, processConfig));
                    processConfig = maskDefault(processConfig);
                    new ProgramHandler(processConfig);
                }
                else if (typeof res == "string") global.log(Level.WARN, `${res} This process can't be launched.`);
            }
        }
        else {
            global.log(Level.ERROR, 'No configuration found');
            setTimeout(process.exit, 100);
        }
    }

    private showHelp() {
        console.log("Help: ...")
    }

    private registerCommands() {
        new Stop();
        new Status();
        new Restart();
        new Start();
        new Config();
        new Help();
    }

    public actualDiskConfig() : Array<ProcessConfig> {
        const j =  require(options.config);
        delete require.cache[require.resolve(options.config)];
        return j;
    }

    public static instance() {
        return new Application(options);
    }
}

const app: Application = Application.instance();
app.main();

export {app};