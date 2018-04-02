import {RestartCondition} from "./RestartCondition";

export interface ProcessConfig {
    name: string
    cmd: string
    numProcess: number
    stopSignal: string | number
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
        stopSignal: 137,
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