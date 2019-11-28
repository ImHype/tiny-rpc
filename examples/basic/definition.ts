export default {
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
}