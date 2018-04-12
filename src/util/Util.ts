import * as path from "path";
import * as fs from "fs";
import crypto from "crypto";

export function capitalize(string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function getUserHome(): string {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

export function mkdirp(targetDir, {isRelativeToScript = false} = {}) {
    console.log(targetDir);
    const sep = path.sep;
    const initDir = path.isAbsolute(targetDir) ? sep : '';
    const baseDir = isRelativeToScript ? __dirname : '.';
    targetDir.split(sep).reduce((parentDir, childDir) => {
        console.log(baseDir, parentDir, childDir);
        const curDir = path.resolve(baseDir, parentDir, childDir);
        try {
            fs.mkdirSync(curDir);
        } catch (err) {
            if (err.code !== 'EEXIST') {
                throw err;
            }
        }
        return curDir;
    }, initDir);
}

export function humanDuration(seconds: number) {
    if (seconds === 0) return 'now';
    let years = Math.floor(seconds / (60 * 60 * 24 * 365));
    let days = Math.floor(seconds / (60 * 60 * 24)) % 365;
    let hours = Math.floor(seconds / (60 * 60)) % 24;
    let minutes = Math.floor(seconds / 60) % 60;
    seconds = seconds % 60;
    let duration = [years, days, hours, minutes, seconds];
    let units = ['year', 'day', 'hour', 'minute', 'second'];
    let linked = duration.map(function (el, ind) {
        if (el > 1) {
            return el.toFixed(0) + ' ' + units[ind] + 's'
        }
        if (el === 1) {
            return el.toFixed(0) + ' ' + units[ind]
        }
    }).filter(el => el !== undefined);
    if (linked.length > 1) {
        let last = linked.pop();
        return linked.join(', ') + ' and ' + last;
    }
    return linked[0];
}

export function dateFormat(date: Date, formatedString: string, utc): string {
    utc = utc ? 'getUTC' : 'get';
    return formatedString.replace(/%[YmdHMS]/g, function (m) {
        switch (m) {
            case '%Y':
                return date[utc + 'FullYear']();
            case '%m':
                m = 1 + date[utc + 'Month']();
                break;
            case '%d':
                m = date[utc + 'Date']();
                break;
            case '%H':
                m = date[utc + 'Hours']();
                break;
            case '%M':
                m = date[utc + 'Minutes']();
                break;
            case '%S':
                m = date[utc + 'Seconds']();
                break;
            default:
                return m.slice(1);
        }
        return ('0' + m).slice(-2);
    });
}

export function randId(count: number): string {
    return crypto.randomBytes(count).toString("hex");
}

export function diffBetweenDates(d1: Date, d2: Date) {
    const dif = d1.getTime() - d2.getTime();
    const res = dif / 1000;
    return Math.abs(res);
}