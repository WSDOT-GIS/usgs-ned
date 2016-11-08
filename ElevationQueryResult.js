/*
 {
    "USGS_Elevation_Point_Query_Service": {
        "Elevation_Query": {
            "x": -122.9009843371,
            "y": 46.973556842123,
            "Data_Source": "NED 1\/3 arc-second",
            "Elevation": 200.480279,
            "Units": "Feet"
        }
    }
}
 */
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    var ElevationQueryResult = (function () {
        /**
         * @external {ArcGisFeature}
         * @see {@link http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/Feature_object/02r3000000n8000000/ Feature}
         */
        /**
         * @external {GeoJsonFeature}
         * @see {@link http://geojson.org/geojson-spec.html#feature-objects Feature Objects}
         */
        /**
         * An object that represents the results of a query to the USGS Elevation service.
         * @param {Object} json
         * @member {Number} x
         * @member {Number} y
         * @member {string} dataSource
         * @member {Number} elevation
         * @member {string} units - Measurement unit of elevation: "Feet" or "Meters".
         */
        function ElevationQueryResult(json) {
            var resultObj;
            if (!json) {
                throw new TypeError("The 'json' parameter cannot be null or undefined.");
            }
            if (json.USGS_Elevation_Point_Query_Service && json.USGS_Elevation_Point_Query_Service.Elevation_Query) {
                resultObj = json.USGS_Elevation_Point_Query_Service.Elevation_Query;
            }
            else {
                throw new TypeError("The 'json' parameter object did not have expected properties.");
            }
            this.x = resultObj.x;
            this.y = resultObj.y;
            this.dataSource = resultObj.Data_Source;
            this.elevation = resultObj.Elevation;
            this.units = resultObj.Units;
        }
        /**
         * Returns an {ArcGisFeature} equivalent of this object.
         * @returns {ArcGisFeature}
         */
        ElevationQueryResult.prototype.toArcGisFeature = function () {
            var point, feature;
            point = {
                x: this.x,
                y: this.y,
                z: this.elevation,
                spatialReference: {
                    wkid: 4326
                }
            };
            feature = {
                geometry: point,
                attributes: {
                    elevationUnits: this.units,
                    dataSource: this.dataSource
                }
            };
            return feature;
        };
        ;
        /**
         * Creates a GeoJSON feature equivalent to this object.
         * @returns {GeoJsonFeature}
         */
        ElevationQueryResult.prototype.toGeoJson = function () {
            var geometry, feature;
            geometry = {
                type: "Point",
                coordinates: [this.x, this.y, this.elevation]
            };
            feature = {
                type: "Feature",
                geometry: geometry,
                properties: {
                    elevationUnits: this.units,
                    dataSource: this.dataSource
                }
            };
            return feature;
        };
        ;
        return ElevationQueryResult;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ElevationQueryResult;
});
