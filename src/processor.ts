import { IProtocol } from "./protocol";
import { IServerIMPL, ServiceLike } from "./interface";
import { Handler } from "./handler";

export interface IProcesser {
    process(t: IProtocol): void;
}

export class Processer<IMPL extends ServiceLike> implements IProcesser {
    public impl: IServerIMPL<IMPL>;
    constructor(impl: IServerIMPL<IMPL>) {
        this.impl = impl;
    }

    async process(t: IProtocol) {
        const { name, seqId } = await t.readMessageBegin();
        if (this.impl[name]) {
            const handler = this.impl[name];
            const data = await t.readMessageEnd();
            const resp = await handler.handle(data.body);

            await t.writeMessageBegin({
                name,
                seqId,
                type: 'reply'
            });
            return t.writeMessageEnd(resp);
        } else {
            t.writeMessageBegin({
                name,
                seqId,
                type: 'exception'
            });
            return t.writeMessageEnd({
                message: 'no method'
            });
        }
    }
}