import {RestartCondition} from "./RestartCondition";

export interface ProcessConfig {
    name: string
    cmd: string
    numProcess: number
    stopSignal: string
    exitCodes: number[]
    startTimeSuccessful?: number
    workingDirectory?: string
    stopTimeSuccessful?: number
    autoRestart?: RestartCondition
    startRetries?: number
    autoStart?: boolean
    umask?: string
    stderr?: string
    stdout?: string
    environment?: any
}

export function defaultConfigProcess() : ProcessConfig[] {
    return [{
        name: "My awesome program",
        cmd: "awesome-program -f .",
        numProcess: 1,
        stopSignal: 'SIGTERM',
        exitCodes: [0, 1],
        startTimeSuccessful: 5,
        workingDirectory: "/opt/process_location",
        stopTimeSuccessful: 1,
        autoRestart: RestartCondition.UNEXPECTED,
        startRetries: 5,
        autoStart: true,
        umask: "022",
        stderr: "/tmp/map.log.err",
        stdout: "/tmp/map.log.out",
        environment: {'env': 'optional'},
    }]
}

export function processConfigkeys() {
    return [
        "name",
        "cmd",
        "numProcess",
        "stopSignal",
        "exitCodes",
        "startTimeSuccessful",
        "workingDirectory",
        "stopTimeSuccessful",
        "autoRestart",
        "startRetries",
        "autoStart",
        "umask",
        "stderr",
        "stdout",
        "environment"
    ]
}

export function maskDefault(data : ProcessConfig) : ProcessConfig {
    if (!data.startTimeSuccessful) data.startTimeSuccessful = 1;
    if (!data.stopTimeSuccessful) data.stopTimeSuccessful = 1;
    if (!data.autoRestart) data.autoRestart = RestartCondition.NEVER;
    if (!data.startRetries) data.startRetries = 1;
    if (data.autoStart == undefined) data.autoStart = true;
    return data;
}

export function isValidconfigProcess(data) : boolean | string {
    const requiredFields = ["name", "cmd", "numProcess", "stopSignal", "exitCodes"];
    if (data) {
        for (let requiredField of requiredFields) {
            if (!data[requiredField])
                return `Missing field ${requiredField} in the configuration.`
        }
        return true;
    }
    return "Configuration is undefined.";
}