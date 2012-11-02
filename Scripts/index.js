require(["Usgs/ElevationTask", "dojo/on"], function (ElevationTask, on) {
	esri.config.defaults.io.proxyUrl = "proxy.ashx";

	// Create the elevation task;
	var elevationTask = new ElevationTask();

	on(elevationTask, "elevationReturned", function (response) { //elevation, units, dataSource, dataSource, queryPoint
		console.log(response);
	});
	on(elevationTask, "error", function (error) {
		console.error("An error occurred", error);
	});

	elevationTask.getElevation({
		x: -122.894783019987,
		y: 47.0029095065612
	});
});