import { EventEmitter } from "events";
import { createRequest, createResponse, RequestOptions } from "node-mocks-http";
import * as express from "express";
import config from "./test-config.json";

export class MockAppservice extends EventEmitter {
    private provisionerRouter?: express.Router;
    private expressApp = {
        get: () => {
            // no-op
        },
        post: () => {
            // no-op
        },
        use: (path: string, router: any) => {
            if (path === '/_matrix/provision') {
                // The provisioner router.
                console.log(router);
                this.provisionerRouter = router;
            }
        }
    };

    async mockApiCall(opts: RequestOptions) {
        if (!this.provisionerRouter) {
            throw new Error("IRC AS hasn't hooked into link/unlink yet.");
        }

        const request = createRequest({
            headers: {
                'authorization': `Bearer ${config.ircService.provisioning.secret}`,
            },
            ...opts,
        });

        const response = createResponse({
            eventEmitter: EventEmitter,
        });
        this.provisionerRouter(request, response, () => { });
        return response;
    }

    listen(port: number) {
        // no-op
    }

    close() {
        // no-op
    }

    link(body) {
        return this.mockApiCall({
            method: 'POST',
            url: '/link',
            body: body,
        });
    }
}
