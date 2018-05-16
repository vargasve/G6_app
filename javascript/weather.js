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
    if (currentCondition === "clear-day" ){
      console.log("working")
      currentCondition = "<span>It's a balmy </span><img src='./images/weatherIcons/Sun.svg'>"

    }
    else if (currentCondition === "clear-night") {
      currentCondition = "<span>Late-night drinks? </span><img src='./images/weatherIcons/Moon.svg'>"
    }
 
    else if (currentCondition === "rain") {
      currentCondition = "<span>Rain won't ruin my plans: </span><img src='./images/weatherIcons/Cloud-Rain.svg'>"
    }
    else if (currentCondition === "snow") {
      currentCondition = "<img src='./images/weatherIcons/Cloud-Snow.svg'>"
    }
    else if (currentCondition === "sleet") {
      currentCondition = "<img src='./images/weatherIcons/Cloud-Hail.svg'>"
    }
    else if (currentCondition === "wind") {
      currentCondition = "<img src='./images/weatherIcons/Cloud-Hail.svg'>"
    }
    else if (currentCondition === "fog") {
      currentCondition = "<img src='./images/weatherIcons/Cloud-Fog.svg'>"
    }
    else if (currentCondition === "cloudy") {
      currentCondition = "<span>It's a balmy </span><img src='./images/weatherIcons/Cloud.svg'>"
    }
    else if (currentCondition === "partly-cloudy-day") {
      currentCondition = "<span>It's a balmy </span><img src='./images/weatherIcons/Cloud-Sun.svg'>"
    }
   else if (currentCondition === "partly-cloudy-night") {
      currentCondition = "<span>Late-night drinks? </span><img src='./images/weatherIcons/Cloud-Moon.svg'>"
    }
  
    else {
      currentCondition="<img src='./images/weatherIcons/Thermometer.svg'>"
    };
    
    $("#weather").html(currentCondition + response.currently.apparentTemperature + "&#x2109;")

    

  })