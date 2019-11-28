export class Ready {
    private queue: any[];
    private isReady: boolean;

    constructor() {
        this.queue = [];
        this.isReady = false;
    }

    wait() {
        if (this.isReady) return;
        return new Promise((resolve) => {
            this.queue.push(resolve);
        })
    }

    ready() {
        this.isReady = true;
        let it: any;
        while(it = this.queue.pop()) {
            it();
        }
    }
}
