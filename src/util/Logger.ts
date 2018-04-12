import * as fs from "fs";
import {dateFormat, getUserHome} from "./Util";
import {WriteStream} from "fs";

const TASKMASTER_DIRECTORY = getUserHome() + "/.taskmaster";

export enum Level {
    ERROR = "error",
    WARN = "warnong",
    INFO = "info",
}

export class Logger {

    name: string;
    file: string;
    writeStream: WriteStream;

    constructor(name: string, where: string = undefined) {
        this.name = name;

        if (!fs.existsSync(TASKMASTER_DIRECTORY))
            fs.mkdirSync(TASKMASTER_DIRECTORY);
        else if (where != undefined && !fs.existsSync(TASKMASTER_DIRECTORY + `/${where}/`))
            fs.mkdirSync(TASKMASTER_DIRECTORY + `/${where}/`);

        this.file = where != undefined ? TASKMASTER_DIRECTORY + `/${where}/${name}.log` : TASKMASTER_DIRECTORY + `/${name}.log`;
        this.createFile();
    }

    createFile() {
        this.checkFile();
        this.writeStream = fs.createWriteStream(this.file, {flags: "a"});
    }

    log(level: Level, message: string) {
        const date = dateFormat(new Date(), "%Y/%m/%d %H:%M:%S", false);
        console.log(`[${level}] [${date}] ${this.name}: ${message}`);
        this.writeStream.write(`[${level}] [${date}]: ${message}\n`);
    }

    private checkFile() {
        if (fs.existsSync(this.file)) {
            const stats = fs.statSync(this.file);
            if (stats.size > 1000000 * 10) {
                console.log("here ?");
                const newFile = this.file + dateFormat(stats.mtime, ".%Y_%m_%d_%H_%M_%S", false);
                fs.renameSync(this.file, newFile);
            }
        }
    }
}