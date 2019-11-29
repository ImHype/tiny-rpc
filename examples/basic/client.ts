import { createClient } from "../../src";
import { service } from "./service";


async function main() {
    const client = createClient(service, {
        transport: 'http',
        target: '127.0.0.1:9090'
    });

    const resp = await client.callMethod('sayHello', {
        name: 'my-name'
    });

    console.log(resp);
}

main().catch(console.error);