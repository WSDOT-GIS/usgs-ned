import ElevationQueryResult from "./ElevationQueryResult";

let fetch = typeof window === "undefined" ? require("node-fetch") : window.fetch;

/**
 * @typedef NedElevationInfo
 * @property {number} x
 * @property {number} y
 * @property {string} Data_Source
 * @property {number} Elevation
 * @property {string} Units - 'Feet' or 'Meters'
 */

/**
 * Converts an object into a query string
 * @returns {string}
 */
function objectToQueryString(o: Object) {
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
 * @param {number} x
 * @param {number} y
 * @param {string} [units='Feet']
 * @returns {Promise<ElevationQueryResult>}
 */
export function getElevation(x: number, y: number, units: "Feet" | "Meters" = "Feet"): Promise<ElevationQueryResult> {
    let baseUrl = "http://nationalmap.gov/epqs/pqs.php";
    let params = {
        x: x,
        y: y,
        units: units || "Feet",
        output: "json"
    };
    let url = `${baseUrl}?${objectToQueryString(params)}`;
    return fetch(url).then(function (response) {
        return response.json();
    }).then(function (o: UsgsElevationPointQueryServiceResult) {
        return new ElevationQueryResult(o);
    });

};
