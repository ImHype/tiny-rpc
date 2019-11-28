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
        const data = await t.decode();
        const { method, body } = data;

        if (this.impl.has(method)) {
            const handler = this.impl.get(method)!;
            const resp = await handler.handle(body);

            return t.encode({
                body: resp
            });
        } else {
            return t.encode({
                exception: 'no method'
            });            
        }
    }
}