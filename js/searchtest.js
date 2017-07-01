
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
var slicedBreweryDots = [];
var addressdots;


//Center the map over Denver
  function initMap() {
    geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(39.7538126, -104.9907165);
    var mapOptions = {
      zoom: 8,
      center: latlng
    }
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
  }


  //On search, use beer mapping API to find breweries close to City and State selected
 $(document).on("click", "#add-search-btn", function() {
  event.preventDefault();

  citystate = $("#search-input").val().trim();
  citystateNoSpaces = citystate.replace(/\s+/g, '');
  
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
            // address = {
            //   // name: currentBrewery.name,
            //   street: currentBrewery.street,
            //   city: currentBrewery.city,
            //   state: currentBrewery.state,
            //   zip: currentBrewery.zip,
            //     }
            status = currentBrewery.status;

            if (status === "Brewery") { 
            // console.log(address);
            
            breweryDots.push(currentBrewery.name);

            slicedBreweryDots = breweryDots.slice(0,9);
            console.log(slicedBreweryDots);
            
            // console.log(breweryDots);
               
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
        var marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location
        });
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
          }
      });
    }

});

  



