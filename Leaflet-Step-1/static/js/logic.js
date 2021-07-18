// First function for each feature in the array
function addPopup(feature, layer) {
    // Popup describing the place and time of the earthquake
    return layer.bindPopup(`<h3> ${feature.properties.title} </h3> <hr> <p> ${Date(feature.properties.time)} </p>`);
}
// Date 
var options = { year: 'numeric', month: 'numeric', day: 'numeric' };
options.timeZone = 'UTC';
// Plot markers on map
function createMap(earthquakes, data) {
    // Define variables for our tile layers
    var attribution =
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    var titleUrl = 'https://{s}.title.openstreetmap.org/{z}/{x}/{y}.png';
    var OpenStreetTiles = L.tileLayer(titleUrl, { attribution });
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
        "OpenStreet": OpenStreetTiles
    };

    // Create the circles for each data point 
    var QuakeCircles = [];
    data.forEach(function (element) {

        // Your data markers should reflect the depth of the earth quake by color 
        var color = "";
        if (element.depth < 10) {
            color = "#80ff00";
        }
        else if (element.depth < 30) {
            color = "#bfff00";
        }
        else if (element.depth < 50) {
            color = "#ffff00";
        }
        else if (element.depth < 70) {
            color = "#ffbf00";
        }
        else if (element.depth < 90) {
            color = "#ff8000";
        }
        else {
            color = "#ff4000";
        }

        // Your data markers should reflect the magnitude of the earthquake by their size
        circles = L.circle([element.lon, element.lat], {
            fillOpacity: .8,
            color: "black",
            weight: 1,
            fillColor: color,
            // Adjust radius
            radius: element.mag * 20000
        }).bindPopup(`<h6 style="font-weight: bold;">${element.title}</h6> <hr> 
            <p>Date: ${element.time} (UTC)</p> 
            <p>Magnitude: ${element.mag} ml</p>
            <p>Depth: ${element.depth} km</p>
            <a href="${element.url}" target="_blank">More details...</a>`);
        QuakeCircles.push(circles);
    });

    // Now we can handle them as one group instead of referencing each individually.
    var QuakeLayer = L.layerGroup(QuakeCircles);

    // Create overlay object to hold our overlay layer	
    var overlayMaps = {
        "Earthquakes": QuakeLayer
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
        center: [39, -99],
        zoom: 5,
        fullscreenControl: true,
        layers: [OpenStreetTiles, QuakeLayer]

    });

    // Create a legend
    var myColors = ["#80ff00", "#bfff00", "#ffff00", "#ffbf00", "#ff8000", "#ff4000"];
    var legend = L.control({ position: 'bottomright' });
    legend.onAdd = function () {
        var div = L.DomUtil.create('div', 'info legend');
        labels = ["<div style='background-color: lightgray'><strong>&nbsp&nbspDepth (km)&nbsp&nbsp</strong></div>"];
        categories = ['-10-10', ' 10-30', ' 30-50', ' 50-70', ' 70-90', '+90'];
        for (var i = 0; i < categories.length; i++) {
            div.innerHTML +=
                labels.push(
                    '<li class="circle" style="background-color:' + myColors[i] + '">' + categories[i] + '</li> '
                );
        }
        div.innerHTML = '<ul style="list-style-type:none; text-align: center">' + labels.join('') + '</ul>'
        return div;
    };
    legend.addTo(myMap);

    // Add a scale to the map 
    L.control.scale()
        .addTo(myMap);

    // Add a layer control
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: true
    }).addTo(myMap);
};

// All Earthquakes -> Past 30 Days
url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"
// All Earthquakes -> Past 7 Days
// url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
// All Earthquakes -> Yesterday
// url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
// All Earthquakes -> Past hour
// url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson"

// Import data from the url, store it in a variable and print the data
d3.json(url).then((data) => {
    var EarthquakesData = data;
    console.log(EarthquakesData);
    console.log(Object.keys(EarthquakesData));  // object keys

    // Grab the date
    var dataDate = new Date(EarthquakesData.metadata.generated);
    console.log(`Data retrieved at: ${dataDate}`);

    // Number of records retrieved
    console.log(`Number of records: ${EarthquakesData.metadata.count}`);
    // Magnitudes
    console.log(EarthquakesData.features[0].properties.mag);
    // Time
    console.log(new Date(EarthquakesData.features[0].properties.time));
    // Latitude
    console.log(EarthquakesData.features[0].geometry.coordinates[0]);
    // Longitude
    console.log(EarthquakesData.features[0].geometry.coordinates[1]);
    // Depth
    console.log(EarthquakesData.features[0].geometry.coordinates[2]);


    // Create a object list with the target data columns
    var cleanData = [];
    for (var i = 0; i < EarthquakesData.features.length; i++) {
        var time = new Date(EarthquakesData.features[i].properties.time);
        cleanData.push({
            "time": time.toLocaleTimeString("en-US", options),
            "title": EarthquakesData.features[i].properties.title,
            "url": EarthquakesData.features[i].properties.url,
            "lat": EarthquakesData.features[i].geometry.coordinates[0],
            "lon": EarthquakesData.features[i].geometry.coordinates[1],
            "mag": EarthquakesData.features[i].properties.mag,
            "depth": EarthquakesData.features[i].geometry.coordinates[2]
        });
    };
    console.log(cleanData);


    // Create a geojson with the response data
    var earthquakes = L.geoJSON(data.features, {
        onEachFeature: addPopup
    });

    // Call the function to load the map and the circles
    createMap(earthquakes, cleanData);
    
});