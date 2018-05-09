$(document).ready(function () {


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

    //////////////////////////////////////////////////

    var connectionsRef = database.ref("/connections");

    var connectedRef = database.ref(".info/connected");

    // When the client's connection state changes...
    connectedRef.on("value", function (snap) {

        // If they are connected..
        if (snap.val()) {

            // Add user to the connections list.
            var con = connectionsRef.push(true);
            // Remove user from the connection list when they disconnect.
            con.onDisconnect().remove();
        }
    });

    //////////////////////////////////////////////////
    // Initial variables
    var currentSnapshot = null;

    //////////////////////////////////////////////////
    // Buttons

    var beer = $("<button>").attr("id", "btn-beer").addClass("button btn1").html("<i class='flaticon-beer'></i>");
    var wine = $("<button>").attr("id", "btn-wine").addClass("button btn2").html("<i class='flaticon-wine-glass'></i>");
    var food = $("<button>").attr("id", "btn-food").addClass("button btn3").html("<i class='flaticon-food'></i>");
    var hookah = $("<button>").attr("id", "btn-hookah").addClass("button btn4").html("<i class='flaticon-hookah'></i>");
    var dog = $("<button>").attr("id", "btn-dog").addClass("button btn5").html("<i class='flaticon-dog'></i>");

    var buttons = $("<div>").addClass("buttons-wrap").append(beer, wine, food, hookah, dog);
    $("#hhInfo").append(buttons);

    $("#submit").on("click", function (event) {
        event.preventDefault();

        //////////////////////////////////////////////////
        // Pass through input admin form data

        var hhID = $("#place-id").val().trim();
        var hhStart = $("#place-hh-start").val().trim();
        var hhEnd = $("#place-hh-end").val().trim();
        var hhBeer = $("#input-beer").val();
        var hhWine = $("#input-wine").val();
        var hhFood = $("#input-food").val();
        var hhDog = $("#input-dog").val();
        var hhHookah = $("#input-hookah").val();
        var hhComments = $("#place-notes").val();

        //////////////////////////////////////////////////
        // Create object to hold filter data

        var hhFeatures = {};
        hhFeatures.featureData = {
            "hhPlaceID": {
                "hhTimes": {
                    "starttime": "hh:mm",
                    "endtime": "hh:mm",
                },
                "hhFilters": {
                    "beer": false,
                    "wine": false,
                    "food": false,
                    "hookah": false,
                    "dog": false,
                },
                "hhComments": "",
            }
        }

        database.ref("/happyHowlerData").push(hhFeatures.featureData);

        console.log(hhFeatures.featureData);

        /////////////////////////////////////////////////
        // Add to personal data table
        var newRow = $("<tr>");
        var hhIDDisplay = $("<td>").text(hhID);
        var hhStartDisplay = $("<td>").text(hhStart);
        var hhEndDisplay = $("<td>").text(hhEnd);
        var hhBeerDisplay = $("<td>").text(hhBeer);
        var hhWineDisplay = $("<td>").text(hhWine);
        var hhFoodDisplay = $("<td>").text(hhFood);
        var hhDogDisplay = $("<td>").text(hhDog);
        var hhHookahDisplay = $("<td>").text(hhHookah);
        var hhCommentsDisplay = $("<td>").text(hhComments);

        newRow.append(hhIDDisplay, hhStartDisplay, hhEndDisplay, hhBeerDisplay, hhWineDisplay, hhFoodDisplay, hhDogDisplay, hhHookahDisplay, hhCommentsDisplay);
        $("#hhdata").append(newRow);

    })


    database.ref("/happyHowlerData").on("child_added", function(childSnapshot) {
        var hhID = childSnapshot.val().hhPlaceID;
        var hhStart = childSnapshot.val().starttime;
        var hhEnd = childSnapshot.val().endtime;
        var hhBeer = childSnapshot.val().beer;
        var hhWine = childSnapshot.val().wine;
        var hhFood = childSnapshot.val().food;
        var hhDog = childSnapshot.val().hookah;
        var hhHookah = childSnapshot.val().dog;
        var hhComments = childSnapshot.val().hhComments;

    })


});


