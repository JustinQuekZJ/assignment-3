

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


// Function to calculate distance between two points
function calculateDistance(coord1, coord2) {
    // Using Haversine formula to calculate distance
    const R = 6371e3; // Earth's radius in meters
    const φ1 = coord1[1] * Math.PI / 180; // Latitude of point 1 in radians
    const φ2 = coord2[1] * Math.PI / 180; // Latitude of point 2 in radians
    const Δφ = (coord2[1] - coord1[1]) * Math.PI / 180; // Difference in latitude in radians
    const Δλ = (coord2[0] - coord1[0]) * Math.PI / 180; // Difference in longitude in radians

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
}

// Function to find the three nearest hawker centers to a given location
function findNearestHawkerCenters(userLocation) {
    // Sort hawkerData by distance to userLocation
    hawkerData.sort((a, b) => {
        const distanceA = calculateDistance(userLocation, [a.longitude, a.latitude]);
        const distanceB = calculateDistance(userLocation, [b.longitude, b.latitude]);
        return distanceA - distanceB;
    });

    // Return the three nearest hawker centers
    return hawkerData.slice(0, 3);
}

// Function to display routes from user's location to the nearest hawker centers
function displayRoutes(nearestHawkerCenters) {
    // Loop through the nearest hawker centers and display routes
    nearestHawkerCenters.forEach(function (hawkerCenter) {
        var routeCoordinates = [
            [userLocation[0], userLocation[1]],
            [hawkerCenter.longitude, hawkerCenter.latitude]
        ];

        // Add a layer to the map with the route
        map.addLayer({
            id: 'route-' + hawkerCenter.Name,
            type: 'line',
            source: {
                type: 'geojson',
                data: {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'LineString',
                        coordinates: routeCoordinates
                    }
                }
            },
            layout: {
                'line-join': 'round',
                'line-cap': 'round'
            },
            paint: {
                'line-color': '#007bff',
                'line-width': 5
            }
        });
    });
}


// Declare userLocation variable outside the event listener
let userLocation;

// Add event listener for the geocoder result event
geocoder.on('result', function (e) {
    userLocation = e.result.geometry.coordinates; // Set the coordinates of the selected location
    const nearestHawkerCenters = findNearestHawkerCenters(userLocation); // Find the nearest hawker centers
    displayRoutes(nearestHawkerCenters); // Display routes to the nearest hawker centers
});

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





