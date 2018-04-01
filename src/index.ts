#!/usr/bin/env node

import {defaultConfigProcess} from "./types/ConfigProcess";
import * as fs from "fs";
import {Test} from "./commands/list/Test";
import {callCommand} from "./commands/Commands";
import {Color} from "./util/Color";

type Options = { port?: number, config: string, generate?: string, help?: string }

const options: Options = require('minimist')(process.argv, {
    default: { port: 9898, config: "./config.json" },
    alias: { "port": ["p"], "config": ["cfg"] }
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
Test;
callCommand("hello -");
const colored = Color.BLUE_BACKGROUND + " HEYYYYYy !" + Color.RESET;

console.log(Color.colorify("hey im a 123 456 79 years and 789"));