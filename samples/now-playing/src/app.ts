import { RoonExtension } from 'roon-kit';

const extension = new RoonExtension({
    description: {
        extension_id:        'roon-kit-now-playing',
        display_name:        "Roon Kit Now Playing Test",
        display_version:     "0.1.0",
        publisher:           'roon-kit',
        email:               'stevenic@microsoft.com',
        website:             'https://github.com/Stevenic/roon-kit'
    },
    RoonApiBrowse: 'not_required',
    RoonApiImage: 'not_required',
    RoonApiTransport: 'required',
    subscribe_outputs: false,
    subscribe_zones: true,
    log_level: 'none'
});

extension.on("subscribe_zones", (core, response, body) => {
    switch (response) {
        case 'Subscribed':
            const zone = body.zones![0];
            console.log(`Zone['${zone.zone_id}'] subscribed to "${zone.display_name}"`);
            console.log(`Zone['${zone.zone_id}'] "${zone.now_playing?.one_line.line1 ?? 'zone'}" is ${zone.state}`);
            break;
        case 'Changed':
            // NOTE: Important to check for zone changes first as you often get both zone & seek changes.
            if (body.zones_changed) {
                const zone = body.zones_changed[0];
                console.log(`Zone['${zone.zone_id}'] "${zone.now_playing?.one_line.line1 ?? 'zone'}" is ${zone.state}`);
            } else if (body.zones_seek_changed) {
                const zone = body.zones_seek_changed[0];
                console.log(`Zone['${zone.zone_id}'] time remaining: ${zone.queue_time_remaining} seconds`);
            } else {
                console.log(`${response}: ${JSON.stringify(body)}`);
            }
            break;
        default:
            console.log(`${response}: ${JSON.stringify(body)}`);
            break;
    }
});

extension.start_discovery();
extension.set_status(`extension starting`);

extension.get_core().then((core) => {
    extension.set_status(`core paired`);
});
