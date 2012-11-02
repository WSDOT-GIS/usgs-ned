USGS Elevation Task for [ArcGIS JavaScript API]
===============================================

Provides a task object for calling the [USGS Elevation web service].

## Prerequisites ##
* [ArcGIS JavaScript API]

[ArcGIS JavaScript API]: http://links.esri.com/javascript
[USGS Elevation web service]: http://seamless.usgs.gov/service_description_elevation.php

## Use ##

The code sample below demonstrates how to use the usgs/ElevationTask.

```javascript
// Scripts/index.js
require(["Usgs/ElevationTask", "dojo/on", "esri/geometry"], function (ElevationTask, on) {
	esri.config.defaults.io.proxyUrl = "proxy.ashx";

	// Create the elevation task;
	var elevationTask = new ElevationTask();

	// Attach event handlers...
	on(elevationTask, "elevationReturned", function (response) {
		// Do something with the response...
		console.log(response);
	});
	on(elevationTask, "error", function (error) {
		// Do something with the error...
		console.error("An error occurred", error);
	});

	// Start the query...
	elevationTask.getElevation({
		x: -122.894783019987,
		y: 47.0029095065612
	});
});
```


```html
<html>
	<head>
		<title>USGS Elevation</title>
		<link rel="stylesheet" href="http://serverapi.arcgisonline.com/jsapi/arcgis/3.2/js/esri/css/esri.css" />
		<script>
			var dojoConfig = {
				packages: [
					{ 
						name: "Usgs", 
						location: location.pathname.replace(/\/[^\/]+$/, "") + "/Scripts/usgs" 
					}
				]
			};
		</script>
		<script src="http://serverapi.arcgisonline.com/jsapi/arcgis/?v=3.2compact"></script>
		<script src="Scripts/index.js"></script>
	</head>
	<body>
	</body>
</html>
```

## License ##
Copyright (c) 2012 Washington State Department of Transportation

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.