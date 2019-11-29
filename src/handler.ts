import { IHandler } from "./interface";

type HanlderFunction = (req: any) => any;

export class Handler implements IHandler {
    private _handle: HanlderFunction;

    constructor(v: HanlderFunction) {
        this._handle = v;
    }

    public handle(request: any) {
        return this._handle(request);
    }
}