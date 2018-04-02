#!/usr/bin/env node

import {defaultConfigProcess} from "./server/types/ProcessConfig";
import * as fs from "fs";
import {Test} from "./server/list/Test";
import {callCommand} from "./commands/Commands";
import {Color} from "./util/Color";
import {dateFormat, getUserHome} from "./util/Util";
import {Level, Logger} from "./util/Logger";
import {SocketHandler} from "./server/Sockethandler";
import {TableGenerator} from "./util/TableGenerator";

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
        new SocketHandler(this.options.port);
    }

    private showHelp() {
        console.log("Help: ...")
    }
}

const header = ["test", "7894562113"];
const lst = [
    ["jreierukfeur", "ergbufyre"],
    ["12", "789"],
    ["165w4w9e8fewf", "fe2w1few6"],
];
console.log(new TableGenerator().generateTable(header, lst));

new Application(options).main();