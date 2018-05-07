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
  var leftButton; 

    //when user click left option button for beer, wine, or food. 
     leftButton = $(this).attr("data-value");


     var map;

     google.maps.event.addDomListener(window, "load", function () {


        //creating the map
    var map = new google.maps.Map(document.getElementById("map_div"),{

        center: new google.maps.LatLng(30.2672, -97.7431),
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });


  /*
   * create infowindow (which will be used by markers)
   */
  var infoWindow = new google.maps.InfoWindow();
var placeId ="ChIJv1GZ8HHMRIYRwYLWJiQySY0";
  /*
   * marker creater function (acts as a closure for html parameter)
   */
  function creatPinPoint(options, html) {
    var pin = new google.maps.Marker(options);
    if (html) {
      google.maps.event.addListener(pin, "click", function () {
        infoWindow.setContent(html);
        infoWindow.open(options.map, this);
      });
    }
    return pin;
  }


  var marker0 = creatPinPoint({
    position: new google.maps.LatLng(33.808678, -117.918921),
    map: map,
    icon: "http://1.bp.blogspot.com/_GZzKwf6g1o8/S6xwK6CSghI/AAAAAAAAA98/_iA3r4Ehclk/s1600/marker-green.png"
  }, "<h1>Austin Capital</h1><p>This is the home marker.</p>");

  var marker1 = creatPinPoint({
    position: new google.maps.LatLng(30.2674,  97.7395),
    map: map
  }, "<h1>pin 1</h1><p> Iron Cactus</p>");




  

});




    