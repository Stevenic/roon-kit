# Roon Kit Now Playing

This is a simple command line app that shows now playing information for any active zones.

This example illustrates the following:

- Initializing a `RoonExtension` class to use the `RoonApiTransport` service.
- Subscribing to zones and displaying zone changes.
- Waiting for a Roon Core to pair using promises.
- Calling `set_status()` to update the extensions current status.

## Usage

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
$ cd samples/now-playing
$ npm start
```

Enable the extension from within the extensions list in your Roon client and the extension should start streaming now playing information to the screen. Kill the process to end.
