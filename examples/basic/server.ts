import { createServer } from "../../src/server";
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
        }
    });

    server.serve(9090);
}

main().catch(console.error);