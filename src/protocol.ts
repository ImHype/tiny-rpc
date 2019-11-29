import { ITransport, IMessage } from "./interface";

export interface IProtocol {
    readMessageBegin(): Promise<IMessage>;
    readMessageEnd(): Promise<any>;

    writeMessageBegin(msg: IMessage): Promise<void>;
    writeMessageEnd(data: any): Promise<void>;

    decode(): Promise<any>;
}

export class JSONProtocol implements IProtocol {
    protected trans: ITransport;
    protected result: any;

    constructor(trans: ITransport)  {
        this.trans = trans;
        this.result = null;
    }

    async decode() {
        if (!this.result) {
            const buf = await this.trans.readAll();
            this.result = JSON.parse(buf.toString());
        }

        return this.result;
    }

    async readMessageBegin() {
        return await this.decode();
    }

    async readMessageEnd() {
        return this.result.data;
    }

    async writeMessageBegin(msg: IMessage) {
        this.trans.write(`{"name":"${msg.name}","type":"${msg.type}","seqid":"${msg.seqid}","data":`);
    }

    async writeMessageEnd(data: any) {
        this.trans.write(`${JSON.stringify(data)}}`);
        this.trans.end();
    }
}