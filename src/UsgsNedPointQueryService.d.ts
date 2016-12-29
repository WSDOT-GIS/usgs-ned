interface ElevationQueryInterface {
    x: number;
    y: number;
    Data_Source: string;
    Elevation: number;
    Units: "Feet" | "Meters";
}

interface UsgsElevationPointQueryServiceResult {
    USGS_Elevation_Point_Query_Service: {
        Elevation_Query: ElevationQueryInterface
    };
}