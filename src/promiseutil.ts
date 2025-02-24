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

import Bluebird from "bluebird";

export interface Defer<T> {
    resolve: (value?: T) => void;
    reject: (err?: unknown) => void;
    promise: Bluebird<T>;
}

export function defer<T>(): Defer<T> {
    let resolve!: (value?: T) => void;
    let reject!: (err?: unknown) => void;
    const promise = new Bluebird((res, rej) => {
        resolve = res;
        reject = rej
    });
    return {
        resolve: resolve,
        reject: reject,
        promise: promise as Bluebird<T>
    };
}

/**
 * A Promise that delays the execution by a number of milliseconds.
 * This is a suitable replacement for Bluebird.delay().
 * @param ms The duration in milliseconds
 */
export function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Waits for all Promises to be "settled". A Promise is settled when
 * it resolves or rejects.
 */
export function allSettled<T>(promises: Bluebird<T>[]): Promise<Bluebird.Inspection<T>[]> {
    return Promise.all(promises.map(p => p.reflect()));
}
