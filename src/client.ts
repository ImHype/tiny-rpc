import { IService } from "./service";
import { ITransportValue, ITransport, IClientTransportClass } from "./interface";
import { HTTPTransport, HttpClient } from "./transports";
import { IProtocol, JSONProtocol } from "./protocol";

interface IClient {
    callMethod(method: string, argv: any[]): Promise<any>
}

interface IClientOptions {
    transport?: 'http' | ITransportValue;
    target: string
}

class Client implements IClient {
    private service: IService;
    private target: string;
    private Transport: IClientTransportClass;
    private Proctocol: {new(trans: ITransport): IProtocol};
    private seqid = 0;
    
    constructor(service: IService, options: IClientOptions) {
        this.service = service;
        this.target = options.target;
        this.Transport = HttpClient;
        this.Proctocol = JSONProtocol;
    }

    increaseSeqId() {
        this.seqid++;
    }

    getSeqId() {
        return this.seqid;
    }

    async callMethod(method: string, body: any) {
        const transport = new this.Transport(this.target);
        const protol = new this.Proctocol(transport);
        const seqid = this.getSeqId();

        this.increaseSeqId();

        await protol.writeMessageBegin({
            name: method,
            seqid,
            type: 'request'
        });

        await protol.writeMessageEnd(body);

        const { name, seqid: resSeqId, type } = await protol.readMessageBegin();

        if (Number(resSeqId) !== seqid) {
            throw new Error(`expected seqid ${seqid}, actually ${resSeqId}`);
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