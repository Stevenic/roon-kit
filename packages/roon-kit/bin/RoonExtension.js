"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoonExtension = void 0;
const RoonKit_1 = require("./RoonKit");
const events_1 = __importDefault(require("events"));
const internals_1 = require("./internals");
/**
 * Wrapper around the Roon API that simplifies initializing services and subscribing to zones.
 */
class RoonExtension extends events_1.default {
    /**
     * Creates a new `RoonExtension` instance.
     * @param options Settings used to configure the extension.
     */
    constructor(options) {
        super();
        // Assign default options
        this._options = Object.assign({}, options);
        // Transport service is required if there are any subscriptions
        const hasSubscriptions = this._options.subscribe_outputs || this._options.subscribe_zones;
        if (hasSubscriptions) {
            this._options.RoonApiTransport = 'required';
        }
        // Create API
        this._api = RoonKit_1.RoonKit.createRoonApi(Object.assign(Object.assign({}, options.description), { log_level: options.log_level, core_paired: (newCore) => {
                const core = this._core.resolve(newCore);
                this.emit("core_paired", core);
                // Setup subscriptions
                if (this._options.subscribe_outputs) {
                    core.services.RoonApiTransport.subscribe_outputs((r, b) => this.emit("subscribe_outputs", core, r, b));
                }
                if (this._options.subscribe_zones) {
                    core.services.RoonApiTransport.subscribe_zones((r, b) => this.emit("subscribe_zones", core, r, b));
                }
            }, core_unpaired: (oldCore) => {
                this.emit("core_unpaired", oldCore);
                this._core.dispose();
                this._core = new internals_1.TransientObject();
            } }));
        this._status = new RoonKit_1.RoonKit.RoonApiStatus(this._api);
    }
    /**
     * Returns the extensions RoonApi instance.
     */
    get api() {
        return this._api;
    }
    /**
     * Initializes the extensions services and begins discovery.
     * @param provided_services Optional. Additional services provided by extension. RoonApiState is already provided so DO NOT add this service.
     */
    start_discovery(provided_services = []) {
        if (this._core) {
            throw new Error(`RoonExtension: Discovery has already been started.`);
        }
        // Initialize transient object for to hold paired core
        this._core = new internals_1.TransientObject();
        // Add RoonApiStatus to list of provided services.
        provided_services.push(this._status);
        // Build list of required & optional services.
        const required_services = [];
        const optional_services = [];
        this.requireService(this._options.RoonApiBrowse, RoonKit_1.RoonKit.RoonApiBrowse, required_services, optional_services);
        this.requireService(this._options.RoonApiImage, RoonKit_1.RoonKit.RoonApiImage, required_services, optional_services);
        this.requireService(this._options.RoonApiTransport, RoonKit_1.RoonKit.RoonApiTransport, required_services, optional_services);
        // Initialize services
        this._api.init_services({ required_services, optional_services, provided_services });
        // Start discovery
        this._api.start_discovery();
    }
    /**
     * Sets the current status message for the extension.
     *
     * @remarks
     * If logging is enabled the message will also be written to the console.
     * @param message Extensions status message.
     * @param is_error Optional. If true an error occurred.
     */
    set_status(message, is_error = false) {
        this._status.set_status(message, is_error);
        if (this._options.log_level != 'none') {
            if (is_error) {
                console.error(`Extension Error: ${message}`);
            }
            else {
                console.log(`Extension Status: ${message}`);
            }
        }
    }
    /**
     * Sets new options before discovery is started.
     *
     * @remarks
     * Used primarily by additional components that want to ensure the services they depend on are
     * initialized.
     *
     * Can only be called before `start_discover()` is called.
     * @param options Options to apply.
     */
    update_options(options) {
        if (this._core) {
            throw new Error(`RoonExtension: Can't update options after discovery has been started.`);
        }
        this._options = Object.assign(this._options, options);
    }
    /**
     * Returns the current RoonCore. If there isn't one paired it waits.
     * @returns The current RoonCore that's paired.
     */
    get_core() {
        const transient = this.ensureStarted();
        return transient.getObject();
    }
    ensureStarted() {
        if (!this._core) {
            throw new Error(`RoonExtension: Discovery hasn't been started yet. Call start_discovery() first.`);
        }
        return this._core;
    }
    requireService(setting, svc, required_services, optional_services) {
        if (setting != undefined) {
            switch (setting) {
                case 'required':
                    required_services.push(svc);
                    break;
                case 'optional':
                    optional_services.push(svc);
                    break;
            }
        }
    }
}
exports.RoonExtension = RoonExtension;
//# sourceMappingURL=RoonExtension.js.map