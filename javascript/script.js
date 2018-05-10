// Grabbing and populating favorites based on map boundaries

var map;
var infowindow;
var searchwords = "happy+hour";
var bars = [];
var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
var labelIndex = 0;
var markers = [];

var austin = { lat: 30.2672, lng: -97.7431 };

google.maps.event.addDomListener(window, 'load', function () {
    var map = new google.maps.Map(document.getElementById('map-canvas'), {
        center: austin,
        zoom: 15,
        styles: [
            {
                "featureType": "landscape.natural",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "color": "#e0efef"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "hue": "#1900ff"
                    },
                    {
                        "color": "#c0e8e8"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [
                    {
                        "lightness": 100
                    },
                    {
                        "visibility": "simplified"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "transit.line",
                "elementType": "geometry",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "lightness": 700
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "all",
                "stylers": [
                    {
                        "color": "#7dcdcd"
                    }
                ]
            }
        ],
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var panelDiv = document.getElementById('panel');

    var data = new PlacesDataSource(map);

    // var view = new storeLocator.View(map, data);

    var view = new storeLocator.View(map, data, {

        features: data.getFeatures()
    })

    var markerSize = new google.maps.Size(24, 24);
    view.createMarker = function (store) {
        return new google.maps.Marker({
            position: store.getLocation(),
            /*   icon: new google.maps.MarkerImage(store.getDetails().icon, null, null,
                   null, markerSize) */
        });
    };

    //////////////////////////////////////////////////

    new storeLocator.Panel(panelDiv, {
        view: view,
        featureFilter: true
    });
});

//////////////////////////////////////////////////

/**
 * Creates a new PlacesDataSource.
 * @param {google.maps.Map} map
 * @constructor
 */
function PlacesDataSource(map) {
    this.service_ = new google.maps.places.PlacesService(map);
    this.details_cache_ = {};
}

//////////////////////////////////////////////////

// Customized and created originalGenerateFieldsHTML with a new function that creates a new and prepends another div 
storeLocator.Store.prototype.originalGenerateFieldsHTML_ = storeLocator.Store.prototype.generateFieldsHTML_;
storeLocator.Store.prototype.generateFieldsHTML_ = function (x) {

    fieldsHTML = this.originalGenerateFieldsHTML_(x);
    if (this.props_.picture) {
        fieldsHTML = '<div class="picture"><img src="' + this.props_.picture + '"></div>' + fieldsHTML;
    }
    if (this.props_.price_level) {
        fieldsHTML = fieldsHTML + '<div class="prices">' + this.props_.price_level + '</div>';
    }
    if (this.props_.times) {
        fieldsHTML = fieldsHTML + '<div class="times">' + this.props_.times + '</div>';
    }
  
if(this.props_.hours) {
    fieldsHTML = fieldsHTML + '<div class="hours">' + this.props_.hours + '</div>';
}
    if (this.props_.featureList) {
        featuresHTML = '';

        if (this.props_.featureList.beer) {
            featuresHTML += '<p><b>BEER</b></p>';
        }
        if (this.props_.featureList.wine) {
            featuresHTML += '<p><b>WINE</b></p>';
        }
        if (this.props_.featureList.food) {
            featuresHTML += '<p><b>FOOD</b></p>';
        }
        if (this.props_.featureList.hookah) {
            featuresHTML += '<p><b>HOOKAH</b></p>';
        }
        if (this.props_.featureList.dog) {
            featuresHTML += '<p><b>DOG</b></p>';
        }
        fieldsHTML = fieldsHTML + '<div class="featurelist">' + featuresHTML + '</div>';
    }
    return fieldsHTML;

}

//////////////////////////////////////////////////

PlacesDataSource.prototype.FEATURES_ = new storeLocator.FeatureSet(
    new storeLocator.Feature('Beer-YES', 'Beer'),
    new storeLocator.Feature('Wine-YES', 'Wine'),
    new storeLocator.Feature('Food-YES', 'Food'),
    new storeLocator.Feature('Hookah-YES', 'Hookah'),
    new storeLocator.Feature('Dog-YES', 'Dog')


);

PlacesDataSource.prototype.getFeatures = function () {
    return this.FEATURES_;
};
// check if features.length = 0 if not no firebase if is greater, then look it up in firebase
// firebase.database 

PlacesDataSource.prototype.getStores = function (bounds, features, callback) {
    var service = this.service_;
    var details_cache = this.details_cache_;
    console.log(features);


    var beerCall = this.FEATURES_.getById('Beer-YES');
    var wineCall = this.FEATURES_.getById('Wine-YES');
    var foodCall = this.FEATURES_.getById('Food-YES');
    var hookahCall = this.FEATURES_.getById('Hookah-YES');
    var dogCall = this.FEATURES_.getById('Dog-YES')


    service.search({
        bounds: bounds,
        type: ['restaurant'],
        keyword: searchwords

    }, function (results, search_status) {
        var stores = [];

        var callbacksRemaining = results.length;

        for (var i = 0, result; result = results[i]; i++) {
            function detailsCallback(details, details_status, snapshot) {
                if (result) {

                    if (details && details_status != 'CACHED') {
                        details_cache[result.place_id] = details;
                    }

                    var props = {
                        title: result.name,
                        address: result.vicinity,
                        types: result.types,
                        //icon: result.icon,
                        hours: result.opening_hours,
                        price_level: result.price_level

                    };
                  
                  if (result.price_level) {
            if (result.price_level == "1" || result.price_level == "0") {
                props.price = "$";
            } else if (result.price_level == "2") {
                props.price = "$$";
            } else if (result.price_level == "3") {
                props.price = "$$$";
            } else {
                props.price = "$$$$";
            }
        } else {
            props.price = "This location does not provide price level service ";
        }

                    if (details) {
                        props.phone = details.formatted_phone_number;
                    }

                    if (result.photos) {
                        props.picture = result.photos[0].getUrl({ 'maxWidth': 100, 'maxHeight': 100 });
                    }
                  
                          if (result.opening_hours) {
            console.log("1");
            if (result.opening_hours.open_now == true) {
                props.hours = "It is open now";
            } else if (result.opening_hours.open_now == false) {
                props.hours = "It is closed now";
            }
        }

                    if (snapshot.val() !== null) {
                        props.times = snapshot.val().times.starttime + " - " + snapshot.val().times.endtime;
                        props.featureList = snapshot.val().features;
                    }

                    var store = new storeLocator.Store(result.id, result.geometry.location, null, props);

                    stores.push(store);
                }

                if (--callbacksRemaining <= 0) {
                    callback(stores);
                }
            }

            function databaseCallback(snapshot) {
                if (details_cache[result.place_id]) {
                    detailsCallback(details_cache[result.place_id], 'CACHED', snapshot);
                } else {
                    var request = {
                        placeId: results[i]['place_id']
                    };
                    service.getDetails(request, function (details, details_status) {

                        detailsCallback(details, details_status, snapshot)

                    });
                }
            }
            var database = firebase.database();
            database.ref("/happyHowlerData/places").child(result.place_id).once("value", databaseCallback);



        }
    });
};
