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

        var hhID = $("#input-id").val().trim();
        var hhPlaceData = {};

        for (let field of $("input")) {
            var fieldKey = $(field).attr("id").substring(6);
            var fieldType = $(field).attr("type");

            if (fieldKey == "id") {
                continue;
            }

            var fieldVal = $(field).val();

            if (fieldType == "checkbox") {
                fieldVal = !!($(field).prop("checked"));
            } else {
                fieldVal = fieldVal.trim();
            }

            var fieldSubObjectIndex = fieldKey.indexOf("-");

            if (fieldSubObjectIndex >= 0) {
                var fieldSubObject = fieldKey.substring(0, fieldSubObjectIndex);
                var fieldSubKey = fieldKey.substring(fieldSubObjectIndex + 1);

                if (!hhPlaceData.hasOwnProperty(fieldSubObject)) {
                    hhPlaceData[fieldSubObject] = {};
                }

                hhPlaceData[fieldSubObject][fieldSubKey] = fieldVal;
            } else {
                hhPlaceData[fieldKey] = fieldVal;
            }
        }
        console.log(JSON.stringify(hhPlaceData));
        
        database.ref("/happyHowlerData/places").child(hhID).set(hhPlaceData);
    })


    database.ref("/happyHowlerData/places").on("child_added", function (childSnapshot) {
        var hhID = childSnapshot.key;
        var hhDays = childSnapshot.val().times.days;
        var hhStart = childSnapshot.val().times.starttime;
        var hhEnd = childSnapshot.val().times.endtime;

        var hhSpecials = childSnapshot.val().specials;

        var hhBeer = childSnapshot.val().features.beer;
        var hhWine = childSnapshot.val().features.wine;
        var hhCocktails = childSnapshot.val().features.cocktails;
        var hhFood = childSnapshot.val().features.food;
        var hhDog = childSnapshot.val().features.hookah;
        var hhHookah = childSnapshot.val().features.dog;

        var hhComment = childSnapshot.val().comment;

        /////////////////////////////////////////////////
        // Add to personal data table
        var newRow = $("<tr>").attr("id", "hhrow-" + hhID);
        var hhIDDisplay = $("<td class='hhedit-id'>").text(hhID);

        var hhDaysDisplay = $("<td class='hhedit-times-days'>").text(hhDays)
        var hhStartDisplay = $("<td class='hhedit-times-starttime'>").text(hhStart);
        var hhEndDisplay = $("<td class='hhedit-times-endtime'>").text(hhEnd);

        var hhSpecialsDisplay = $("<td class='hhedit-specials'>").text(hhSpecials);

        var hhBeerDisplay = $("<td class='hhedit-features-beer'>").text(hhBeer);
        var hhWineDisplay = $("<td class='hhedit-features-wine'>").text(hhWine);
        var hhCocktailsDisplay = $("<td class='hhedit-features-cocktails'>").text(hhCocktails);
        var hhFoodDisplay = $("<td class='hhedit-features-food'>").text(hhFood);
        var hhDogDisplay = $("<td class='hhedit-features-dog'>").text(hhDog);
        var hhHookahDisplay = $("<td class='hhedit-features-hookah'>").text(hhHookah);

        var hhCommentsDisplay = $("<td class='hhedit-comment'>").text(hhComment);

        newRow.append(hhIDDisplay, hhDaysDisplay, hhStartDisplay, hhEndDisplay, hhSpecialsDisplay, hhBeerDisplay, hhWineDisplay, hhCocktailsDisplay, hhFoodDisplay, hhDogDisplay, hhHookahDisplay, hhCommentsDisplay);
        $("#hhdata").append(newRow);

        $("#hhrow-" + hhID).on("click", populateForm);

    });

    function populateForm () {
        var hhID = $(this).attr("id").substring(6);

        for (let field of $("input")) {
            var fieldKey = $(field).attr("id").substring(6);
            var fieldType = $(field).attr("type");

            if (fieldKey == "id") {
                $(field).val(hhID);
                continue;
            }

            var fieldVal = $("#hhrow-" + hhID + " > .hhedit-" + fieldKey).text();

            if (fieldType == "checkbox") {
                $(field).prop("checked", (fieldVal == "true"));
            } else {
                $(field).val(fieldVal);
            }
        }
    }
});


