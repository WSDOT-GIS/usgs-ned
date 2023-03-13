# usgs-ned

[![Node.js CI][workflow badge]][workflow yaml]
[![GitHub](https://img.shields.io/github/forks/WSDOT-GIS/usgs-ned.svg?style=flat-square)](https://github.com/WSDOT-GIS/usgs-ned)
[![npm](https://img.shields.io/npm/v/usgs-ned.svg)](https://www.npmjs.org/package/usgs-ned)
[![npm](https://img.shields.io/npm/l/package.svg)](https://www.npmjs.org/package/package)
[![GitHub](https://img.shields.io/github/issues/WSDOT-GIS/usgs-ned.svg)](https://github.com/WSDOT-GIS/usgs-ned/issues)

<!-- markdownlint-disable no-inline-html -->

Library for use with the [The National Map - Elevation Point Query Service] of the <abbr title="United States Geological Survey">USGS</abbr> (formerly known as <abbr title="National Elevation Dataset">NED</abbr>).

<!-- markdownlint-enable no-inline-html -->

> The **Elevation Point Query Service** returns the elevation in international feet or meters for a specific latitude/longitude (NAD 1983) point from the USGS Elevation Service hosted at the [NGTOC]. Input parameters: **x** (_longitude_), **y** (_latitude_), **units** (_Feet, Meters_), **output** (_XML, JSON_). Latitude and longitude must be specified in decimal degrees with southern latitudes and western longitudes represented as negative values.

## Installation

Use a package manager (e.g., NPM or Yarn) to install the package named [_usgs-ned_](https://yarn.pm/usgs-ned).

```console
npm install usgs-ned
```

## Use

```javascript
import { getElevationData, MeasurementUnits, WKId } from "usgs-ned";

// Call the webs service.

const elevationData = await getElevationData({
  x: -122.57539940320193,
  y: 47.258260494342196,
  units: MeasurementUnits.Feet,
  wkid: WKId.gps,
  includeDate: true,
});

// The expected result should be similar to this.

const expectedResult = {
  location: {
    x: -122.57539940320193,
    y: 47.258260494342196,
    spatialReference: {
      wkid: 4326,
      latestWkid: 4326,
    },
  },
  locationId: 0,
  value: 13.34829010234212,
  rasterId: 42167,
  resolution: 1,
  attributes: {
    AcquisitionDate: new Date(2020, 2, 1)
  },
};

```

<!-- References section -->

[The National Map - Elevation Point Query Service]: https://apps.nationalmap.gov/epqs/
[NGTOC]: https://www.usgs.gov/national-geospatial-technical-operations-center
[workflow badge]: https://github.com/WSDOT-GIS/usgs-ned/actions/workflows/node.js.yml/badge.svg
[workflow yaml]: https://github.com/WSDOT-GIS/usgs-ned/actions/workflows/node.js.yml
