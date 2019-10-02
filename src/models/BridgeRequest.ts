/*
Copyright 2019 The Matrix.org Foundation C.I.C.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import logging = require("../logging");
const log = logging.get("req");

interface Req {
    getPromise(): Promise<unknown>;
    resolve<T>(thing: T): void;
    reject<T>(err: T): void;
    getId(): string;
    getData(): {
        isFromIrc: boolean;
    } | undefined;
}

export class BridgeRequest {
    // We don't have a type for this yet
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public readonly log: any;
    constructor(public readonly req: Req) {
        const data = req.getData();
        const isFromIrc = data ? Boolean(data.isFromIrc) : false;
        this.log = logging.newRequestLogger(log, req.getId(), isFromIrc);
    }

    public getPromise(): Promise<unknown> {
        return this.req.getPromise();
    }

    public resolve<T>(thing: T) {
        this.req.resolve(thing);
    }

    public reject<T>(err: T) {
        this.req.reject(err);
    }

    public static readonly ERR_VIRTUAL_USER = "virtual-user";
    public static readonly ERR_NOT_MAPPED = "not-mapped";
    public static readonly ERR_DROPPED = "dropped";
}
