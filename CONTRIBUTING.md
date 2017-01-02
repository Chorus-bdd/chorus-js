# Contributing

## System requirements

- [Node.js](http://nodejs.org/)
- [Git](https://git-scm.com/)


## Development
To begin developing follow the steps below.

1. Install and set up dependencies and git hooks:

   ```bash
   npm install
   npm run hook
   ```

2. Run local dev server:

   ```bash
   npm start
   ```

   Optionally start the server on a custom port:
   ```bash
   PORT=8888 npm start
   ```

   Or start the server in production mode:
   ```bash
   NODE_ENV=production npm start
   ```

   The example will be available on: **http://localhost:9000** by default.


## Building the docs
To build the docs follow the steps below.

TODO


## Releasing
To release new versions to npm and Github follow the steps below.

```bash
npm version (patch|minor|major)
npm publish
```
