import assert from "node:assert/strict";
import { getElevationData } from "usgs-ned";

const elevationData = await getElevationData({
  x: -122.57539940320193,
  y: 47.258260494342196,
  units: "Feet",
  wkid: 4326,
  includeDate: true,
});

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
    AcquisitionDate: new Date(2020, 2, 1), // "3/1/2020"
  },
};

assert.deepEqual(elevationData, expectedResult);
