/// <reference path="typings/index.d.ts" />

import ElevationQueryResult from "ElevationQueryResult";

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
function objectToQueryString(/**{Object}*/ o) {
	var output = [], v;
	for (var name in o) {
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
 * @returns {Promise<NedElevationInfo>}
 */
export function getElevation(x, y, units) {
	var baseUrl = "http://nationalmap.gov/epqs/pqs.php";
	var params = {
		x: x,
		y: y,
		units: units || "Feet",
		output: "json"
	};
	let url = `${baseUrl}?${objectToQueryString(params)}`;
	return fetch(url).then(function (response) {
		return response.json();
	}).then(function (o) {
		return new ElevationQueryResult(o);
	});

};
