import { Readable } from "stream";

export class StreamReader {
    private readable: Readable;
    private buffering: Buffer = Buffer.alloc(0);

    constructor(readable: Readable) {
        this.readable = readable;
    }

    async readAll() {
        const { readable } = this;

        const list = [
            this.buffering
        ];

        for await (const chunk of readable) {
            list.push(chunk);
        }

        return Buffer.concat(list);
    }

    async read(size: number) {
        const { readable } = this;
        const diff = size - this.buffering.byteLength;

        let total;

        if (diff <= 0) {
            total = this.buffering;
        } else {
            const list = [
                this.buffering
            ];

            let crtRoundSize = 0;
            for await (const chunk of readable) {
                list.push(chunk);
                crtRoundSize += chunk.byteLength;
                if (crtRoundSize > diff) {
                    break;
                }
            }

            total = Buffer.concat(list);
        }

        this.buffering = total.slice(size);
        
        return total.slice(0, size);
    }
}
