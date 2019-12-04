type Resolve = () => void;

export class Ready {
    private queue: Resolve[];
    private isReady: boolean;

    constructor() {
        this.queue = [];
        this.isReady = false;
    }

    waitReady() {
        if (this.isReady) return;
        return new Promise<Resolve>((resolve) => {
            this.queue.push(resolve);
        })
    }

    ready() {
        this.isReady = true;
        let it: Resolve | undefined;

        while(it = this.queue.pop()) {
            it();
        }
    }
}
