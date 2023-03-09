# usgs-ned

Library for use with the [The National Map - Elevation Point Query Service] of the <abbr title="United States Geological Survey">USGS</abbrev>.

> The **Elevation Point Query Service** returns the elevation in international feet or meters for a specific latitude/longitude (NAD 1983) point from the USGS Elevation Service hosted at the NGTOC. Input parameters: **x** (_longitude_), **y** (_latitude_), **units** (_Feet, Meters_), **output** (_XML, JSON_). Latitude and longitude must be specified in decimal degrees with southern latitudes and western longitudes represented as negative values.

## Notes

OpenAPI specification JSON file in this repository was extracted from a `<script>` tag on [Elevation Point Query Service documentation page](https://epqs.nationalmap.gov/v1/docs).

[The National Map - Elevation Point Query Service]:https://apps.nationalmap.gov/epqs/