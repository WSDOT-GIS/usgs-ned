import ElevationQueryResult from "./ElevationQueryResult";

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
 * @param {number} x
 * @param {number} y
 * @param {string} [units='Feet']
 * @returns {Promise<ElevationQueryResult>}
 */
export function getElevation(x: number, y: number, units: "Feet" | "Meters" = "Feet") {
    let baseUrl = "http://nationalmap.gov/epqs/pqs.php";
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
