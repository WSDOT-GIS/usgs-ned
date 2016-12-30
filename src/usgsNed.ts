/**
 * Module that provides access to USGS NED Point Query service
 */

import ElevationQueryResult from "./ElevationQueryResult";
import { UsgsElevationPointQueryServiceResult } from "../UsgsNedPointQueryService";

/**
 * Converts an object into a query string
 * @returns {string}
 */
function objectToQueryString(o: any) {
    let output: any[] = [], v: any;
    let name: string;
    for (name in o) {
        if (o.hasOwnProperty(name)) {
            v = o[name];
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
export default function getElevation(x: number, y: number, units: "Feet" | "Meters" = "Feet", baseUrl: string = "https://nationalmap.gov/epqs/pqs.php") {
    let params = {
        x: x,
        y: y,
        units: units || "Feet",
        output: "json"
    };
    let url = `${baseUrl}?${objectToQueryString(params)}`;
    return fetch(url).then(response => {
        return response.json() as Promise<UsgsElevationPointQueryServiceResult>;
    }).then(o => {
        return new ElevationQueryResult(o);
    });

};
