/**
 * Created by jainu on 14/1/17.
 */

var map;
var lastmarker;

const staticcoordinates = {
    lat: 23.008055739964966,
    lng: 72.52757549285889
};

function initMap() {

    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 23.0061034, lng: 72.5294502},
        zoom: 15,
        // styles: styles,
        mapTypeControl: false
    });
    largeInfowindow = new google.maps.InfoWindow();
}

var onclicklistener;
function addMapOnClickListener() {
    onclicklistener = google.maps.event.addListener(map, 'click', function (event) {
        clearLastMarker();
        placeMarker(event.latLng);
        console.log("placing marker");
    });
}

function clearLastMarker() {
    if (lastmarker)
        lastmarker.setMap(null);
}

function placeMarker(location) {
    lastmarker = new google.maps.Marker({
        position: location,
        map: map
    });
    map.panTo(location);
}

function setCurrentLocationOnMap() {
    clearLastMarker();
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var mylocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            placeMarker(mylocation);
            console.log("successfully found my location");
        }, function () {
            handleLocationError(true);
        });
    } else {
        // Browser doesn't support Geolocation, place a marker on static coordinates

        placeMarker(staticcoordinates);
        handleLocationError(false);
    }
}

function handleLocationError(browserHasGeolocation) {
    console.log(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
}


function removeMapOnClickListener() {
    if (onclicklistener)
        onclicklistener.remove();
}

function showAllCustomers() {
    removeAllDirectionMarkers();
    for (var i = 0; i < markers.length; i++)
        markers[i].setMap(map);

    // var bounds = new google.maps.LatLngBounds();
    // // Extend the boundaries of the map for each marker and display the marker
    // for (var i = 0; i < markers.length; i++) {
    //     markers[i].setMap(map);
    //     bounds.extend(markers[i].position);
    // }
    // map.fitBounds(bounds);
}

function hideAllMarkers() {
    removeAllDirectionMarkers();
    for (var i = 0; i < markers.length; i++)
        markers[i].setMap(null);
}

function removeAllDirectionMarkers() {
    if (!directionsDisplay) return;

    for (var i = 0; i < directionMarkers.length; i++)
        directionMarkers[i].setMap(null);
    directionsDisplay.setMap(null);
    directionMarkers = [];
}

var markers = [];
var largeInfowindow;
var directionsDisplay;

function mapOneCustomer() {
    if (!oneCustomerLocation) return;

    hideAllMarkers();

    for (var i = 0; i < markers.length; i++) {
        if ((oneCustomerLocation.lat == markers[i].position.lat()) && (oneCustomerLocation.lng == markers[i].position.lng())) {
            console.log("found similar item in markers array");
            markers[i].setMap(map);
            map.panTo(oneCustomerLocation);
            return;
        }
    }
}

function addNewMarker(uniqueid, location, name, address, phonenums) {
    var marker = new google.maps.Marker({
        position: location,
        name: name,
        address: address,
        phonenums: phonenums,
        animation: google.maps.Animation.DROP,
        id: uniqueid
    });
    // Push the marker to markers array
    markers.push(marker);
    marker.setMap(map);

    // Create an onclick event to open an infowindow at each marker.
    marker.addListener('click', function () {
        populateInfoWindow(this, largeInfowindow);
    });
}

function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        // console.log(marker);
        infowindow.setContent('<div><b>Name:&nbsp</b>' + marker.name +
            '&nbsp&nbsp<input type="button" value="View Route" ' +
            'onclick="displayDirections(' + marker.getPosition().lat() + ',' + marker.getPosition().lng() + ');"/>' +
            '</div><br><div><b>Address:&nbsp</b>' + marker.address + '</div><br><div><b>Phone numbers:&nbsp</b>' + marker.phonenums + '</div>');
        infowindow.open(map, marker);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function () {
            infowindow.marker = null;
        });
    }
}

var directionMarkers = [];

function displayDirectionsbetween(origin, destination) {

    hideAllMarkers();
    var directionsService = new google.maps.DirectionsService;

    var routerequest = {
        origin: origin,
        destination: destination,
        provideRouteAlternatives: true,
        travelMode: google.maps.DirectionsTravelMode.DRIVING
    };
    directionsService.route(routerequest, function (response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsDisplay = new google.maps.DirectionsRenderer({
                map: map,
                directions: response,
                draggable: true,
                // suppressMarkers: true,  // suppress initial and end markers
                polylineOptions: {
                    strokeColor: 'green'
                }

            });
            var warnings = document.getElementById("warnings_panel");
            warnings.innerHTML = "" + response.routes[0].warnings + "";
            directionsDisplay.setDirections(response);
            showSteps(response);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}

function displayDirections(destLat, destLng) {

    var origin = null;
    var destination = {
        lat: destLat,
        lng: destLng
    };
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            origin = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            displayDirectionsbetween(origin, destination);
        }, function () {
            handleLocationError(true);
        });
    } else {
        // Browser doesn't support Geolocation, hence use static coordinates as origin
        origin = staticcoordinates;
        displayDirectionsbetween(origin, destination);
        handleLocationError(false);
    }

}

function showSteps(directionResult) {
    // For each step, place a marker, and add the text to the marker's
    // info window. Also attach the marker to an array so we
    // can keep track of it and remove it when calculating new
    // routes.
    var myRoute = directionResult.routes[0].legs[0];

    for (var i = 0; i < myRoute.steps.length; i++) {
        var marker = new google.maps.Marker({
            position: myRoute.steps[i].start_point,
            map: map
        });
        directionMarkers.push(marker);
        attachInstructionText(marker, myRoute.steps[i].instructions);
    }
}

function attachInstructionText(marker, text) {
    google.maps.event.addListener(marker, 'click', function () {
        largeInfowindow.setContent(text);
        largeInfowindow.open(map, marker);
    });
}


function showPathBetweenTwoCustomers() {
    if (!startCustomerLocation || !endCustomerLocation) return;
    displayDirectionsbetween(startCustomerLocation, endCustomerLocation);
}