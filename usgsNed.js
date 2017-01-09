if (typeof global !== "undefined" && !global.fetch) {
  global.fetch = require("node-fetch");
}
(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["exports", "./ElevationQueryResult"], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require("./ElevationQueryResult"));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.ElevationQueryResult);
        global.usgsNed = mod.exports;
    }
})(this, function (exports, _ElevationQueryResult) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = getElevation;

    var _ElevationQueryResult2 = _interopRequireDefault(_ElevationQueryResult);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
    } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    function objectToQueryString(o) {
        var output = [],
            v = void 0;
        var name = void 0;
        for (name in o) {
            if (o.hasOwnProperty(name)) {
                v = o[name];
                if ((typeof v === "undefined" ? "undefined" : _typeof(v)) === "object") {
                    v = JSON.stringify(v);
                }
                output.push([name, v].map(encodeURIComponent).join("="));
            }
        }
        return output.join("&");
    }
    function getElevation(x, y) {
        var units = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "Feet";
        var baseUrl = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "https://nationalmap.gov/epqs/pqs.php";

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
            return new _ElevationQueryResult2.default(o);
        });
    }
    ;
});
