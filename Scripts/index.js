/*global require*/
/*jslint browser:true, debug: true*/
require([
	"usgs", "esri/config", "esri/map", "esri/geometry/webMercatorUtils", "esri/graphic", "esri/InfoTemplate", "dojo/Deferred"
], function (usgs, esriConfig, Map, webMercatorUtils, Graphic, InfoTemplate, Deferred) {
	"use strict";

	esriConfig.defaults.io.proxyUrl = "proxy.ashx"; // Set the proxy page. For more info see http://help.arcgis.com/en/webapi/javascript/arcgis/help/jshelp_start.htm#jshelp/ags_proxy.htm.

	var map = new Map("map", {
		basemap: "streets",
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
		usgs.getElevation(mapPoint.x, mapPoint.y).then(function (elevationQueryResult) {
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


	//usgs.getElevation(-122.894783019987, 47.0029095065612).then(function () {
	//	console.log(arguments[0]);
	//});

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