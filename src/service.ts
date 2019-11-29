import { IServerIMPL } from "./interface";
import { Handler } from "./handler";

export interface IService {

}

export class Service implements IService {
    def: object;
    service: string;
    constructor(def: object, service: string) {
        this.def = def;
        this.service = service;
    }

    impl(impl: object): IServerIMPL {
        if (!impl) {
            throw new Error('empty impl');
        }

        const serverImpl = new Map<string, Handler>();

        Object.entries(impl).forEach(([k, v]) => {
            serverImpl.set(k, new Handler(v));
        });

        return serverImpl;
    }
}

export const createService = (def: object, name: string) => {
    return new Service(def, name);
}