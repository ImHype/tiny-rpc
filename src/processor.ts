import { IProtocol } from "./protocol";
import { IServerIMPL } from "./interface";

export interface IProcesser {
    process(t: IProtocol): void;
}

export class Processer implements IProcesser {
    private impl: IServerIMPL;
    constructor(impl: IServerIMPL) {
        this.impl = impl;
    }

    async process(t: IProtocol) {
        const { name, seqid } = await t.readMessageBegin();
        if (this.impl.has(name)) {
            const handler = this.impl.get(name)!;
            const data = await t.readMessageEnd();
            const resp = await handler.handle(data);

            await t.writeMessageBegin({
                name,
                seqid,
                type: 'reply'
            });
            return t.writeMessageEnd(resp);
        } else {
            t.writeMessageBegin({
                name,
                seqid,
                type: 'exception'
            });
            return t.writeMessageEnd({
                message: 'no method'
            });
        }
    }
}