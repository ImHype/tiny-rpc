import { ITransport, IMessage } from "./interface";


export interface MessageHead {
    type: 'exception' | 'reply' | 'request';
    message: string;
    seqId: number;
    name: string;
}

export interface Message<T> extends MessageHead {
    body: T;
}

export interface IProtocol {
    readMessageBegin(): Promise<MessageHead>;
    readMessageEnd<ReadType>(): Promise<Message<ReadType>>;

    writeMessageBegin(msg: IMessage): Promise<void>;
    writeMessageEnd<WriteType>(data: WriteType): Promise<void>;
}

type TransData = Message<any>;

export class JSONProtocol implements IProtocol {
    protected trans: ITransport;
    protected result: TransData | null;

    constructor(trans: ITransport)  {
        this.trans = trans;
        this.result = null;
    }

    async decode(): Promise<TransData> {
        if (!this.result) {
            const buf = await this.trans.readAll();
            this.result = JSON.parse(buf.toString());
        }
        
        return this.result!;
    }

    async readMessageBegin(): Promise<MessageHead> {
        return await this.decode();
    }

    async readMessageEnd<ReadType>(): Promise<Message<ReadType>> {
        return await this.decode();
    }

    async writeMessageBegin(msg: IMessage) {
        this.trans.write(`{"name":"${msg.name}","type":"${msg.type}","seqId":"${msg.seqId}","body":`);
    }

    async writeMessageEnd<WriteType>(data: WriteType) {
        this.trans.write(`${JSON.stringify(data)}}`);
        this.trans.end();
    }
}