import {
  ElevationQueryInterface,
  UsgsElevationPointQueryServiceResult
} from "./usgsNed";

/**
 * The results of a query to the elevation service
 */
export default class ElevationQueryResult {
  public x: number;
  public y: number;
  public dataSource: string;
  public elevation: number;
  /**
   * Measurement unit of elevation: "Feet" or "Meters".
   */
  public units: "Feet" | "Meters";
  get outOfBounds() {
    return this.elevation === -1000000;
  }
  /**
   * An object that represents the results of a query to the USGS Elevation service.
   * @throws {TypeError} Throw in the input parameter is either not in the correct format or is null or undefined.
   */
  constructor(json: UsgsElevationPointQueryServiceResult) {
    let resultObj: ElevationQueryInterface;
    if (!json) {
      throw new TypeError("The 'json' parameter cannot be null or undefined.");
    }
    if (
      json.USGS_Elevation_Point_Query_Service &&
      json.USGS_Elevation_Point_Query_Service.Elevation_Query
    ) {
      resultObj = json.USGS_Elevation_Point_Query_Service.Elevation_Query;
    } else {
      throw new TypeError(
        "The 'json' parameter object did not have expected properties."
      );
    }
    this.x = resultObj.x;
    this.y = resultObj.y;
    this.dataSource = resultObj.Data_Source;
    this.elevation = resultObj.Elevation;
    this.units = resultObj.Units;
  }

  /**
   * Returns an ArcGIS feature equivalent of this object.
   */
  public toArcGisFeature() {
    const point = {
      x: this.x,
      y: this.y,
      z: this.elevation,
      spatialReference: {
        wkid: 4326
      }
    };
    const feature = {
      geometry: point,
      attributes: {
        elevationUnits: this.units,
        dataSource: this.dataSource
      }
    };

    return feature;
  }

  /**
   * Creates a GeoJSON feature equivalent to this object.
   */
  public toGeoJson() {
    const geometry: GeoJSON.Point = {
      type: "Point",
      coordinates: [this.x, this.y, this.elevation]
    };
    const feature: GeoJSON.Feature<GeoJSON.Point> = {
      type: "Feature",
      geometry,
      properties: {
        elevationUnits: this.units,
        dataSource: this.dataSource
      }
    };

    return feature;
  }
}
