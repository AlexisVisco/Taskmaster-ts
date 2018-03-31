#!/usr/bin/env node

import parseArgs from "./util/argv-parse"
import {ConfigProcess, defaultConfigProcess} from "./types/ConfigProcess";
import * as fs from "fs";

type Options = { port?: number, config: string, generate?: string, help?: string}

const options: Options= parseArgs(process.argv, {
    default: {
        port: 9898,
        config: "./config.json"
    },
    alias: {
        "port": ["p"], "config": ["cfg"]
    }
});

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
    }

    private generateConfigAt() {
        fs.writeFile(this.options.generate, JSON.stringify(defaultConfigProcess(), null, 2), (err) => {
            if (err) console.log("Something wrong when creating file !");
            else console.log("A config file was generated.");
        })
    }

    private showHelp() {
        console.log("Help: ...")
    }
}

new Application(options).main();