/// <reference types="node" />
import { RoonApi, RoonCore, RoonSubscriptionResponse, RoonExtensionDescription, ProvidedRoonServices, RoonApiTransportOutputs, RoonApiTransportZones } from './interfaces';
import EventEmitter from "events";
export declare type RoonServiceRequired = 'not_required' | 'required' | 'optional';
export interface RoonExtensionOptions {
    description: RoonExtensionDescription;
    log_level?: 'none' | 'all';
    RoonApiBrowse?: RoonServiceRequired;
    RoonApiImage?: RoonServiceRequired;
    RoonApiTransport?: RoonServiceRequired;
    subscribe_outputs?: boolean;
    subscribe_zones?: boolean;
}
export interface RoonExtension {
    on(eventName: 'core_paired', listener: (core: RoonCore) => void): this;
    off(eventName: 'core_paired', listener: (core: RoonCore) => void): this;
    once(eventName: 'core_paired', listener: (core: RoonCore) => void): this;
    emit(eventName: 'core_paired', core: RoonCore): boolean;
    on(eventName: 'core_unpaired', listener: (core: RoonCore) => void): this;
    off(eventName: 'core_unpaired', listener: (core: RoonCore) => void): this;
    once(eventName: 'core_unpaired', listener: (core: RoonCore) => void): this;
    emit(eventName: 'core_unpaired', core: RoonCore): boolean;
    on(eventName: 'subscribe_outputs', listener: (core: RoonCore, response: RoonSubscriptionResponse, body: RoonApiTransportOutputs) => void): this;
    off(eventName: 'subscribe_outputs', listener: (core: RoonCore, response: RoonSubscriptionResponse, body: RoonApiTransportOutputs) => void): this;
    once(eventName: 'subscribe_outputs', listener: (core: RoonCore, response: RoonSubscriptionResponse, body: RoonApiTransportOutputs) => void): this;
    emit(eventName: 'subscribe_outputs', core: RoonCore, response: RoonSubscriptionResponse, body: RoonApiTransportOutputs): boolean;
    on(eventName: 'subscribe_zones', listener: (core: RoonCore, response: RoonSubscriptionResponse, body: RoonApiTransportZones) => void): this;
    off(eventName: 'subscribe_zones', listener: (core: RoonCore, response: RoonSubscriptionResponse, body: RoonApiTransportZones) => void): this;
    once(eventName: 'subscribe_zones', listener: (core: RoonCore, response: RoonSubscriptionResponse, body: RoonApiTransportZones) => void): this;
    emit(eventName: 'subscribe_zones', core: RoonCore, response: RoonSubscriptionResponse, body: RoonApiTransportZones): boolean;
}
/**
 * Wrapper around the Roon API that simplifies initializing services and subscribing to zones.
 */
export declare class RoonExtension extends EventEmitter {
    private _options;
    private readonly _api;
    private readonly _status;
    private _core?;
    /**
     * Creates a new `RoonExtension` instance.
     * @param options Settings used to configure the extension.
     */
    constructor(options: RoonExtensionOptions);
    /**
     * Returns the extensions RoonApi instance.
     */
    get api(): RoonApi;
    /**
     * Initializes the extensions services and begins discovery.
     * @param provided_services Optional. Additional services provided by extension. RoonApiState is already provided so DO NOT add this service.
     */
    start_discovery(provided_services?: ProvidedRoonServices[]): void;
    /**
     * Sets the current status message for the extension.
     *
     * @remarks
     * If logging is enabled the message will also be written to the console.
     * @param message Extensions status message.
     * @param is_error Optional. If true an error occurred.
     */
    set_status(message: string, is_error?: boolean): void;
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
    update_options(options: Partial<RoonExtensionOptions>): void;
    /**
     * Returns the current RoonCore. If there isn't one paired it waits.
     * @returns The current RoonCore that's paired.
     */
    get_core(): Promise<RoonCore>;
    private ensureStarted;
    private requireService;
}
//# sourceMappingURL=RoonExtension.d.ts.map