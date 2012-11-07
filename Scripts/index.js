/*global require, esri*/
/*jslint browser:true, debug: true*/
require(["usgs", "dojo/on", "dojo/query", "dojo/NodeList-manipulate", "esri"], function (usgs, on, query) {
	"use strict";
	esri.config.defaults.io.proxyUrl = "proxy.ashx";
	esri.config.defaults.io.timeout = 5000;

	// Create the elevation task;
	var elevationTask = new usgs.ElevationTask();

	on(elevationTask, "elevationReturned", function (response) { //elevation, units, dataSource, dataSource, queryPoint
		query("#progress").remove();
		if (typeof (response) === "number") {
			query("body").append("<p>Elevation = " + response.elevation + " " + response.units + ".</p>");
		} else {
			query("body").append("<p>Elevation = " + response.elevation + " " + response.units + ".</p>");
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