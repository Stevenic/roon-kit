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
    // Print new subscriptions
    const addedZones = body.zones ?? body.zones_added ?? [];
    addedZones.forEach(zone => {
        console.log(`Zone['${zone.zone_id}'] subscribed to "${zone.display_name}"`);
        console.log(`Zone['${zone.zone_id}'] "${zone.now_playing?.one_line.line1 ?? 'zone'}" is ${zone.state}`);
    });

    // Print removed subscriptions
    const removedZones = body.zones_removed ?? [];
    removedZones.forEach(zone => {
        console.log(`Zone['${zone.zone_id}'] unsubscribed from "${zone.display_name}"`);
    }); 

    // Print zone state changes
    const changedZones = body.zones_changed ?? [];
    changedZones.forEach(zone => {
        console.log(`Zone['${zone.zone_id}'] "${zone.now_playing?.one_line.line1 ?? 'zone'}" is ${zone.state}`);
    });

    // Print zone seeks
    const seekedZones = body.zones_seek_changed ?? [];
    seekedZones.forEach(zone => {
        console.log(`Zone['${zone.zone_id}'] time remaining: ${zone.queue_time_remaining} seconds`);
    });
});

console.log(`Starting discovery. Enable extension if needed.`);
extension.start_discovery();
extension.set_status(`extension starting`);

extension.get_core().then((core) => {
    extension.set_status(`core paired`);
});
