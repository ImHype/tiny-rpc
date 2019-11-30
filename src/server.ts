import { Service } from "./service";
import { IServerTransport, ITransport, IServerIMPL } from "./interface";
import { HTTPServerTransport, HTTPTransport } from "./transports";
import { Processer, IProcesser } from "./processor";
import { IProtocol, JSONProtocol } from "./protocol";
import assert from 'assert';


interface IServerOptions {
    impl: object;
    transport?: 'http';
    port: number;
    protocol?: 'json'
}

interface IServer {
    serve: () => void
}


class Server implements IServer {
    private Transport: {new(): IServerTransport};
    private processer: IProcesser;
    private Proctocol: {new(trans: ITransport): IProtocol};
    private port: number;

    constructor(service: Service, options: IServerOptions) {
        const { transport = 'http', impl, port, protocol = 'json' } = options;

        this.processer = new Processer(service.impl(impl));

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
        let protocol: IProtocol | void = void 0;

        while (client = await server.accept()) {
            protocol = new this.Proctocol(client);
            this.processer.process(protocol);
        }
    }
}

export const createServer = (service: Service, options: IServerOptions) => {
    return new Server(service, options);
}