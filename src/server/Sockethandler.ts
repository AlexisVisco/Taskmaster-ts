import net, {Socket} from "net";
import {randId} from "../util/Util";
import {callCommand} from "../commands/Commands";

export class SocketHandler {
    port: number;
    clients = [];

    constructor(port: number) {
        this.port = port;
        this.handle()
    }

    private handle() {
        net.createServer((socket: Socket) => {
            const id = {socket, name: randId(5)};
            this.clients.push(id);
            socket.write("Welcome to taskmaster world!\n");
            socket.on('data', (data) => callCommand(`${data}`, socket));
            socket.on('end', () => this.clients.splice(this.clients.indexOf(id), 1));
        }).listen(this.port);
        console.log(`Taskmaster running at port ${this.port}\n`);
    }
}