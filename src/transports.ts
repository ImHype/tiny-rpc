import http from 'http';
import { IServerTransport, ITransport } from "./interface";
import { Readable, Writable } from 'stream';
import { Ready } from './helper';

export class HTTPTransport implements ITransport {
    private req: Readable;
    private res: Writable;

    constructor(req: Readable, res: Writable) {
        this.req = req;
        this.res = res;
    }

    async read() {
        return new Promise((resolve) => {
            let chunks: Buffer[] = [];

            this.req.on('data', (c) => {
                chunks.push(c);
            });
    
            this.req.on('end', () => {
                resolve(Buffer.concat(chunks));
            });
        })
    }

    async write(buf: string | Buffer) {
        this.res.end(buf);
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
            console.log('listened: http://127.0.0.1:%s', port);
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
    private req: Writable;
    private res?: Readable = void 0;
    private ready: Ready;

    constructor(target: string) {
        this.ready = new Ready();
        this.req = http.request('http://' + target, {
            method: 'post'
        }, (res) => {
            this.res = res;
            this.ready.ready();
        });
    }

    async read() {
        await this.ready.wait();
        return new Promise((resolve) => {
            let chunks: Buffer[] = [];

            this.res!.on('data', (c) => {
                chunks.push(c);
            });
    
            this.res!.on('end', () => {
                resolve(Buffer.concat(chunks));
            });
        })
    }

    async write(buf: string | Buffer) {
        this.req.end(buf);
    }
}