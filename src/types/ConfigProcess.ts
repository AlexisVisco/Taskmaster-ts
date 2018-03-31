interface ConfigProcess {
    name: string
    cmd: string
    numProcess: number
    stopSignal: String | number
    exitCodes: number[]
    startTimeSuccessful?: number
    workingDirectory?: String
    stopTimeSuccessful?: number
    autoRestart?: boolean
    startRetries?: number
    autoStart?: boolean
    umask?: String
    stderr?: string
    stdout?: string
    environment?: any
}

function defaultConfigProcess() : ConfigProcess[] {
    return [{
        name: "My awesome program",
        cmd: "awesome-program -f .",
        numProcess: 1,
        stopSignal: 137,
        exitCodes: [0, 1],
        startTimeSuccessful: 5,
        workingDirectory: "/opt/process_location",
        stopTimeSuccessful: 1,
        autoRestart: true,
        startRetries: 5,
        autoStart: true,
        umask: "022",
        stderr: "/tmp/map.log.err",
        stdout: "/tmp/map.log.out",
        environment: {'env': 'optional'},
    }]
}
export {ConfigProcess, defaultConfigProcess}