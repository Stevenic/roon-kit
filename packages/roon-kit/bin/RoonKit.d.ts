import { RoonApi, RoonApiBrowse, RoonApiImage, RoonApiOptions, RoonApiStatus, RoonApiTransport } from './interfaces';
/**
 * Shared types and functions.
 *
 * #### Remarks
 * The `RoonKit` class exposes types for all of the classes & services it imports from the various
 * `node-roon-api-XXXX` packages. Applications working directly with the imported api classes should
 * call the [[RoonKit.createRoonApi]] method when creating new instances of the [[RoonKit.RoonApi]]
 * class. This is the only way to ensure that all of the API's services are properly converted to
 * being promise based.
 */
export declare class RoonKit {
    /**
     * [[RoonApi]] class imported from 'node-roon-api' package.
     */
    static readonly RoonApi: new (options: RoonApiOptions) => RoonApi;
    /**
     * [[RoonApiBrowse]] service imported from 'node-roon-api-browse' package.
     */
    static readonly RoonApiBrowse: new () => RoonApiBrowse;
    /**
     * [[RoonApiImage]] service imported from 'node-roon-api-image' package.
     */
    static readonly RoonApiImage: new () => RoonApiImage;
    /**
     * [[RoonApiStatus]] service imported from 'node-roon-api-status' package.
     */
    static readonly RoonApiStatus: new (roon: RoonApi) => RoonApiStatus;
    /**
     * [[RoonApiTransport]] service imported from 'node-roon-api-transport' package.
     */
    static readonly RoonApiTransport: new () => RoonApiTransport;
    /**
     * Creates a new [[RoonApi]] instance.
     * @param options Options used to configure roon API.
     * @returns Created [[RoonApi]] instance.
     */
    static createRoonApi(options: RoonApiOptions): RoonApi;
}
//# sourceMappingURL=RoonKit.d.ts.map