url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

//set the center to show the united states
let center = [35.5994, -110.6731]
let zoom = 5

//create a map object
let myMap = L.map("map", {
    center: center,
    zoom: zoom
});

//add a tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

let legend = L.control({ position: 'bottomleft' });

legend.onAdd = function(map) {
    let div = L.DomUtil.create('div', 'legend');
    div.innerHTML +=
    //&lt and &gt are the less than and greater than signs formatte to have HTML read easier
        '<i style="background:"green"></i> Light &lt; 10 km<br>' +
        '<i style="background:"yellow"></i> Intermediate 10-50 km<br>' +
        '<i style="background:red"></i> Deep &gt; 50 km<br>';
    return div;
};

legend.addTo(myMap);

d3.json(url).then(function(data) {
    console.log(data.features);

    data.features.forEach(function(feature) {
        let coordinates = feature.geometry.coordinates;
        let magnitude = feature.properties.mag;
        let depth = coordinates[2];

        //calculate the size of the marker based on the magnitude
        let size = magnitude * 5;

        //calculate the color of the marker based on the depth
        let color = getColor(depth);

        //create a circle marker with size and color
        //lat = coordinates[i], long = coordinates[0]
        let circle = L.circleMarker([coordinates[1], coordinates[0]], {
            radius: size,
            fillColor: color,
            color: "black",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.5
        });

        //add a popup with earthquake details
        circle.bindPopup(`<b>Magnitude:</b> ${magnitude}<br><b>Depth:</b> ${depth} km`);

        //add the marker to the map
        circle.addTo(myMap);
    });
});

//function to determine the color based on depth
function getColor(depth) {
    if (depth < 10) {
        return "green"; //light earthquakes
    } 
    else if (depth < 50) {
        return "yellow"; //intermediate earthquakes
    } 
    else {
        return "red"; //deep earthquakes
    }
}
