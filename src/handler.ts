import { IHandler } from "./interface";

type HanlderFunction<ReqType, ResType> = (req: ReqType) => ResType;

export class Handler<ReqType, ResType> implements IHandler<ReqType, ResType> {
    private _handle: HanlderFunction<ReqType, ResType>;

    constructor(v: HanlderFunction<ReqType, ResType>) {
        this._handle = v;
    }

    public async handle(request: ReqType): Promise<ResType> {
        return this._handle(request);
    }
}