
export interface ITransport {
    read(): Promise<any>;
    write(argv: string | Buffer): Promise<any>;
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