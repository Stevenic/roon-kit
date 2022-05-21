"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoonKit = void 0;
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
class RoonKit {
    /**
     * Creates a new [[RoonApi]] instance.
     * @param options Options used to configure roon API.
     * @returns Created [[RoonApi]] instance.
     */
    static createRoonApi(options) {
        // Patch core callbacks
        for (const key in options) {
            switch (key) {
                case 'core_paired':
                case 'core_unpaired':
                case 'core_found':
                case 'core_lost':
                    const cb = options[key];
                    if (typeof cb == 'function') {
                        options[key] = (core) => cb(proxyCore(core));
                    }
                    break;
            }
        }
        // Create API
        return new RoonKit.RoonApi(options);
    }
}
exports.RoonKit = RoonKit;
/**
 * [[RoonApi]] class imported from 'node-roon-api' package.
 */
RoonKit.RoonApi = require('node-roon-api');
/**
 * [[RoonApiBrowse]] service imported from 'node-roon-api-browse' package.
 */
RoonKit.RoonApiBrowse = require('node-roon-api-browse');
/**
 * [[RoonApiImage]] service imported from 'node-roon-api-image' package.
 */
RoonKit.RoonApiImage = require('node-roon-api-image');
/**
 * [[RoonApiStatus]] service imported from 'node-roon-api-status' package.
 */
RoonKit.RoonApiStatus = require('node-roon-api-status');
/**
 * [[RoonApiTransport]] service imported from 'node-roon-api-transport' package.
 */
RoonKit.RoonApiTransport = require('node-roon-api-transport');
function proxyCore(core) {
    var _a, _b, _c;
    if (!core.isProxy) {
        // Proxy services
        if ((_a = core.services) === null || _a === void 0 ? void 0 : _a.RoonApiBrowse) {
            core.services.RoonApiBrowse = proxyBrowse(core.services.RoonApiBrowse);
        }
        if ((_b = core.services) === null || _b === void 0 ? void 0 : _b.RoonApiImage) {
            core.services.RoonApiImage = proxyImage(core.services.RoonApiImage);
        }
        if ((_c = core.services) === null || _c === void 0 ? void 0 : _c.RoonApiTransport) {
            core.services.RoonApiTransport = proxyTransport(core.services.RoonApiTransport);
        }
        core.isProxy = true;
    }
    return core;
}
function proxyBrowse(browse) {
    return new Proxy(browse, {
        get(t, p, r) {
            let v = Reflect.get(t, p, r);
            switch (p) {
                case 'browse':
                case 'load':
                    const fn = v;
                    v = (...args) => {
                        return new Promise((resolve, reject) => {
                            args.push((err, body) => {
                                if (err) {
                                    reject(err);
                                }
                                else {
                                    resolve(body);
                                }
                            });
                            fn.apply(t, args);
                        });
                    };
                    break;
            }
            return v;
        }
    });
}
function proxyImage(image) {
    return new Proxy(image, {
        get(t, p, r) {
            let v = Reflect.get(t, p, r);
            switch (p) {
                case 'get_image':
                    const fn = v;
                    v = (...args) => {
                        return new Promise((resolve, reject) => {
                            args.push((err, content_type, image) => {
                                if (err) {
                                    reject(err);
                                }
                                else {
                                    resolve({ content_type, image });
                                }
                            });
                            fn.apply(t, args);
                        });
                    };
                    break;
            }
            return v;
        }
    });
}
function proxyTransport(transport) {
    return new Proxy(transport, {
        get(t, p, r) {
            let fn;
            let v = Reflect.get(t, p, r);
            switch (p) {
                case 'change_settings':
                case 'change_volume':
                case 'control':
                case 'convenience_switch':
                case 'group_outputs':
                case 'mute':
                case 'mute_all':
                case 'pause_all':
                case 'seek':
                case 'standby':
                case 'toggle_standby':
                case 'transfer_zone':
                case 'ungroup_outputs':
                    fn = v;
                    v = (...args) => {
                        return new Promise((resolve, reject) => {
                            args.push((err) => {
                                if (err) {
                                    reject(err);
                                }
                                else {
                                    resolve();
                                }
                            });
                            fn.apply(t, args);
                        });
                    };
                    break;
                case 'get_outputs':
                case 'get_zones':
                case 'play_from_here':
                    fn = v;
                    v = (...args) => {
                        return new Promise((resolve, reject) => {
                            args.push((err, body) => {
                                if (err) {
                                    reject(err);
                                }
                                else {
                                    resolve(body);
                                }
                            });
                            fn.apply(t, args);
                        });
                    };
                    break;
            }
            return v;
        }
    });
}
//# sourceMappingURL=RoonKit.js.map