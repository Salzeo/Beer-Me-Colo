
var map;
var infoWindow;
var service;
var address = {};
var status;
var currentBrewery;
var citystate;
var citystateNoSpaces;
var geocoder;
var breweryDots = [];
// var queryURL = "http://beermapping.com/webservice/loccity/1e07e953394846ca559ab1d498fb5b41/" + "newyork,ny" + "&s=json";
// var geocode = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + citystate + '&key=AIzaSyCzv6_hzw87dgf9atP_8y6Xm82jfAjDUaA';

  function initMap() {
    geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(39.7538126, -104.9907165);
    var mapOptions = {
      zoom: 8,
      center: latlng
    }
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
  }

 $("#add-search-btn").on("click", function() {
  event.preventDefault();

  citystate = $("#search-input").val().trim();
  citystateNoSpaces = citystate.replace(/\s+/g, '');
  // console.log(citystateNoSpaces);


      var queryURL = "http://beermapping.com/webservice/loccity/1e07e953394846ca559ab1d498fb5b41/" + citystateNoSpaces + "&s=json";
        $.ajax({
          url: queryURL,
          method: "GET"
        })
        .done(function(response) {
          console.log(response);

          for (var i = 0; i < response.length; i++) {
            currentBrewery = response[i];
            address = {
              // name: currentBrewery.name,
              street: currentBrewery.street,
              city: currentBrewery.city,
              state: currentBrewery.state,
              zip: currentBrewery.zip,
                }
            status = currentBrewery.status;

            if (status === "Brewery") { 
            // console.log(currentBrewery.name);
            // console.log(address);
            breweryDots.push(address);
            console.log(breweryDots[i]);
            // getDots();


            // var addressdots(JSON.stringify(address));    

            }       
          }
        });

  codeAddress();

   function codeAddress() {
    var location = document.getElementById('search-input').value;
    geocoder.geocode( { address: citystate}, function(results, status) {
      if (status == 'OK') {
        map.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location
        });
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }

//   infoWindow = new google.maps.InfoWindow();
//   service = new google.maps.places.PlacesService(map);

//   map.addListener('idle', performSearch);
//   } 
// }

//   function performSearch() {
//     var request = {
//       bounds: map.getBounds(),
//       keyword: 'brewery'
//     };
//     service.radarSearch(request, callback);
//   }

//   function callback(results, status) {
//     if (status !== google.maps.places.PlacesServiceStatus.OK) {
//       console.error(status);
//       return;
//     }
//     for (var i = 0, result; result = results[i]; i++) {
//     addMarker(result);
//   }
// }

// function addMarker(place) {
//   var marker = new google.maps.Marker({
//     map: map,
//     position: place.geometry.location,
//     icon: {
//       url: 'https://developers.google.com/maps/documentation/javascript/images/circle.png',
//       anchor: new google.maps.Point(10, 10),
//       scaledSize: new google.maps.Size(10, 17)
//     }
//   });

//   google.maps.event.addListener(marker, 'click', function() {
//     service.getDetails(place, function(result, status) {
//       if (status !== google.maps.places.PlacesServiceStatus.OK) {
//         console.error(status);
//         return;
//       }
//       infoWindow.setContent(result.name);
//       infoWindow.open(map, marker);
//     });
//   });
// }

});



