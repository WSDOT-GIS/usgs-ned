usgsNed - USGS National Elevation Dataset Point Query Service
=============================================================

A library for calling the [USGS NED Point Query Service].

[![Build Status](https://travis-ci.org/WSDOT-GIS/usgs-ned.svg?branch=master)](https://travis-ci.org/WSDOT-GIS/usgs-ned)

Usage
-----

### Installation ###

Use a package manager (e.g., NPM or Yarn) to install the package named [*usgs-ned*](https://yarn.pm/usgs-ned).

```console
npm add usgs-ned
```

or

```console
yarn add usgs-ned
```

This package makes use of the [Fetch API], which is built into modern browsers. If you are using this package in Node, you will also need to install a package like [isomorphic-fetch] that will add support for the Fetch API.

### Sample Usage in TypeScript ###

```typescript
import { getElevation } from "usgs-ned";

// Omit next line in browser environments. if (typeof fetch === "undefined") ...
import "isomorphic-fetch";

const inx = -121.74499511715358;
const iny = 46.837649560927126;
const inUnits: "Feet";

getElevation(inx, iny, inUnits).then(result => {
    const { x, y, dataSource, elevation, units } = result;
    console.log(`The elevation is ${elevation} ${units} at ${x}, ${y}. (source: ${dataSource})`);
    // The elevation is 10532.22 Feet at -121.74499511715358, 46.837649560927126. (source: 3DEP 1/3 arc-second)
});
```

[Fetch API]:https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
[isomorphic-fetch]:https://yarnpkg.com/en/package/isomorphic-fetch
[USGS NED Point Query Service]: https://nationalmap.gov/epqs/
