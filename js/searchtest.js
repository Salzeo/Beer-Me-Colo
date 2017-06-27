
var map;
var infoWindow;
var service;
var address = {};
var status;
var currentBrewery;
var city;
var state;
var queryURL = "http://beermapping.com/webservice/loccity/1e07e953394846ca559ab1d498fb5b41/" + "denver,co" + "&s=json";
var geocode = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + city + state + '&key=AIzaSyCzv6_hzw87dgf9atP_8y6Xm82jfAjDUaA';



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
              // $("#breweries").append(response[i].name)
              // $("#breweries").append(JSON.stringify(address));
            }       
          }
        });


function convertAddresses(beerresult) {

    $ajax({
      url: geocode,
      method: "GET"
    })
    .done(function(response) {
      console.log(response);



    });


}

function initMap() {


  var geocoder = new google.maps.Geocoder;
  geocoder.geocode({ address: "Chicago, IL" }, function(results, status) {
  if (status == 'OK') {
    var firstLocation = results[0];
    var lat = firstLocation.geometry.location.lat();
    var lng = firstLocation.geometry.location.lng();
    map = new google.maps.Map(document.getElementById('map'), {
    center: {lat:lat, lng:lng},
    zoom: 8,
    styles: [{
      stylers: [{ visibility: 'simplified' }]
    }, {
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    }]
  });

  infoWindow = new google.maps.InfoWindow();
  service = new google.maps.places.PlacesService(map);

  // The idle event is a debounced event, so we can query & listen without
  // throwing too many requests at the server.
  map.addListener('idle', performSearch);
    console.log(lat);
    console.log(lng);
  } else {
    alert('Geocode was not successful for the following reason: ' + status);
  }
});
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



