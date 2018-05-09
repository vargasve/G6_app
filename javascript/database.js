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
var intervalId = undefined;
var currentSnapshot = null;

var beer;
var wine;
var food;
var hookah;
var dog;

//////////////////////////////////////////////////
// Buttons

var beer = $("<button>").attr("id", "btn-beer").addClass("button btn1").html("<i class='flaticon-beer'></i>");
var wine = $("<button>").attr("id", "btn-wine").addClass("button btn2").html("<i class='flaticon-wine-glass'></i>");
var food = $("<button>").attr("id", "btn-food").addClass("button btn3").html("<i class='flaticon-food'></i>");
var hookah = $("<button>").attr("id", "btn-hookah").addClass("button btn4").html("<i class='flaticon-hookah'></i>");
var dog = $("<button>").attr("id", "btn-dog").addClass("button btn5").html("<i class='flaticon-dog'></i>");

var buttons = $("<div>").addClass("buttons-wrap").append(beer,wine,food,hookah,dog);
$("#hhInfo").append(buttons);


//////////////////////////////////////////////////
// Create object to hold filter data

var hhFilters = {
    beer: beer,
    wine: wine,
    food: food,
    hookah: hookah,
    dog: dog,
    dateAdded: firebase.database.ServerValue.TIMESTAMP

}

database.ref("/happyHowlerData").push(hhFilters);

console.log(hhFilters);

});

// NOTE IDs are place-id, place-happyhours-start, place-happyhours-end, 
// input-beer, input-wine, input-food, input-hookah , submit 

