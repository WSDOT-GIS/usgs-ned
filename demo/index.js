/*global require*/
/*jslint browser:true, debug: true*/
require([
	"usgsNed", "esri/config", "esri/map", "esri/geometry/webMercatorUtils", "esri/graphic", "esri/InfoTemplate", "dojo/Deferred"
], function (usgsNed, esriConfig, Map, webMercatorUtils, Graphic, InfoTemplate, Deferred) {
	"use strict";

	var getElevation = usgsNed.default;

	// Add the USGS server to the API's list of CORS enabled servers.
	esriConfig.defaults.io.corsEnabledServers.push("ned.usgs.gov");

	var map = new Map("map", {
		basemap: "topo",
		center: [-120.80566406246835, 47.41322033015946],
		zoom: 7,
		showAttribution: true
	});

	//function createTitle(graphic) {
	//	return ["Elevation at ", graphic.x, ",", graphic.y].join();
	//}

	function createContent(graphic) {
		var deferred = new Deferred(), mapPoint;
		mapPoint = webMercatorUtils.webMercatorToGeographic(graphic.geometry);
		getElevation(mapPoint.x, mapPoint.y).then(function (elevationQueryResult) {
			var output = ["<dl>"];
			for (var propName in elevationQueryResult) {
				if (elevationQueryResult.hasOwnProperty(propName)) {
					output.push("<dt>", propName, "</dt>", "<dd>", elevationQueryResult[propName], "</dd>");
				}

			}
			output.push("</dl>");
			deferred.resolve(output.join(""));
		});

		return deferred;
	}

	var infoTemplate = new InfoTemplate("Elevation", createContent);

	/**
	 * @param {Event} e
	 * @param {esri/geometry/Point} e.mapPoint - A point in the map coordinate system (web mercator).
	 */
	map.on("click", function (e) {
		// Get the clicked map point.
		var mapPoint = e.mapPoint;
		var graphic = new Graphic(mapPoint);
		graphic.setAttributes({});
		graphic.setInfoTemplate(infoTemplate);
		//var graphic = new Graphic(mapPoint);
		//map.infoWindow.setContent(createContent(graphic));
		map.infoWindow.show(mapPoint);
		map.infoWindow.setContent("<progress>Getting Elevation from USGS...</progress>");
		try {
			// TODO: Figure out why this doesn't work.
			map.infoWindow.setFeatures([graphic]);
		} catch (err) {
			console.error("Error calling `map.infoWindow.setFeatures`...", err);
			map.infoWindow.setContent("<progress>Getting Elevation from USGS...</progress>");
			createContent(graphic).then(function (content) {
				map.infoWindow.setContent(content);
			});
		}
	});
});
