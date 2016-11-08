(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", '../usgsNed'], factory);
    }
})(function (require, exports) {
    "use strict";
    var usgsNed_1 = require('../usgsNed');
    describe("usgsNed test", function () {
        var x = -121.74499511715358, y = 46.837649560927126;
        var units = "Feet";
        var promise = usgsNed_1.getElevation(x, y, units);
        it("should be able to get the elevation", function (done) {
            promise.then(function (result) {
                expect(result.x).toBeCloseTo(x, 1);
                expect(result.y).toBeCloseTo(y, 1);
                expect(result.elevation).toBeCloseTo(10532.22, 1);
                expect(result.units).toEqual(units);
                expect(typeof result.dataSource).toBe("string");
                done();
            }, function (error) {
                done.fail(error);
            });
        });
        it("should be able to convert result to ArcGIS", function (done) {
            promise.then(function (result) {
                var arcGisFeature = result.toArcGisFeature();
                done();
            });
        });
        it("should be able to convert result to GeoJSON feature", function (done) {
            promise.then(function (result) {
                var geoJsonFeature = result.toGeoJson();
                done();
            });
        });
    });
});
