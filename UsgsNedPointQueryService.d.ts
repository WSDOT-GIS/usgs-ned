export interface ElevationQueryInterface {
    x: number;
    y: number;
    Data_Source: string;
    Elevation: number;
    Units: "Feet" | "Meters";
}

/**
 * Output format as it is returned directly from the service
 */
export interface UsgsElevationPointQueryServiceResult {
    USGS_Elevation_Point_Query_Service: {
        Elevation_Query: ElevationQueryInterface
    };
}