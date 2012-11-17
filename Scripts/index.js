/*global require, esri*/
/*jslint browser:true, debug: true*/
require(["usgs", "dojo/on", "dojo/query", "dojo/NodeList-manipulate", "esri"], function (usgs, on, query) {
	"use strict";
	esri.config.defaults.io.proxyUrl = "proxy.ashx"; // Set the proxy page. For more info see http://help.arcgis.com/en/webapi/javascript/arcgis/help/jshelp_start.htm#jshelp/ags_proxy.htm.
	esri.config.defaults.io.timeout = 5000;

	// Create the elevation task;
	var elevationTask = new usgs.ElevationTask({
		elevationOnly: false //true
	});

	on(elevationTask, "elevationReturned", function (response) { //elevation, units, dataSource, dataSource, queryPoint
		query("#progress").remove();
		if (typeof (response) === "number") {
			query("body").append(["<p>Elevation = ", response, "</p>"].join(""));
		} else {
			(function () {
				var list = query("body").append("<dl>");
				list.append("<dt>Elevation</dt>").append(["<dd>", response.elevation, " ", response.units, "</dd>"].join(""));
				list.append("<dt>Data Source</dt>").append(["<dd>", response.dataSource, "</dd>"].join(""));
				list.append("<dt>Data ID</dt>").append(["<dd>", response.dataId, "</dd>"].join(""));
				list.append("<dt>Query Point</dt>").append(["<dd>", response.queryPoint.x, ",", response.queryPoint.y].join(""));
			} ());
		}
	});
	on(elevationTask, "error", function (error) {
		query("#progress").remove();
		query("body").append("<p>An error occured: " + error.message + "</p>");
		if (window.console) {
			if (window.console.error) {
				window.console.error(error);
			}
		}
	});

	elevationTask.getElevation({
		x: -122.894783019987,
		y: 47.0029095065612
	});
});