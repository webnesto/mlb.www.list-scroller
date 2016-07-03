# MLB - List Scroller

Repo based on personal fork (https://github.com/webnesto/gulp-starter) of gulp-starter (https://github.com/vigetlabs/gulp-starter) by vignet labs.

```bash
git clone https://github.com/webnesto/mlb.www.list-scroller.git ListScroller
cd ListScroller
npm install
npm start
```

(see https://github.com/webnesto/gulp-starter.git README for full framework tools/features list)

## Usage
Make sure Node installed. I recommend using [NVM](https://github.com/creationix/nvm) to manage versions.

This has been tested on Node `0.12.x` - `5.9.0`, and should work on newer versions as well. [File an issue](https://github.com/vigetlabs/gulp-starter/issues) if it doesn't!

#### Install Dependencies
```bash
npm install
```

#### Run development tasks:
```
npm start
```

Use development mode if you want to run a local node webserver, and see the effects of code changes.  Otherwise for demo - see "Running the Demo" below.

#### Tests:
Tests ommitted for this effort in the interest of speed and brevity.

#### Build production files:
```bash
npm run production
```

This will produce production deliverable assets (with file versioning). Without launching a webserver.

### Running the Demo

```
npm run demo
```

This will start a static server that serves your production files to http://localhost:5000. This is primarily meant as a way to preview your production build locally, not necessarily for use as a live production server.


