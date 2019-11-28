import http from 'http';
import { IServerTransport, ITransport } from "./interface";
import { Readable, Writable } from 'stream';

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
    private acceptQueue: Array<(t: ITransport) => void> = [];
    private buffer: Array<ITransport> = [];

    listen(port: number) {
        let fn;
        const server = http.createServer((req, res) => {
            const t = new HTTPTransport(req, res);
            if (fn = this.acceptQueue.pop()) {
                fn(t);
            } else {
                this.buffer.push(t);
            }
        });
        server.listen(port, () => {
            console.log('listened: http://127.0.0.1:%s', port);
        });
    }

    async accept(): Promise<ITransport> {
        let t;

        if (t = this.buffer.pop()) {
            return t;
        }

        return new Promise((resolve) => {
            this.acceptQueue.push(resolve);
        });
    }
}

export class HttpClient implements ITransport {
    private queue: any[];
    private req: Writable;
    private res?: Readable = void 0;

    constructor(target: string) {
        this.queue = [];
        this.req = http.request('http://' + target, {
            method: 'post'
        }, (res) => {
            this.res = res;

            let it: any;
            while(it = this.queue.pop()) {
                it();
            }
        });
    }

    async ready() {
        return new Promise((resolve) => {
            this.queue.push(() => {
                resolve();
            })
        })
    }


    async read() {
        await this.ready();
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