# Roon Kit

A collection of utility classes that simplify building extensions for [Roon](https://roonlabs.com/). Roon Kit modernizes the existing [node-roon-api](https://github.com/RoonLabs/node-roon-api) and adds the following features:

- Promises and async/await support. Most of the callback based functions of the `RoonApiBrowse`, `RoonApiImage`, and `RoonApiTransport` services have been modified to return promises instead of taking a callback.
- TypeScript definitions for everything. This adds type checking when building your app with TypeScript and enables better VSCode intellisense even for JavaScript based apps.
- New `RoonExtension` class to simplify initializing the `RoonApi` and subscribing to zones or outputs.
- Node.js style events for things like zone pairing and subscription callbacks. This lets multiple components subscribe to the same set of API notifications.
- The paired `RoonCore` is wrapped with a [Revocable Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/revocable) for added safety. This prevents apps from trying to use a core after its be unpaired and helps eliminate a whole class of bugs.
  
## Usage

To use Roon Kit in your project simply install it using your favorite package manager:

```bash
$ npm install roon-kit --save
```

or using [Yarn](https://yarnpkg.com/):

```bash
$ yarn add roon-kit
```

Create a `RoonExtension` class instead of the `RoonApi` class. You can tell the services you'd like to use and if you'd like the extension to subscribe to output or zones:

```javascript
const { RoonExtension } = require('roon-kit');

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
```

Next you can listen for subscription events if you've enabled those option(s):

```javascript
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
```

You can then start discovery and wait for a `RoonCore` to pair. There's no need to initialize the services as that's managed by the extension class:

```javascript
extension.start_discovery();
extension.set_status(`extension starting`);
```

You can get a handled to the current paired core by either subscribing to the `"core_paired"` event before your start discovery or by calling `extension.get_core()` after you start discovery. The get_core() method is asynchronous so you can wait for the core using either:

```javascript
extension.get_core().then((core) => {
    extension.set_status(`core paired`);
});
```

Or using a more modern async/await pattern:

```javascript
(async () => {
    const core = await extension.get_core();
    extension.set_status(`core paired`);
})();
``` 

## Building Packages and Samples

First ensure that you have the latest versions of [node.js](https://nodejs.org/) and [git](https://git-scm.com/downloads) installed. Next open a command window and clone the roon-kit repository to a local source directory:

```bash
$ git clone https://github.com/Stevenic/roon-kit
```

Next move to the cloned directory then install all package dependencies and build:

```bash
$ cd roon-kit
$ npm install
$ npm run build
```

Next move to the sample directory and start the sample:

```bash
$ cd samples/search
$ npm start
```

Enable the extension from within the extensions list in your Roon client and then follow the onscreen instructions.
