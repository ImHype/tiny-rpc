import { IServerIMPL, ServiceLike } from "./interface";
import { Handler } from "./handler";

export interface IService {
    impl<IMPL extends ServiceLike>(impl: IMPL): IServerIMPL<IMPL>;
}

export class Service implements IService {
    def: object;
    service: string;
    constructor(def: object, service: string) {
        this.def = def;
        this.service = service;
    }

    impl<IMPL extends ServiceLike>(impl: IMPL): IServerIMPL<IMPL> {
        
        if (!impl) {
            throw new Error('empty impl');
        }

        const serverImpl = Object.entries(impl).reduce((p, [k, v]) => {
            return {
                ...p,
                [k]: new Handler(v)
            }
        }, {} as IServerIMPL<IMPL>);

        return serverImpl;
    }
}

export const createService = (def: object, name: string) => {
    return new Service(def, name);
}