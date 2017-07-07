
var map;
var service;
var address = {};
var status;
var currentBrewery;
var citystate;
var citystateNoSpaces;
var geocoder;
var breweryDots = [];
var slicedBreweryDots = [];
var marker;


//Center the map over Denver
  function initMap() {
    geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(39.7538126, -104.9907165);
    var mapOptions = {
      zoom: 9,
      center: latlng,
      scrollwheel: false
    }
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
  }


  //On search, use beer mapping API to find breweries close to City and State selected
 $(document).on("click", "#add-search-btn", function() {
  event.preventDefault();

  breweryDots =[];
  slicedBreweryDots = [];

  citystate = $("#search-input").val().trim();
  citystateNoSpaces = citystate.replace(/,\s/, ',');
  
      //AJAX call to the Beer Mapping API
      var queryURL = "http://beermapping.com/webservice/loccity/1e07e953394846ca559ab1d498fb5b41/" + citystateNoSpaces + "&s=json";
        $.ajax({
          url: queryURL,
          method: "GET"
        })
        .done(function(response) {
          // console.log(response);

          //Loop through responses and return address infomration of breweries-- may just need name
          for (var i = 0; i < response.length; i++) {
            currentBrewery = response[i];

            status = currentBrewery.status;

            if (status === "Brewery") { 
            
            breweryDots.push(currentBrewery.name);

            slicedBreweryDots = breweryDots.slice(0,10);
               
            }       
          }
          findBrews();
        });


    //Call function to create pins for each of the breweries returned
    
    function findBrews() {
    for (var i = 0; i < slicedBreweryDots.length; i++) {
    makePins(slicedBreweryDots[i]);
    }
  }

    function makePins(a) {
    geocoder.geocode( { address: a}, function(results, status) {
      if (status == 'OK') {
        map.setCenter(results[0].geometry.location);
        var p = results[0].geometry.location;
        var lat = p.lat();
        var lng = p.lng();
        createMarker(a,lat,lng);
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
          }
      });
    }

    function createMarker(a, lat, lng) {
        marker = new google.maps.Marker({
        animation: google.maps.Animation.DROP,
        position: new google.maps.LatLng(lat,lng),
        map: map,
        icon: {
          url: 'img/beericon2.png',
          anchor: new google.maps.Point(10, 10),
          scaledSize: new google.maps.Size(30, 45)
          }
        });

      var infoWindow = new google.maps.InfoWindow({

      });
      google.maps.event.addListener(marker, 'click', function() {
      infoWindow.setContent(a);
      infoWindow.open(map, this);
      });

    }

});


