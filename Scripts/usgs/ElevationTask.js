/// <reference path="../jsapi_vsdoc_v32_2010.js" />

// Request http://gisdata.usgs.gov/XMLWebServices2/Elevation_Service.asmx/getElevation?X_Value=-122.89478301998749&Y_Value=47.00290950656123&Elevation_Units=FEET&Source_Layer=*&Elevation_Only=1


define(["dojo/Evented", "dojo/_base/declare", "dojo/query", "esri/geometry"], function (Evented, declare, query) {
	var taskClass;
	taskClass = declare([Evented], {
		serviceUrl: "http://gisdata.usgs.gov/XMLWebServices2/Elevation_Service.asmx",
		sourceLayer: null,
		constructor: function (args) {
			// Override the default service url if one was provided.
			if (!args) {
				args = {};
			}
			this.serviceUrl = args.serviceUrl || "http://gisdata.usgs.gov/XMLWebServices2/Elevation_Service.asmx";
			this.sourceLayer = args.sourceLayer || "*";
			this.elevationUnits = args.elevationUnits || "FEET";
			this.elevationOnly = args.elevationOnly || false;
		},

		getElevation: function (args) {
			var self = this, x, y, elevationUnits, sourceLayer, elevationOnly, point, url = this.serviceUrl + "/getElevation";
			if (args.point) {
				// Project the point if explicitly set to non
				if (args.point.spatialReference !== undefined && (args.point.spatialReference.wkid === 102100 || args.point.spatialReference.wkid === 3857)) {
					point = esri.geometry.webMercatorToGeographic(point);
					x = point.x;
					y = point.y;
				}
			} else if (args.x !== undefined && args.y !== undefined) {
				x = args.x;
				y = args.y;
			} else {
				throw new Error("No input point was specified.  A either a point or an x and y value must be provided.");
			}

			sourceLayer = args.sourceLayer || this.sourceLayer || "*";
			elevationUnits = args.elevationUnits || this.elevationUnits || "FEET";
			elevationOnly = args.elevationOnly || this.elevationOnly ? "TRUE" : "FALSE";

			esri.request({
				url: url,
				content: {
					X_Value: x,
					Y_Value: y,
					Elevation_Units: elevationUnits,
					Source_Layer: sourceLayer,
					Elevation_Only: elevationOnly
				},
				handleAs: "xml"
			}, null).then(function (response) {
				// Response (Elevation Only)
				/*
				<?xml version="1.0" encoding="utf-8"?>
				<double>117.498733240163</double>
				*/

				// Full response
				/*
				<?xml version="1.0" encoding="utf-8"?>
				<USGS_Elevation_Web_Service_Query>
				<Elevation_Query x="-122.894783019987" y="47.0029095065612">
				<Data_Source>NED 1/9th arc-second: Puget Sound Washington</Data_Source>
				<Data_ID>Elev_WA_PugetSound</Data_ID>
				<Elevation>117.498733240163</Elevation>
				<Units>FEET</Units>
				</Elevation_Query>
				</USGS_Elevation_Web_Service_Query>
				*/
				var output;
				// Convert response from XML to JavaScript object.
				// Response will differ depending on the value of Elevation_Only in the request.
				// First query for Elevation Only response, a single node called "double".

				output = response;

				if (response.firstChild.nodeName === "double") {
					output = Number(response.firstChild.textContent);
				} else if (response.firstChild.nodeName === "USGS_Elevation_Web_Service_Query") {
					(function (nodes) {
						var queryPoint, dataSource, elevation, units;
						queryPoint = new esri.geometry.Point(Number(nodes.attr("x")), Number(nodes.attr("y")), new esri.SpatialReference({ wkid: 4326 }));
						dataSource = nodes.query("Data_Source")[0].textContent;
						elevation = Number(nodes.query("Elevation")[0].textContent);
						units = nodes.query("Units")[0].textContent;
						output = {
							queryPoint: queryPoint,
							dataSource: dataSource,
							elevation: elevation,
							units: units
						};
					} (query("Elevation_Query", response)));
				} else {
					output = response;
				}

				self.emit("elevationReturned", output);
			}, function (error) {
				self.emit("error", error);
			});



		}
	});

	return taskClass;
});
