import { IHandler } from "./interface";

export class Handler implements IHandler {
    private _handle: any;
    constructor(v: any) {
        this._handle = v;
    }

    public handle(a: any) {
        return this._handle(a);
    }
}