

mapboxgl.accessToken = 'pk.eyJ1IjoianVzdGlucXVla3pqIiwiYSI6ImNsdWx1NjV2ZjE1b2oyaW9sMXA3N2VmNGQifQ.9OWRHjc8sciJAPSrhDzAmg';

// Setting map options as a variable for easier reference
var mapOptions = {
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v9',
    zoom: 10.5,
    center: [103.80775, 1.35210], // This is the coordinate of NYC
    hash: true
}

// Instantiate the map
const map = new mapboxgl.Map(mapOptions);

// Add Geocoder/search function
const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    marker: {
        color: 'orange'
    },
    mapboxgl: mapboxgl
})

map.addControl(geocoder)

// Adding navigation control
map.addControl(new mapboxgl.NavigationControl());
map.scrollZoom.disable();


hawkerData.forEach(function (hawkerRecord) {
    
    // create a popup to attach to the marker
    const popupContent = `
        <div>
            <img src="${hawkerRecord.image}" style="max-width: 100%;" />
            <p>${hawkerRecord.Name}</p>
        </div>
    `;

    // create a popup to attach to the marker
    const popup = new mapboxgl.Popup({
        offset: 24,
        anchor: 'bottom'
    }).setText(
        `${hawkerRecord.Name}`
    ).setHTML(popupContent);

    // create a marker, set the coordinates, add the popup, add it to the map
    new mapboxgl.Marker({
        scale: 0.6,
        color: `#4d65eb`, 
    })
        .setLngLat([hawkerRecord.longitude, hawkerRecord.latitude])
        .setPopup(popup)
        .addTo(map);
})
