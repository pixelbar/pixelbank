# Pixelbank [![codecov](https://codecov.io/gh/pixelbar/pixelbank/branch/master/graph/badge.svg)](https://codecov.io/gh/pixelbar/pixelbank)

Pixelbank is a simpel server-client balance system. It's heavily inspired by [revbank](https://github.com/revspace/revbank).

## How to run

For the server [nodejs](https://nodejs.org) is needed.
Clients can be written in any language. An example client is included which is also written in nodejs.

Run the following commands to build the server

```nodejs
cd server
npm build
```

An `out` directory will be created. This and the `node_modules` folder can be run on the target machine by running `node out/index.js`

This entire process can be simplified by running
```nodejs
cd server
npm build_and_start
```

which combines the above steps in one.
