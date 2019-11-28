import { ITransport } from "./interface";

export interface IProtocol {
    decode(): Promise<any>;
    encode(a: any): any;
}

abstract class Protocol {
    protected trans: ITransport;
    constructor(trans: ITransport)  {
        this.trans = trans;
    }
}

export class JSONProtocol extends Protocol {
    async decode() {
        const buf = await this.trans.read();
        const txt = buf.toString();
        return JSON.parse(txt);
    }

    encode(source: object) {
        return this.trans.write(JSON.stringify(source))
    }    
}