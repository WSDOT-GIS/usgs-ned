(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["exports"], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports);
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports);
        global.ElevationQueryResult = mod.exports;
    }
})(this, function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    var ElevationQueryResult = function () {
        _createClass(ElevationQueryResult, [{
            key: "outOfBounds",
            get: function get() {
                return this.elevation === -1000000;
            }
        }]);

        function ElevationQueryResult(json) {
            _classCallCheck(this, ElevationQueryResult);

            var resultObj = void 0;
            if (!json) {
                throw new TypeError("The 'json' parameter cannot be null or undefined.");
            }
            if (json.USGS_Elevation_Point_Query_Service && json.USGS_Elevation_Point_Query_Service.Elevation_Query) {
                resultObj = json.USGS_Elevation_Point_Query_Service.Elevation_Query;
            } else {
                throw new TypeError("The 'json' parameter object did not have expected properties.");
            }
            this.x = resultObj.x;
            this.y = resultObj.y;
            this.dataSource = resultObj.Data_Source;
            this.elevation = resultObj.Elevation;
            this.units = resultObj.Units;
        }

        _createClass(ElevationQueryResult, [{
            key: "toArcGisFeature",
            value: function toArcGisFeature() {
                var point = {
                    x: this.x,
                    y: this.y,
                    z: this.elevation,
                    spatialReference: {
                        wkid: 4326
                    }
                };
                var feature = {
                    geometry: point,
                    attributes: {
                        elevationUnits: this.units,
                        dataSource: this.dataSource
                    }
                };
                return feature;
            }
        }, {
            key: "toGeoJson",
            value: function toGeoJson() {
                var geometry = {
                    type: "Point",
                    coordinates: [this.x, this.y, this.elevation]
                };
                var feature = {
                    type: "Feature",
                    geometry: geometry,
                    properties: {
                        elevationUnits: this.units,
                        dataSource: this.dataSource
                    }
                };
                return feature;
            }
        }]);

        return ElevationQueryResult;
    }();

    exports.default = ElevationQueryResult;
});
