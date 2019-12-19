import http from 'http';
import { IServerTransport, ITransport } from "./interface";
import { Readable, Writable } from 'stream';
import { Ready } from './helper';
import { StreamReader } from './stream-reader';


export class HTTPTransport implements ITransport {
    private readable: Readable;
    private writable: Writable;
    private streamReader: StreamReader;

    constructor(readable: Readable, writable: Writable) {
        this.readable = readable;
        this.writable = writable;
        this.streamReader = new StreamReader(readable);
    }

    async readAll() {
        return this.streamReader!.readAll();
    }

    async write(buf: string | Buffer) {
        this.writable.write(buf);
    }

    async end() {
        this.writable.end();
    }
}

export class HTTPServerTransport implements IServerTransport {
    private handlers: Array<(t: ITransport) => void> = [];
    private transports: Array<ITransport> = [];

    listen(port: number) {
        let fn;
        const server = http.createServer((req, res) => {
            const t = new HTTPTransport(req, res);
            if (fn = this.handlers.pop()) {
                fn(t);
            } else {
                this.transports.push(t);
            }
        });
        server.listen(port, () => {
            console.log('listen: %o', server.address());
        });
    }

    async accept(): Promise<ITransport> {
        let t;

        if (t = this.transports.pop()) {
            return t;
        }

        return new Promise((resolve) => {
            this.handlers.push(resolve);
        });
    }
}


export class HttpClient implements ITransport {
    private writable: Writable;
    private streamReader?: StreamReader;
    private ready: Ready;

    constructor(target: string) {
        this.ready = new Ready();
        this.writable = http.request('http://' + target, {
            method: 'post',
        }, (res) => {
            this.streamReader = new StreamReader(res);
            this.ready.ready();
        });
    }

    async readAll() {
        await this.ready.waitReady();
        return this.streamReader!.readAll();
    }

    async write(buf: string | Buffer) {
        this.writable.write(buf);
    }

    async end() {
        this.writable.end();
    }
}