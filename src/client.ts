import { IService } from "./service";
import { ITransportValue, ITransport, IClientTransportClass } from "./interface";
import { HTTPTransport, HttpClient } from "./transports";
import { IProtocol, JSONProtocol } from "./protocol";

interface IClients {
    callMethod(method: string, argv: any[]): Promise<any>
}

interface IClientOptions {
    transport?: 'http' | ITransportValue;
    target: string
}

class Client implements IClients {
    private service: IService;
    private target: string;
    private Transport: IClientTransportClass;
    private Proctocol: {new(trans: ITransport): IProtocol};
    
    constructor(service: IService, options: IClientOptions) {
        this.service = service;
        this.target = options.target;
        this.Transport = HttpClient;
        this.Proctocol = JSONProtocol;
    }

    async callMethod(method: string, body: any) {
        const transport = new this.Transport(this.target);
        const protol = new this.Proctocol(transport);
        await protol.encode({
            method,
            body: body
        });

        const buf = await protol.decode();
        return buf.body;
    }
}

export const createClient = (service: IService, options: IClientOptions) => {
    return new Client(service, options)
}