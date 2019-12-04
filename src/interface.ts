import { Handler } from "./handler";

export interface IMessage {
    name: string;
    type: string;
    seqId: number;
}

export interface ITransport {
    readAll(): Promise<Buffer>;
    write(argv: string | Buffer): Promise<void>;
    end(): void;
}

export type IClientTransportClass = {new(target: string): ITransport}

export interface IServerTransport {
    listen: (port: number) => void;
    accept: () => Promise<ITransport>
}

export interface IHandler<ReqType, ResType> {
    handle(req: ReqType): Promise<ResType>;
}

export type ITransportValue = 'http' | ITransport;

export type MethodLike = (req: any) => any;

export type IServerIMPL<T> = {
    [K in keyof T]: T[K] extends MethodLike ? Handler<Parameters<T[K]>[0], T[K]> : never
};

export interface ServiceLike {
    [k : string]: MethodLike
}
