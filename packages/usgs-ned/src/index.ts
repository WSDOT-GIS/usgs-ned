// https://epqs.nationalmap.gov/v1/json?x=-122.57539940320193&y=47.258260494342196&units=Feet&wkid=4326&includeDate=True

/*
// Expected response:
const a = {
  location: {
    x: -122.57539940320193,
    y: 47.258260494342196,
    spatialReference: { wkid: 4326, latestWkid: 4326 },
  },
  locationId: 0,
  value: 13.34829010234212,
  rasterId: 42167,
  resolution: 1,
};

// with date
{
  "location": {
    "x": -122.57539940320193,
    "y": 47.258260494342196,
    "spatialReference": {
      "wkid": 4326,
      "latestWkid": 4326
    }
  },
  "locationId": 0,
  "value": 13.34829010234212,
  "rasterId": 42167,
  "resolution": 1,
  "attributes": {
    "AcquisitionDate": "3/1/2020"
  }
}
*/

export type WKId = 4326 | 102100;

export type MeasurementUnits = "Feet" | "Meters";

/**
 * Parameters for {@link getElevationData}.
 */
export interface EpqsParameters {
  /** Longitude */
  x: number;
  /** Latitude */
  y: number;
  /** Specifies the output measurement units */
  units?: MeasurementUnits;
  /**
   * The Well-Known Identifier (WKID) of x and y.
   */
  wkid?: WKId;
  /**
   * Set to `true` if you want the output to include
   * an `attributes` property with an `AcquisitionDate`
   * date value.
   */
  includeDate?: boolean;
}

/**
 * Represents a spatial reference system, defined by a
 * {@link WKId}
 */
export interface SpatialReference {
  wkid: WKId;
  latestWkid?: WKId;
}

export type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type Year = `20${Digit}${Digit}`;
export type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type Day =
  | Month
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26
  | 27
  | 28
  | 29
  | 30
  | 31;

type DateOrString = Date | `${Month}/${Day}/${Year}`;

export interface ElevationDataAttributes<DT extends DateOrString> {
  AcquisitionDate: DT;
}

export interface ElevationData<DT extends DateOrString> {
  x: number;
  y: number;
  spatialReference: SpatialReference;
  locationId: number;
  value: number;
  rasterId: number;
  resolution: number;
  attributes?: ElevationDataAttributes<DT>;
}

/**
 * The type specification for the "reviver" parameter of {@link JSON.parse}
 */
type JsonReviver = Parameters<typeof JSON.parse>[1];

/**
 * A reviver function for use with {@link JSON.parse}.
 * Any property with a name ending with "Date" (case-insensitive)
 * which has a string value will be parsed into a {@link Date} object.
 * @param key - property name
 * @param value - value of the property corresponding to {@link key}
 * @returns
 */
const reviver: JsonReviver = function (key, value) {
  if (/Date$/gi.test(key) && typeof value === "string") {
    // Split the string at slashes.
    const [month, day, year] = value.split("/").map((value, index) => {
      // Parse the string into an integer.
      const output = parseInt(value, 10);
      // JavaScript stupidly requires month value to be zero-based
      // to construct a date, so we need to subtract 1 for the first
      // item (index 0) in the array. The rest will be left as is.
      return index === 0 ? output - 1 : output;
    });
    return new Date(year, month - 1, day);
  }
  return value;
};

/**
 * Adds the properties of an object to a {@link URLSearchParams}.
 * @param parameters - An {@link object}
 * @param urlSearchParameters - Optionally provide an existing
 * instance of {@link URLSearchParams}.
 * If omitted, a new instance will be created.
 * @returns - Returns {@link urlSearchParameters} if it was provided.
 * Otherwise returns a new {@link URLSearchParams} instance.
 */
function addObjectPropertiesToUrlSearchParams(
  parameters: Record<string, never>,
  urlSearchParameters?: URLSearchParams
) {
  // Create a new URLSearchParams if one was not provided.
  if (!urlSearchParameters) {
    urlSearchParameters = new URLSearchParams();
  }
  // Add each of the properties to the search params object.
  // Convert non-string values to strings before adding.
  for (const key in parameters) {
    if (Object.prototype.hasOwnProperty.call(parameters, key)) {
      const value = parameters[key];
      urlSearchParameters.set(
        key,
        typeof value === "string" ? value : `${value}`
      );
    }
  }
  return urlSearchParameters;
}

/**
 * Calls the Elevation Point Query Service (EPQS)
 * > This API returns the elevation in international feet or meters for a specific
 * > latitude/longitude (NAD 1983) point from the USGS Elevation Service hosted at
 * > the [U.S. Geological Survey (USGS) National Geospatial Technical Operations Center (NGTOC)](https://www.usgs.gov/national-geospatial-technical-operations-center).
 * @param parameters - query parameters, including x and y coordinates.
 * @param url - Override the default URL in case it changes and this package hasn't been updated yet.
 * @returns - Returns elevation data from the input location.
 */
export async function getElevationData(
  parameters: EpqsParameters,
  url = "https://epqs.nationalmap.gov/v1/json"
) {
  const queryUrl = new URL(`${url}`);
  addObjectPropertiesToUrlSearchParams(
    parameters as never,
    queryUrl.searchParams
  );
  const response = await fetch(queryUrl);
  const outputText = await response.text();
  const output = JSON.parse(outputText, reviver);
  return output as ElevationData<Date>;
}

export default getElevationData;
