# Roon Kit Search

This is a simple command line based search engine that will prompt you for a query and then print out the results returned from your Roon Core. The top 5 results from each returned category are printed out.

This example illustrates the following:

- Initializing a `RoonExtension` class to use the `RoonApiBrowse` service.  
- Using `async/await` patterns with the `RoonApiBrowse` service to query and then load results.

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
$ cd samples/search
$ npm start
```

Enable the extension from within the extensions list in your Roon client and then follow the onscreen instructions.
