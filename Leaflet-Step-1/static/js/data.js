     // All Earthquakes -> Past 30 Days
     url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"
     // All Earthquakes -> Past 7 Days
     // url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
     // All Earthquakes -> Yesterday
     // url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
     // All Earthquakes -> Past hour
     // url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson"
     
    // Date
    var options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    options.timeZone = 'UTC';

     // Import data from the url
     d3.json(url).then((data) => {
         // Store the imported data to a variable
         var QuakeData = data;
         // Create an object list with the following specifics
         var cleanData = [];
         for (var i = 0; i < QuakeData.features.length; i++) {
             var time = new Date(QuakeData.features[i].properties.time);
             cleanData.push({
                 "time": time.toLocaleTimeString("en-US", options),
                 "title": QuakeData.features[i].properties.title,
                 "url": QuakeData.features[i].properties.url,
                 "lat": QuakeData.features[i].geometry.coordinates[0],
                 "lon": QuakeData.features[i].geometry.coordinates[1],
                 "mag": QuakeData.features[i].properties.mag,
                 "depth": QuakeData.features[i].geometry.coordinates[2]
             });
         };
     
         // Return data on JSON format to mimic and API endpoint
         // console.log(JSON.stringify(cleanData, null, 2));
         var myJSON = JSON.stringify(cleanData, null, 2);
         document.getElementById("jsonData").textContent = myJSON;
     
     });