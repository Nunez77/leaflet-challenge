    // Data
     var options = { year: 'numeric', month: 'numeric', day: 'numeric' };
     options.timeZone = 'UTC';
     
    // All Earthquakes -> Past 30 Days
    url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"
    // All Earthquakes -> Past 7 Days
    // url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
    // All Earthquakes -> Yesterday
    // url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
    // All Earthquakes -> Past hour
    // url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson"
     
    // Grab data from the jason file and store it in a variable
     d3.json(url).then((data) => {
         var QuakesData = data;
         // Print the data
         console.log(QuakesData);
         // Print object keys
         console.log(Object.keys(QuakesData));
         // Graba datadate
         var dataDate = new Date(QuakesData.metadata.generated);
         console.log(`Data retrieved at: ${dataDate}`);
        // Number of records
         console.log(`Number of records: ${QuakesData.metadata.count}`);
         // Magnitudes
         console.log(QuakesData.features[0].properties.mag);
         // Times
         console.log(new Date(QuakesData.features[0].properties.time));
         // Latitudet
         console.log(QuakesData.features[0].geometry.coordinates[0]);
         // Longitude
         console.log(QuakesData.features[0].geometry.coordinates[1]);
         // Depths
         console.log(QuakesData.features[0].geometry.coordinates[2]);
     
         // Create a object list with the chosen data
         var cleanData = [];
         for (var i = 0; i < QuakesData.features.length; i++) {
             var time = new Date(QuakesData.features[i].properties.time);
             cleanData.push({
                 "time": time.toLocaleTimeString("en-US", options),
                 "title": QuakesData.features[i].properties.title,
                 "url": QuakesData.features[i].properties.url,
                 "lat": QuakesData.features[i].geometry.coordinates[0],
                 "lon": QuakesData.features[i].geometry.coordinates[1],
                 "mag": QuakesData.features[i].properties.mag,
                 "depth": QuakesData.features[i].geometry.coordinates[2]
             });
         };
     
         console.log(cleanData);
     
         var index = 0;
         
         // Insert a table
         d3.select("table")
             .selectAll("tr")
             .data(cleanData)
             .enter()
             .append("tr")
             .html(function (d) {
                 return `<td>${index += 1}</td>
                 <td>${d["time"]}</td>
                 <td><a href="${d["url"]}" target="_blank">${d["title"]}</a></td>
                 <td>${Math.round(d["mag"] * 100) / 100}</td>
                 <td>${Math.round(d["lat"] * 100) / 100}</td>
                 <td>${Math.round(d["lon"] * 100) / 100}</td>
                 <td>${Math.round(d["depth"])}</td>`;
             });
     
     
     });