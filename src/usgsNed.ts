/**
 * Module that provides access to USGS NED Point Query service
 */

/**
 * import modules. (This is needed for TypeDoc to recognize module comment.)
 */
import ElevationQueryResult from "./ElevationQueryResult";

export interface ElevationQueryInterface {
  x: number;
  y: number;
  Data_Source: string;
  Elevation: number;
  Units: "Feet" | "Meters";
}

/**
 * Output format as it is returned directly from the service
 */
export interface UsgsElevationPointQueryServiceResult {
  USGS_Elevation_Point_Query_Service: {
    Elevation_Query: ElevationQueryInterface;
  };
}

/**
 * Converts an object into a query string
 * @returns {string}
 * @private
 */
function objectToQueryString(o: any) {
  const output: any[] = [];
  let name: string;
  for (name in o) {
    if (o.hasOwnProperty(name)) {
      let v = o[name];
      if (typeof v === "object") {
        v = JSON.stringify(v);
      }
      output.push([name, v].map(encodeURIComponent).join("="));
    }
  }
  return output.join("&");
}

/**
 * Creates a request to the USGS NED point service
 * @param x - The X coordinate (EPSG:4326)
 * @param y - The Y coordinate (EPSG:4326)
 * @param [units="Feet"] - Specifies the output measurement units
 * @param [baseUrl="https://nationalmap.gov/epqs/pqs.php"] - If the URL to the service is changed you can use this parameter to override the default.
 * @returns Returns an object containing elevation information for the specified input point.
 */
export default function getElevation(
  x: number,
  y: number,
  units: "Feet" | "Meters" = "Feet",
  baseUrl: string = "https://nationalmap.gov/epqs/pqs.php"
) {
  const params = {
    x,
    y,
    units: units || "Feet",
    output: "json"
  };
  const url = `${baseUrl}?${objectToQueryString(params)}`;
  return fetch(url)
    .then(response => {
      return response.json() as Promise<UsgsElevationPointQueryServiceResult>;
    })
    .then(o => {
      return new ElevationQueryResult(o);
    });
}
