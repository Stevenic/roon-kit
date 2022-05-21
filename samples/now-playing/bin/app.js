"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const roon_kit_1 = require("roon-kit");
const extension = new roon_kit_1.RoonExtension({
    description: {
        extension_id: 'roon-kit-now-playing',
        display_name: "Roon Kit Now Playing Test",
        display_version: "0.1.0",
        publisher: 'roon-kit',
        email: 'stevenic@microsoft.com',
        website: 'https://github.com/Stevenic/roon-kit'
    },
    RoonApiBrowse: 'not_required',
    RoonApiImage: 'not_required',
    RoonApiTransport: 'required',
    subscribe_outputs: false,
    subscribe_zones: true,
    log_level: 'none'
});
extension.on("subscribe_zones", (core, response, body) => {
    var _a, _b, _c, _d;
    switch (response) {
        case 'Subscribed':
            const zone = body.zones[0];
            console.log(`Zone['${zone.zone_id}'] subscribed to "${zone.display_name}"`);
            console.log(`Zone['${zone.zone_id}'] "${(_b = (_a = zone.now_playing) === null || _a === void 0 ? void 0 : _a.one_line.line1) !== null && _b !== void 0 ? _b : 'zone'}" is ${zone.state}`);
            break;
        case 'Changed':
            // NOTE: Important to check for zone changes first as you often get both zone & seek changes.
            if (body.zones_changed) {
                const zone = body.zones_changed[0];
                console.log(`Zone['${zone.zone_id}'] "${(_d = (_c = zone.now_playing) === null || _c === void 0 ? void 0 : _c.one_line.line1) !== null && _d !== void 0 ? _d : 'zone'}" is ${zone.state}`);
            }
            else if (body.zones_seek_changed) {
                const zone = body.zones_seek_changed[0];
                console.log(`Zone['${zone.zone_id}'] time remaining: ${zone.queue_time_remaining} seconds`);
            }
            else {
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
//# sourceMappingURL=app.js.map