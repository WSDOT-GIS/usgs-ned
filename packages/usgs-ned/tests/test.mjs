import assert from "node:assert/strict";
import { getElevationData, MeasurementUnits, WKId } from "usgs-ned";

/**
 * Recursively tests properties of actual and expected using {@link assert}.
 */
function testLocation(actual, expected) {
  for (const key in expected) {
    console.group(`Currently testing the ${key} properties of expected vs. actual.`)
    if (Object.hasOwnProperty.call(expected, key)) {
      const expectedValue = expected[key];
      const actualValue = actual[key];
      console.log("expected vs. actual", {
        expectedValue,
        actualValue
      })
      assert.equal(
        typeof actualValue,
        typeof expectedValue,
        `Types of ${key} property should match.`
      );
      if (/\w+Date$/i.test(key)) {
        assert(
          actualValue instanceof Date,
          `${key} should be an instance of ${Date.name}`
        );
      } else if (
        typeof expectedValue === "object" &&
        typeof actualValue === "object"
      ) {
        testLocation(actualValue, expectedValue);
      } else {
        assert.equal(actualValue, expectedValue, `${key} values should match.`)
      }
    }
    console.groupEnd();
  }
}

const wkid = WKId.gps;
const expectedResult = {
  location: {
    x: -122.57539940320193,
    y: 47.258260494342196,
    spatialReference: {
      wkid: wkid,
      latestWkid: wkid,
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

// Call the service to get elevation data.

const elevationData = await getElevationData({
  x: -122.57539940320193,
  y: 47.258260494342196,
  units: MeasurementUnits.Feet,
  wkid: wkid,
  includeDate: true,
});

console.log("expected results", expectedResult);
console.log("actual result", elevationData);

// Compare the results with the expected results.

testLocation(elevationData, expectedResult);
