/// <reference path="typings/index.d.ts" />
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./ElevationQueryResult"], factory);
    }
})(function (require, exports) {
    "use strict";
    var ElevationQueryResult_1 = require("./ElevationQueryResult");
    var fetch = typeof window === "undefined" ? require("node-fetch") : window.fetch;
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
    function objectToQueryString(o) {
        var output = [], v;
        var name;
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
    function getElevation(x, y, units) {
        if (units === void 0) { units = "Feet"; }
        var baseUrl = "http://nationalmap.gov/epqs/pqs.php";
        var params = {
            x: x,
            y: y,
            units: units || "Feet",
            output: "json"
        };
        var url = baseUrl + "?" + objectToQueryString(params);
        return fetch(url).then(function (response) {
            return response.json();
        }).then(function (o) {
            return new ElevationQueryResult_1.default(o);
        });
    }
    exports.getElevation = getElevation;
    ;
});
