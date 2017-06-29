
var map;
var infoWindow;
var service;
var address = {};
var status;
var currentBrewery;
var city;
var state;
var geocoder;

var geocode = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + city + state + '&key=AIzaSyCzv6_hzw87dgf9atP_8y6Xm82jfAjDUaA';

//Initilize the map and center it on Denver
function initMap() {

  geocoder = new google.maps.Geocoder; 
  var latlong = new google.maps.LatLng(39.7538126, -104.9907165);
  var mapOptions = {
    zoom: 8,
    center: latlng
  }
  map = new google.maps.Map($('map')), mapOptions;
};

//On pressing search button, invoke Beer Mapping app:


      $.ajax({
          url: queryURL,
          method: "GET"
        })
        .done(function(response) {
          console.log(response);

          for (var i = 0; i < response.length; i++) {
            currentBrewery = response[i];
            address = {
              street: currentBrewery.street,
              city: currentBrewery.city,
              state: currentBrewery.state,
              zip: currentBrewery.zip,
                }
            status = currentBrewery.status;

            if (status === "Brewery") { 
            console.log(currentBrewery);
            console.log(address);    
              // $("#breweries").append(response[i].name)
              // $("#breweries").append(JSON.stringify(address));
            }       
          }
        });


//Pass in output from beer mapping API
function codeAddress() {
  var location = address.value;
  geocoder.geocode( { 'address': address }), function(results, status) { 
    if (status == 'OK') {
      map.setCenter(results[0].geometry.location);
    } else {
      alert('Google was not successful for the following reason: ' + status);
    }
  }
};
  
  infoWindow = new google.maps.InfoWindow();
  service = new google.maps.places.PlacesService(map);

  map.addListener('idle', performSearch);
  } 
}

function performSearch() {
  var request = {
    bounds: map.getBounds(),
    keyword: 'brewery'
  };
  service.radarSearch(request, callback);
}

function callback(results, status) {
  if (status !== google.maps.places.PlacesServiceStatus.OK) {
    console.error(status);
    return;
  }
  for (var i = 0, result; result = results[i]; i++) {
    addMarker(result);
  }
}

function addMarker(place) {
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
    icon: {
      url: 'https://developers.google.com/maps/documentation/javascript/images/circle.png',
      anchor: new google.maps.Point(10, 10),
      scaledSize: new google.maps.Size(10, 17)
    }
  });

  google.maps.event.addListener(marker, 'click', function() {
    service.getDetails(place, function(result, status) {
      if (status !== google.maps.places.PlacesServiceStatus.OK) {
        console.error(status);
        return;
      }
      infoWindow.setContent(result.name);
      infoWindow.open(map, marker);
    });
  });
}





function convertAddresses(beerresult) {

    $ajax({
      url: geocode,
      method: "GET"
    })
    .done(function(response) {
      console.log(response);
    });
  };






