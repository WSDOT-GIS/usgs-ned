/// <reference types="jasmine" />
/// <reference types="node" />


import getElevation from "../usgsNed";
import ElevationQueryResult from "../ElevationQueryResult";

describe("usgsNed test", () => {
    const x = -121.74499511715358, y = 46.837649560927126;
    const units: "Feet" | "Meters" = "Feet";
    let promise: Promise<ElevationQueryResult>;

    const expectedResult = {
        USGS_Elevation_Point_Query_Service: {
            Elevation_Query: {
                x: x,
                y: y,
                Units: units,
                Data_Source: "A datasource would go here",
                Elevation: 10532.22
            }
        }
    };

    it("should be able to get the elevation", (done) => {
        // Create a fake response to simulate network request & response.
        // This allows the test to succeed even if the nationalmap.gov
        // site is offline.

        // Determine what the global object is in order to spy on it.
        const root = typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : null;

        if (root !== null) {
            spyOn(root, "fetch").and.callFake((input: string, init?: any) => {
                return new Promise((resolve, reject) => {
                    const json = JSON.stringify(expectedResult);

                    // The Response class is accessed differently when accessed from node-fetch than in browser.
                    // let rs = typeof Response === "undefined" ? (fetch as any).Response as Response : Response;
                    let response: Response;
                    if (typeof Response !== "undefined") {
                        response = new Response(json, {
                            status: 200,
                            statusText: "OK"
                        });
                    } else {
                        response = new (fetch as any).Response(json, {
                            status: 200,
                            statusText: "OK"
                        });
                    }
                    resolve(response);
                });
            });
        }
        promise = getElevation(x, y, units);
        promise.then(result => {
            expect(result.x).toBeCloseTo(x, 1);
            expect(result.y).toBeCloseTo(y, 1);
            expect(result.elevation).toBeCloseTo(10532.22, 1);
            expect(result.units).toEqual(units);
            expect(typeof result.dataSource).toBe("string");
            done();
        }, error => {
            done.fail(error);
        });
    });

    it("should be able to convert result to ArcGIS", (done) => {
        promise.then(result => {
            let arcGisFeature = result.toArcGisFeature();
            expect(arcGisFeature.geometry.x).not.toBeFalsy();
            expect(arcGisFeature.geometry.y).not.toBeFalsy();
            expect(arcGisFeature.attributes.elevationUnits).not.toBeFalsy();
            expect(arcGisFeature.attributes.dataSource).not.toBeFalsy();
            done();
        });
        promise.catch(error => {
            done.fail(error);
        });
    });

    it("should be able to convert result to GeoJSON feature", (done) => {
        promise.then(result => {
            let geoJsonFeature = result.toGeoJson();
            expect(Array.isArray(geoJsonFeature.geometry.coordinates)).toEqual(true);
            done();
        });
        promise.catch(error => {
            done.fail(error);
        });
    });
});