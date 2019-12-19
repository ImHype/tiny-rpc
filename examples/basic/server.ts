import { createServer } from "../../src";
import { service } from "./interface";

async function main() {
    const server = createServer(service, {
        impl: {
            sayHello(helloRequest: {
                name: string
            }): {
                data: string
            } {
                console.log('helloRequest:', helloRequest)
                return {
                    data: 'hello, ' + helloRequest.name
                }
            }
        },
        port: 9090
    });

    server.serve();
}

main().catch(console.error);