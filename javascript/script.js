var config = {
    apiKey: "AIzaSyAx2wPUKX8AG232jWrO8DPSzavhcEAm2eM",
    authDomain: "happyhowler-58dad.firebaseapp.com",
    databaseURL: "https://happyhowler-58dad.firebaseio.com",
    projectId: "happyhowler-58dad",
    storageBucket: "happyhowler-58dad.appspot.com",
    messagingSenderId: "30830594769"
  };
  firebase.initializeApp(config);


  var database = firebase.database();

///////////-------
  // var leftButton; 

  //   //when user click left option button for beer, wine, or food. 
  //    leftButton = $(this).attr("data-value");
///////////-------



     var map;
     var infowindow;
     var searchwords = "happy+hour"; 
     var bars = []; 


     function initMap() {
      var austin = {lat: 30.2672, lng: -97.7431};

      //creating map
      map = new google.maps.Map(document.getElementById("map_div"),{

        center: austin,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP //this one is extra 
    });

    //create infowindow (which will be used by markers)
    infowindow = new google.maps.InfoWindow();


    var populationOptions = {
      strokeColor: '#FF0000',
      strokeOpacity: 0.1,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.075,
      map: map,
      center: austin,
      radius: 7000
  };

  var service = new google.maps.places.PlacesService(map);
  service.radarSearch({
      location: austin,
      radius: 7000,
      keyword: searchwords
  }, callback);


}//closing initMap()

function callback(results, status) {
  console.log(results.length);
  console.log(results);
  if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {

          //Using setTimeout and closure because limit of 10 queries /second for getDetails */
          (function (j) {
              var request = {
                  placeId: results[i]['place_id']
              };

              service = new google.maps.places.PlacesService(map);
              setTimeout(function() {
                  service.getDetails(request, callback);
              }, j*100);


          })(i);

          function callback(place, status) {
              if (status == google.maps.places.PlacesServiceStatus.OK) {
                  createMarker(place);
                  console.log(place.name +  results.length + bars.length);
                  bars.push([place.name, place.website, place.rating]);

                  if(results.length == bars.length){
                      console.log(bars);
                      var request = new XMLHttpRequest();
                      request.open('POST', 'http://localhost/agency-map/src/save.php', true);
                      request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
                      request.send(JSON.stringify(bars));
                  }
              }
          }
      }
  }
}



function createMarker(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(place.name);
    infowindow.open(map, this);
  });
}

//TEST

  
// var placeId ="ChIJv1GZ8HHMRIYRwYLWJiQySY0";
//   /*
//    * marker creater function (acts as a closure for html parameter)
//    */
//   function creatPinPoint(options, html) {
//     var pin = new google.maps.Marker(options);
//     if (html) {
//       google.maps.event.addListener(pin, "click", function () {
//         infoWindow.setContent(html);
//         infoWindow.open(options.map, this);
//       });
//     }
//     return pin;
//   }


//   var marker0 = creatPinPoint({
//     position: new google.maps.LatLng(33.808678, -117.918921),
//     map: map,
//     icon: "http://1.bp.blogspot.com/_GZzKwf6g1o8/S6xwK6CSghI/AAAAAAAAA98/_iA3r4Ehclk/s1600/marker-green.png"
//   }, "<h1>Austin Capital</h1><p>This is the home marker.</p>");

//   var marker1 = creatPinPoint({
//     position: new google.maps.LatLng(30.2674,  97.7395),
//     map: map
//   }, "<h1>pin 1</h1><p> Iron Cactus</p>");

// Google OAuth





    