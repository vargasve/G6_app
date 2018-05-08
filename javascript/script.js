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


  /**
     * Function called when clicking the Login/Logout button.
     */
    // [START buttoncallback]
    function toggleSignIn() {
        if (!firebase.auth().currentUser) {
          // [START createprovider]
          var provider = new firebase.auth.GoogleAuthProvider();
          // [END createprovider]
          // [START addscopes]
          provider.addScope('https://www.googleapis.com/auth/plus.login');
          // [END addscopes]
          // [START signin]
          firebase.auth().signInWithRedirect(provider);
          // [END signin]
        } else {
          // [START signout]
          firebase.auth().signOut();
          // [END signout]
        }
        // [START_EXCLUDE]
        document.getElementById('quickstart-sign-in').disabled = true;
        // [END_EXCLUDE]
      }
      // [END buttoncallback]
  
  
      /**
       * initApp handles setting up UI event listeners and registering Firebase auth listeners:
       *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
       *    out, and that is where we update the UI.
       *  - firebase.auth().getRedirectResult(): This promise completes when the user gets back from
       *    the auth redirect flow. It is where you can get the OAuth access token from the IDP.
       */
      function initApp() {
        // Result from Redirect auth flow.
        // [START getidptoken]
        firebase.auth().getRedirectResult().then(function(result) {
          if (result.credential) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // [START_EXCLUDE]
            document.getElementById('quickstart-account-details').textContent = token.displayName;
          } else {
            document.getElementById('quickstart-account-details').textContent = 'null';
            // [END_EXCLUDE]
          }
          // The signed-in user info.
          var user = result.user;
        }).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // The email of the user's account used.
          var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential;
          // [START_EXCLUDE]
          if (errorCode === 'auth/account-exists-with-different-credential') {
            alert('You have already signed up with a different auth provider for that email.');
            // If you are using multiple auth providers on your app you should handle linking
            // the user's accounts here.
            console.error(error);
          }
          // [END_EXCLUDE]
        });
        // [END getidptoken]
  
        // Listening for auth state changes.
        // [START authstatelistener]
        firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            // User is signed in.
            var displayName = user.displayName;
            var email = user.email;
            var emailVerified = user.emailVerified;
            var photoURL = user.photoURL;
            var isAnonymous = user.isAnonymous;
            var uid = user.uid;
            var providerData = user.providerData;
            // [START_EXCLUDE]
            document.getElementById('quickstart-sign-in-status').textContent = 'Signed in';
            document.getElementById('quickstart-sign-in').textContent = 'Sign out';
            // document.getElementById('quickstart-account-details').textContent = JSON.stringify(user, null, '  ');
            document.getElementById('quickstart-account-details').textContent = displayName;

            // [END_EXCLUDE]
          } else {
            // User is signed out.
            // [START_EXCLUDE]
            document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
            document.getElementById('quickstart-sign-in').textContent = 'Sign in with Google';
            document.getElementById('quickstart-account-details').textContent = 'null';
            // document.getElementById('quickstart-oauthtoken').textContent = 'null';
            // [END_EXCLUDE]
          }
          // [START_EXCLUDE]
          document.getElementById('quickstart-sign-in').disabled = false;
          // [END_EXCLUDE]
        });
        // [END authstatelistener]
  
        document.getElementById('quickstart-sign-in').addEventListener('click', toggleSignIn, false);
      }
  
      window.onload = function() {
        initApp();
      };