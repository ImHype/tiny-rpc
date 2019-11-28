import { IService, Service } from "./service";
import { IServerTransport, ITransport, IServerIMPL } from "./interface";
import { HTTPServerTransport, HTTPTransport } from "./Transports";
import { Processer, IProcesser } from "./processor";
import { IProtocol, JSONProtocol } from "./Protocol";



interface IServerOptions {
    impl: object;
    transport?: 'http' | IServerTransport;
}

interface IServer {
    serve: (port: number) => void
}


class Server implements IServer {
    private serverTransport: IServerTransport;
    private processer: IProcesser;
    private Proctocol: {new(trans: ITransport): IProtocol};

    constructor(service: Service, options: IServerOptions) {
        const { transport = 'http', impl } = options;

        if (typeof transport === 'string') {
            // only http
            this.serverTransport = new HTTPServerTransport();
        } else {
            this.serverTransport = transport;
        }

        this.processer = new Processer(service.impl(impl));
        this.Proctocol = JSONProtocol;
    }

    async serve(port: number) {
        try {
            this.serverTransport.listen(port);
        } catch(e) {
            throw e;
        }

        let client: ITransport | void = void 0;
        let protocol: IProtocol | void = void 0;

        while (client = await this.serverTransport.accept()) {
            protocol = new this.Proctocol(client);
            this.processer.process(protocol);
        }
    }
}

export const createServer = (service: Service, options: IServerOptions) => {
    return new Server(service, options);
}