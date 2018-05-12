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
    /*
        var beer = $("<button>").attr("id", "btn-beer").addClass("button btn1").html("<i class='flaticon-beer'></i>");
        var wine = $("<button>").attr("id", "btn-wine").addClass("button btn2").html("<i class='flaticon-wine-glass'></i>");
        var food = $("<button>").attr("id", "btn-food").addClass("button btn3").html("<i class='flaticon-food'></i>");
        var hookah = $("<button>").attr("id", "btn-hookah").addClass("button btn4").html("<i class='flaticon-hookah'></i>");
        var dog = $("<button>").attr("id", "btn-dog").addClass("button btn5").html("<i class='flaticon-dog'></i>");
    
        var buttons = $("<div>").addClass("buttons-wrap").append(beer, wine, food, hookah, dog);
        $("#hhInfo").append(buttons);
    */
    $("#submit").on("click", function (event) {
        event.preventDefault();

        //////////////////////////////////////////////////
        // Pass through input admin form data

        var hhID = $("#place-id").val().trim();
        var hhDays = $("#place-hh-days").val().trim();
        var hhStart = $("#place-hh-start").val().trim();
        var hhEnd = $("#place-hh-end").val().trim();
        var hhBeer = $("#input-beer").prop("checked");
        var hhWine = $("#input-wine").prop("checked");
        var hhFood = $("#input-food").prop("checked");
        var hhDog = $("#input-dog").prop("checked");
        var hhHookah = $("#input-hookah").prop("checked");
        var hhComment = $("#place-notes").val();

        //////////////////////////////////////////////////
        // Create object to hold filter data

        var hhPlaceData = {
            "comment" : hhComment,
            "features" : {
                "beer"   : !!hhBeer,
                "wine"   : !!hhWine,
                "food"   : !!hhFood,
                "hookah" : !!hhHookah,
                "dog"    : !!hhDog,
        },
            "times" : {
                "days": hhDays,
                "starttime" : hhStart,
                "endtime"   : hhEnd,
            },
        };

        database.ref("/happyHowlerData/places").child(hhID).set(hhPlaceData);
    })


    database.ref("/happyHowlerData/places").on("child_added", function (childSnapshot) {
        var hhID = childSnapshot.key;
        var hhDays = childSnapsnot.val().times.days;
        var hhStart = childSnapshot.val().times.starttime;
        var hhEnd = childSnapshot.val().times.endtime;
        var hhBeer = childSnapshot.val().features.beer;
        var hhWine = childSnapshot.val().features.wine;
        var hhFood = childSnapshot.val().features.food;
        var hhDog = childSnapshot.val().features.hookah;
        var hhHookah = childSnapshot.val().features.dog;
        var hhComment = childSnapshot.val().comment;

        /////////////////////////////////////////////////
        // Add to personal data table
        var newRow = $("<tr>").attr("id", "hhrow-" + hhID);
        var hhIDDisplay = $("<td>").text(hhID);
        var hhDaysDisplay = $("<td>").text(hhDays)
        var hhStartDisplay = $("<td>").text(hhStart);
        var hhEndDisplay = $("<td>").text(hhEnd);
        var hhBeerDisplay = $("<td>").text(hhBeer);
        var hhWineDisplay = $("<td>").text(hhWine);
        var hhFoodDisplay = $("<td>").text(hhFood);
        var hhDogDisplay = $("<td>").text(hhDog);
        var hhHookahDisplay = $("<td>").text(hhHookah);
        var hhCommentsDisplay = $("<td>").text(hhComment);

        newRow.append(hhIDDisplay, hhDaysDisplay, hhStartDisplay, hhEndDisplay, hhBeerDisplay, hhWineDisplay, hhFoodDisplay, hhDogDisplay, hhHookahDisplay, hhCommentsDisplay);
        $("#hhdata").append(newRow);

    });
});


