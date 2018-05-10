import Deferred = require("dojo/Deferred");
import esriConfig = require("esri/config");
import Popup = require("esri/dijit/Popup");
import Point = require("esri/geometry/Point");
import webMercatorUtils = require("esri/geometry/webMercatorUtils");
import Graphic = require("esri/graphic");
import InfoTemplate = require("esri/InfoTemplate");
import EsriMap = require("esri/map");
import { getElevation } from "usgs-ned";

// Add the USGS server to the API's list of CORS enabled servers.
esriConfig.defaults.io.corsEnabledServers.push("ned.usgs.gov");

const map = new EsriMap("map", {
  basemap: "topo-vector",
  center: [-120.80566406246835, 47.41322033015946],
  zoom: 7,
  showAttribution: true
});

// function createTitle(graphic) {
// 	return ["Elevation at ", graphic.x, ",", graphic.y].join();
// }

async function createContent(graphic: Graphic) {
  const { x, y } = webMercatorUtils.webMercatorToGeographic(
    graphic.geometry
  ) as Point;
  const elevationQueryResult = await getElevation(x, y);
  const dl = document.createElement("dl");

  for (const propName in elevationQueryResult) {
    if (elevationQueryResult.hasOwnProperty(propName)) {
      const value = (elevationQueryResult as any)[propName];
      const dt = document.createElement("dt");
      dt.textContent = propName;
      const dd = document.createElement("dd");
      dd.textContent = value;
      dl.appendChild(dt);
      dl.appendChild(dd);
    }
  }

  return dl.outerHTML;
}

const infoTemplate = new InfoTemplate("Elevation", createContent);

/**
 * @param {Event} e
 * @param {esri/geometry/Point} e.mapPoint - A point in the map coordinate system (web mercator).
 */
map.on("click", e => {
  // Get the clicked map point.
  const { mapPoint } = e;
  const graphic = new Graphic(mapPoint, undefined, undefined, infoTemplate);

  const { x, y } = webMercatorUtils.webMercatorToGeographic(
    e.mapPoint
  ) as Point;

  const infoWindow = map.infoWindow as Popup;
  infoWindow.show(mapPoint);
  infoWindow.setContent("<progress>Getting Elevation from USGS...</progress>");
  try {
    // TODO: Figure out why this doesn't work.
    infoWindow.setFeatures([graphic], {});
  } catch (err) {
    console.error("Error calling `map.infoWindow.setFeatures`...", err);
    infoWindow.setContent(
      "<progress>Getting Elevation from USGS...</progress>"
    );
    createContent(graphic).then(content => {
      infoWindow.setContent(content);
    });
  }
});
