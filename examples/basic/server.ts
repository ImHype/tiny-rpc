import { createServer } from "../../src";
import { service } from "./service";

async function main() {
    const server = createServer(service, {
        impl: {
            sayHello(helloRequest: any) {
                console.log('helloRequest:', helloRequest)
                return {
                    status: '200'
                }
            }
        },
        port: 9090
    });

    server.serve();
}

main().catch(console.error);