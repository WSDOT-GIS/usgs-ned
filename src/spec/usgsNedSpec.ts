import { getElevation } from "../usgsNed";

describe("usgsNed test", () => {
    const x = -121.74499511715358, y = 46.837649560927126;
    const units: "Feet" | "Meters" = "Feet";
    let promise = getElevation(x, y, units);

    it("should be able to get the elevation", (done) => {
        promise.then((result) => {
            expect(result.x).toBeCloseTo(x, 1);
            expect(result.y).toBeCloseTo(y, 1);
            expect(result.elevation).toBeCloseTo(10532.22, 1);
            expect(result.units).toEqual(units);
            expect(typeof result.dataSource).toBe("string");
            done();
        }, (error) => {
            done.fail(error);
        });
    });

    it("should be able to convert result to ArcGIS", (done) => {
        promise.then((result) => {
            let arcGisFeature = result.toArcGisFeature();
            done();
        });
    });

    it("should be able to convert result to GeoJSON feature", (done) => {
        promise.then((result) => {
            let geoJsonFeature = result.toGeoJson();
            done();
        });
    });
});