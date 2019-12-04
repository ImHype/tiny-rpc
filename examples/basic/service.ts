import { createService } from '../../src';
export const def = {
    "HelloRequest": {
        "fields": {
            "name": {
                "type": "string",
                "id": 1
            }
        }
    },
    "HelloReply": {
        "fields": {
            "status": {
                "type": "string",
                "id": 1
            }
        }
    },
    "AwesomeMessageService": {
        "methods": {
            "SayHello": {
                "requestType": "HelloRequest",
                "responseType": "HelloReply"
            }
        }
    }
} as const;

export const service = createService(def, 'AwesomeMessageService');