import * as fs from "fs";
import {dateFormat, getUserHome, mkdirp} from "./Util";
import * as path from "path";
import {WriteStream} from "fs";

const TASKMASTER_DIRECTORY = getUserHome() + "/.taskmaster";

export enum Level {
    ERROR = "error",
    WARN = "warnong",
    INFO = "info",
    DEBUG = "debug",
    EXCEPTION = "exception"
}

export class Logger {

    name: string;
    file: string;
    color: number;
    private writeStream: WriteStream;

    constructor(name: string, file: string) {
        this.name = name;
        this.file = file;
        this.createFile();
    }

    createFile() {
        const filePath = TASKMASTER_DIRECTORY + this.file + dateFormat(new Date(), ".%Y_%m_%d_%H_%M_%S", true);
        if (!fs.existsSync(TASKMASTER_DIRECTORY))
            fs.mkdirSync(TASKMASTER_DIRECTORY);
        const parent = path.dirname(filePath).split(path.sep).pop();
        mkdirp(parent);
        this.writeStream = fs.createWriteStream(filePath, {encoding: 'utf16le'});
        process.on('exit', () => this.writeStream.close())
    }

    log(level: Level, message: string) {
        const date = dateFormat(new Date(), "%Y/%m/%d %H:%M:%S", false);
        console.log(`[${level}] [${date}] ${this.name}: ${message}`);
        this.writeStream.write(`[${level}] [${date}]: ${message}`);
    }
}