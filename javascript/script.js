

// URL for darksky weather api
var queryURL = "https://api.darksky.net/forecast/7962c1bbccd7a1616faad70193d8617a/30.1828,-97.72928"

// call to dark sky api 
$.ajax({
  url: queryURL,
  method: "GET"
})
  // We store all of the retrieved data inside of an object called "response"
  .then(function(response) {
    // Log the queryURL
    //console.log(queryURL);
   // console.log(response)
   // console.log(response.currently.icon)
   var currentCondition = response.currently.icon
   console.log(currentCondition)
    // Log the resulting object
    if (currentCondition ==="clear-day"){
      console.log("working")
      currentCondition = "<img src='./images/climacons-master/SVG/Sun.svg'>"

    }
 

    
    
  

    $("#weather").html(currentCondition + response.currently.apparentTemperature + "&#x2109;")

  })

  