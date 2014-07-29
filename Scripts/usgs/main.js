/*global define*/
define(["esri/request", "dojo/Deferred", "./ElevationQueryResult"], function (esriRequest, Deferred, ElevationQueryResult) {
	"use strict";

	/**
	 * Queries the USGS Elevation service.
	 * @param {number} x - WGS84 X coordinate
	 * @param {number} y - WGS84 Y coordinate
	 * @param {string} [units="Feet"] - Valid values are "Feet" and "Meters". Any value other than "Meters" (case-sensitive) will indicate "Feet".
	 * @param {string} [url="http://ned.usgs.gov/epqs/pqs.php"]
	 * @returns {dojo/Deferred}
	 */
	function getElevation(x, y, units, url) {
		var deferred = new Deferred();
		if (units !== "Meters") {
			units = "Feet";
		}

		// Ensure input parameters are numbers.
		if (typeof x === "string") {
			x = Number(x);
		}
		if (typeof y === "string") {
			y = Number(y);
		}

		esriRequest({
			url: url || "http://ned.usgs.gov/epqs/pqs.php",
			content: {
				x: x,
				y: y,
				units: units,
				output: "json"
			},
			handleAs: "json"
		}).then(function (result) {
			var output = new ElevationQueryResult(result);
			deferred.resolve(output);
		}, function (error) {
			deferred.reject(error);
		});

		return deferred;
	}

	return {
		getElevation: getElevation
	};
});