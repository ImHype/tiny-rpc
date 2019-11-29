export interface IMessage {
    name: string;
    type: string;
    seqid: number;
}

export interface ITransport {
    readAll(): Promise<Buffer>;
    write(argv: string | Buffer): Promise<any>;
    end(): void;
}

export type IClientTransportClass = {new(target: string): ITransport}

export interface IServerTransport {
    listen: (port: number) => void;
    accept: () => Promise<ITransport>
}


export interface IHandler {
    handle(a: any): any;
}

export type ITransportValue = 'http' | ITransport

export type IServerIMPL = Map<string, IHandler>