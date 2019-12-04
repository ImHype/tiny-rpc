import { Service } from "./service";
import { IServerTransport, ITransport, IServerIMPL, ServiceLike } from "./interface";
import { HTTPServerTransport, HTTPTransport } from "./transports";
import { Processer, IProcesser } from "./processor";
import { IProtocol, JSONProtocol } from "./protocol";
import assert from 'assert';


interface IServerOptions<IMPL> {
    impl: IMPL;
    transport?: 'http';
    port: number;
    protocol?: 'json'
}

interface IServer {
    serve: () => void
}

class Server<IMPL extends ServiceLike> implements IServer {
    private Transport: {new(): IServerTransport};
    private processer: IProcesser;
    private Proctocol: {new(trans: ITransport): IProtocol};
    private port: number;
    public impl: IServerIMPL<IMPL> | undefined;

    constructor(service: Service, options: IServerOptions<IMPL>) {
        const { transport = 'http', impl, port, protocol = 'json' } = options;

        const handlers = service.impl(impl);
        this.processer = new Processer(handlers);

        assert(transport === 'http');
        this.Transport = HTTPServerTransport;

        assert(protocol === 'json');
        this.Proctocol = JSONProtocol;

        this.port = port;
    }

    async serve() {
        const server = new this.Transport();

        try {
            server.listen(this.port);
        } catch(e) {
            throw e;
        }

        let client: ITransport | void = void 0;

        while (client = await server.accept()) {
            const protocol = new this.Proctocol(client);
            this.processer.process(protocol);
        }
    }
}

export const createServer = <IMPL extends ServiceLike>(service: Service, options: IServerOptions<IMPL>) => {
    return new Server(service, options);
}