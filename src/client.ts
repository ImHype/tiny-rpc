import { IService } from "./service";
import { ITransport, IClientTransportClass } from "./interface";
import { HttpClient } from "./transports";
import { IProtocol, JSONProtocol } from "./protocol";
import assert from 'assert';

interface IClient {
    callMethod(method: string, argv: any[]): Promise<any>
}

interface IClientOptions {
    transport?: 'http';
    protocol?: 'json';
    target: string
}

class Increaser {
    private id = 0;

    increase() {
        this.id++;
    }

    get() {
        return this.id;
    }
}

class Client implements IClient {
    private increaser: Increaser = new Increaser();
    private service: IService;
    private target: string;
    private Transport: IClientTransportClass;
    private Proctocol: {new(trans: ITransport): IProtocol};
    
    constructor(service: IService, options: IClientOptions) {
        const { transport = 'http', protocol = 'json' } = options;
        this.service = service;
        this.target = options.target;

        assert(transport === 'http');
        this.Transport = HttpClient;

        assert(protocol === 'json');
        this.Proctocol = JSONProtocol;
    }


    async callMethod(method: string, body: any) {
        const transport = new this.Transport(this.target);
        const protol = new this.Proctocol(transport);

        const seqId = this.increaser.get();
        this.increaser.increase();

        await protol.writeMessageBegin({
            name: method,
            seqId,
            type: 'request'
        });

        await protol.writeMessageEnd(body);

        const { name, seqId: recievedSeqId, type } = await protol.readMessageBegin();

        if (Number(recievedSeqId) !== seqId) {
            throw new Error(`expected seqId ${seqId}, actually ${recievedSeqId}`);
        }

        if (name != method) {
            throw new Error(`expected method ${method}, actually ${name}`);
        }

        const data = await protol.readMessageEnd();

        if (type === 'exception') {
            throw new Error(data.message);
        }

        return data;
    }
}

export const createClient = (service: IService, options: IClientOptions) => {
    return new Client(service, options)
}