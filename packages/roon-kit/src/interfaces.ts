
export type EmptyObject = {
    [K in any] : never
}

export interface RoonExtensionDescription {
    extension_id: string;
    display_name: string;
    display_version: string;
    publisher: string;
    email: string;
    website: string;
}

export interface RoonApiOptions extends RoonExtensionDescription {
    log_level?: 'none' | 'all';
    core_paired?: (core: RoonCore) => void;
    core_unpaired?: (core: RoonCore) => void;
    core_found?: (core: RoonCore) => void;
    core_lost?: (core: RoonCore) => void;
}

export interface RoonCore {
    core_id: string;
    display_name: string;
    display_version: string;
    services: {
        readonly RoonApiBrowse: RoonApiBrowse;
        readonly RoonApiImage: RoonApiImage;
        readonly RoonApiTransport: RoonApiTransport;
    };
}

export type RequestedRoonServices = RoonApiBrowse | RoonApiImage | RoonApiTransport;
export type ProvidedRoonServices = RoonApiStatus | object;

export interface RoonServiceOptions {
    required_services?: {new (): RequestedRoonServices}[];
    optional_services?: {new (): RequestedRoonServices}[];
    provided_services?: ProvidedRoonServices[];
}

export interface WSConnectOptions {
    host: string;
    port: number;
    onclose?: () => void;
}

export type RoonSubscriptionResponse = 'Subscribed' | 'Changed' | 'Unsubscribed';

export interface RoonApi {
    // constructor(options: RoonApiOptions);
    init_services(services: RoonServiceOptions): this;
    load_config<T = any>(key: string): T;
    save_config(key: string, value: any): void;
    start_discovery(): void;
    ws_connect(options: WSConnectOptions): this;
}

export interface RoonApiBrowseOptions {
    hierarchy: RoonApiBrowseHierarchy;
    multi_session_key?: string;
    item_key?: string;
    input?: string;
    zone_or_output_id?: string;
    pop_all?: boolean;
    pop_levels?: number;
    refresh_list?: boolean;
    set_display_offset?: number;
}

export type RoonApiBrowseHierarchy = 'browse' | 'playlists' | 'settings' | 'internet_radio' | 'albums' | 'artists' | 'genres' | 'composers' | 'search';

export interface RoonApiBrowseResponse {
    action: string;
    item?: Item; 
    list?: List;  
    message?: string;
    is_error?: boolean;
}

export interface Item {
    title: string;
    subtitle?: string;
    image_key?: string;
    item_key?: string;
    hint?: ItemHint | null;
    input_prompt?: {
        prompt: string;
        action: string;
        value?: string;
        is_password?: boolean;
    }
}

export type ItemHint = 'action' | 'action_list' | 'list' | 'header';

export interface List {
    title: string;
    count: number;
    subtitle?: string;
    image_key?: string;
    level: number;
    display_offset?: number;
    hint?: ListHint | null;
}

export type ListHint = 'action_list';

export interface RoonApiBrowseLoadOptions {
    set_display_offset?: number;
    level?: number;
    offset?: number;
    count?: number;
    hierarchy: RoonApiBrowseHierarchy;
    multi_session_key?: string;
}

export interface RoonApiBrowseLoadResponse {
    items: Item[];
    offset: number;
    list: List;
}

export interface RoonApiBrowse {
    browse(options: RoonApiBrowseOptions | EmptyObject): Promise<RoonApiBrowseResponse>;
    load(options: RoonApiBrowseLoadOptions): Promise<RoonApiBrowseLoadResponse>;
}

export interface RoonApiImageResultOptions {
    scale?: RoonImageScale;
    width?: number;
    height?: number;
    format?: RoonImageFormat;
}

export type RoonImageScale = 'fit' | 'fill' | 'stretch';

export type RoonImageFormat = 'image/jpeg' | 'image/png';

export interface RoonApiImage {
    get_image(image_key: string, options: RoonApiImageResultOptions): Promise<{content_type: string, image: Buffer}>;
}

export interface Zone {
    zone_id: string;
    display_name: string;
    outputs: Output[];
    state: RoonPlaybackState;
    seek_position?: number;
    is_previous_allowed: boolean;
    is_next_allowed: boolean;
    is_pause_allowed: boolean;
    is_play_allowed: boolean;
    is_seek_allowed: boolean;
    queue_items_remaining?: number;
    queue_time_remaining?: number;
    settings?: ZoneSettings;
    now_playing?: ZoneNowPlaying;
}

export type RoonPlaybackState  = 'playing' | 'paused' | 'loading' | 'stopped';

export interface ZoneSettings {
    loop: ZoneLoopSettings;
    shuffle: boolean;
    auto_radio: boolean;
}

export type ZoneLoopSettings = 'loop' | 'loop_one' | 'disabled';

export interface RoonThreeLine {
    one_line: {
        line1: string;
    },
    two_line: {
        line1: string;
        line2?: string;
    },
    three_line: {
        line1: string;
        line2?: string;
        line3?: string;
    }
}

export interface ZoneNowPlaying extends RoonThreeLine {
    seek_position?: number;
    length?: number;
    image_key?: string;
}

export interface Output {
    output_id: string;
    zone_id: string;
    can_group_with_output_ids: string[];
    display_name: string;
    state?: RoonPlaybackState;
    source_controls?: OutputSourceControls[];
    volume?: OutputVolumeControl;
}

export interface OutputSourceControls {
    control_key: string;
    display_name: string;
    status: OutputSourceControlStatus;
    supports_standby: boolean;
}

export type OutputSourceControlStatus = 'selected' | 'deselected' | 'standby' | 'indeterminate';

export interface OutputVolumeControl {
    type?: OutputVolumeControlType | string;
    min?: number;
    max?: number;
    value?: number;
    step?: number;
    is_muted?: boolean;
}

export type OutputVolumeControlType = 'number' | 'db' | 'incremental';

export interface RoonApiTransportSettings {
    shuffle?: boolean;
    auto_radio?: boolean;
    loop?: RoonLoopOptions;
}

export type RoonLoopOptions  = 'loop' | 'loop_one' | 'disabled' | 'next';

export type RoonChangeVolumeHow = 'absolute' | 'relative' | 'relative_step';

export type RoonApiTransportControl = 'play' | 'pause' | 'playpause' | 'stop' | 'previous' | 'next';

export interface RoonApiTransportConvenienceSwitchOptions {
    control_key?: string;
}

export type RoonMuteHow = 'mute' | 'unmute';

export type RoonSeekHow = 'relative' | 'absolute';

export interface RoonApiTransportStandbyOptions {
    control_key?: string;
}

export type RoonApiTransportOutputSubscriptionCallback = (response: RoonSubscriptionResponse, body: RoonApiTransportOutputs) => void;

export interface RoonApiTransportOutputs {
    outputs?: Output[];
    changed_outputs?: Output[];
}

export type RoonApiTransportZonesSubscriptionCallback = (response: RoonSubscriptionResponse, body: RoonApiTransportZones) => void;

export interface RoonApiTransportZones {
    zones?: Zone[];
    zones_added?: Zone[];
    zones_changed?: Zone[];
    zones_removed?: Zone[];
    zones_seek_changed?: Pick<Zone, 'zone_id' | 'queue_time_remaining' | 'seek_position'>[];
}

export type RoonApiTransportQueueSubscriptionCallback = (response: RoonSubscriptionResponse, body: RoonApiTransportQueue) => void;

export interface QueueItem extends RoonThreeLine{
    queue_item_id: number;
    length: number;
    image_key: string;
}

export interface RoonApiTransportQueue {
    items?: QueueItem[];
    changes?: QueueChange[];
}

export interface QueueChange {
    operation: string;
}

export interface RemoveQueueChange extends QueueChange {
    operation: 'remove';
    index: number;
    count: number;
}

export interface InsertQueueChange extends QueueChange {
    operation: 'insert';
    index: number;
    items: QueueItem[];
}

export interface RoonApiTransport {
    change_settings(zone: Zone | Output, settings: RoonApiTransportSettings): Promise<void>;
    change_volume(output: Output, how: RoonChangeVolumeHow, value: number): Promise<void>;
    control(zone: Zone | Output, control: RoonApiTransportControl): Promise<void>;
    convenience_switch(output: Output, opts: RoonApiTransportConvenienceSwitchOptions | EmptyObject): Promise<void>;
    get_outputs(): Promise<RoonApiTransportOutputs>;
    get_zones(): Promise<RoonApiTransportZones>;
    group_outputs(outputs: Output[]): Promise<void>;
    mute(output: Output, how: RoonMuteHow): Promise<void>;
    mute_all(how: RoonMuteHow): Promise<void>;
    pause_all(): Promise<void>;
    play_from_here(zone: Zone | Output, queue_item_id: string): Promise<RoonApiTransportQueue>;
    seek(zone: Zone | Output, how: RoonSeekHow, seconds: number): Promise<void>;
    standby(output: Output, opts: RoonApiTransportStandbyOptions): Promise<void>;
    subscribe_outputs(cb: RoonApiTransportOutputSubscriptionCallback): void;
    subscribe_queue(zone: Zone | Output, max_item_count: number, cb: RoonApiTransportQueueSubscriptionCallback): void;
    subscribe_zones(cb: RoonApiTransportZonesSubscriptionCallback): void;
    toggle_standby(output: Output, opts: RoonApiTransportStandbyOptions): Promise<void>;
    transfer_zone(fromzone: Zone | Output, tozone: Zone | Output): Promise<void>;
    ungroup_outputs(outputs: Output[]): Promise<void>;
    zone_by_zone_id(zone_id: string): Zone | null;
    zone_by_output_id(output_is: string): Output | null;
    zone_by_object(zone: Zone | Output): Zone;
}

export interface RoonApiStatus {
    //constructor(roon: RoonApi);
    set_status(message: string, is_error: boolean): void;
}
