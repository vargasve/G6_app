// Grabbing and populating favorites based on map boundaries

var searchwords = "happy+hour";
var austin = { lat: 30.2672, lng: -97.7431 };
var infoWindow;

//////////////////////////////////////////////////

function initMap() {
    var map_document = document.getElementById('map-canvas');

    var map_options = {
        zoom: 15,
        maxZoom: 16,
        disableDefaultUI: true,
        //minZoom: 12,
        center: austin,
        //gestureHandling: "none",
        //zoomControl: false,
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
        ]

    };

    var map = new google.maps.Map(map_document, map_options);

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            //infoWindow.setPosition(pos);
            //infoWindow.setContent('Location found.');
            //infoWindow.open(map);
            map.setCenter(pos);
            map.setZoom(15);
            var listener = google.maps.event.addListener(map, "idle", function () {
                if (map.getZoom() < 14) map.setZoom(16);
                google.maps.event.removeListener(listener);
            });

        }, function () {
            //handleLocationError(true, map.getCenter());
        });
    } else {
        //handleLocationError(false,map.getCenter());
    }

    initPanel(map);
}

//////////////////////////////////////////////////

function initPanel(map) {
    var panelDiv = document.getElementById('panel');

    var data = new PlacesDataSource(map);

    var view = new storeLocator.View(map, data, {
        geolocation: true,
    })

    var markerSize = new google.maps.Size(24, 24);
    view.createMarker = function (store) {
        let marker = new google.maps.Marker({
            position: store.getLocation(),
            //icon: 'images/map-marker.png',
        });

        return marker;
    };

    //////////////////////////////////////////////////

    var panel = new storeLocator.Panel(panelDiv, {
        view: view,
        //        featureFilter: true
    });

    //////////////////////////////////////////////////

    google.maps.event.addListener(view, "selectedStore_changed", function (selectedStore) {
        if (!selectedStore) {
            return;
        }
        var selectedStoreEntry = $('#store-' + selectedStore.id_);
        var storePanel = $('.panelwrap');;

        if (selectedStoreEntry && storePanel) {
            storePanel.animate({
                scrollTop: selectedStoreEntry.offset().top - storePanel.offset().top + storePanel.scrollTop()
            });
        }
    });

    //////////////////////////////////////////////////

    function refreshMarkers() {
        view.clearMarkers();
        view.refreshView();
        panel.setView(view);
    }
    $("#beer-check").on("click", refreshMarkers);
    $("#wine-check").on("click", refreshMarkers);
    $("#cocktails-check").on("click", refreshMarkers);
    $("#food-check").on("click", refreshMarkers);
    $("#hookah-check").on("click", refreshMarkers);
    $("#dog-check").on("click", refreshMarkers);
    $("#fav-check").on("click", refreshMarkers);


    $(".filter-icons > input").on("click", function () {
        $(this).toggleClass("filterOn");
    })
}


//////////////////////////////////////////////////
/*
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
}
*/
//////////////////////////////////////////////////

function PlacesDataSource(map) {
    this.service_ = new google.maps.places.PlacesService(map);
    this.details_cache_ = {};
}

//////////////////////////////////////////////////

function toggleFavorite (butt) {
    var place_id = $(butt).data('fav');
    var database = firebase.database();

    if (window.userFavorites[place_id]) {
        database.ref('/happyHowlerData/users').child(window.userUID).child('favorites').child(place_id).remove();
    } else {
        database.ref('/happyHowlerData/users').child(window.userUID).child('favorites').child(place_id).set(1);
    }
}

//////////////////////////////////////////////////

storeLocator.Store.prototype.getInfoWindowContent = function (x) {
    var infoHTML = "<div class='store'>";

    if (window.userUID) {
        infoHTML = infoHTML + '<button onClick="toggleFavorite(this)" class="favorites-button';
        if (window.userFavorites[this.props_.place_id]) {
            infoHTML = infoHTML + ' favorited';
        }
        infoHTML = infoHTML + '" data-fav="' + this.props_.place_id + '"></button>';
    }

    if (this.props_.picture) {
        infoHTML = infoHTML + '<div class="picture"><img src="' + this.props_.picture + '"></div>';
    }
    if (this.props_.title) {
        infoHTML = infoHTML + '<div class="title">' + this.props_.title + '</div>';
    }
    if (this.props_.price_level) {
        infoHTML = infoHTML + '<div class="prices">' + this.props_.price_level + '</div>';
    }
    if (this.props_.specials) {
        infoHTML = infoHTML + '<div class="specials">' + this.props_.specials + '</div>';
    }
    if (this.props_.times) {
        infoHTML = infoHTML + '<div class="times">' + this.props_.times + '</div>';
    }
    if (this.props_.hours) {
        infoHTML = infoHTML + '<div class="hours">' + this.props_.hours + '</div>';
    }
    if (this.props_.website) {
        infoHTML = infoHTML + '<div class="website">' + this.props_.website + '</div>';
    }
    if (this.props_.address) {
        infoHTML = infoHTML + '<div class="address">' + this.props_.address + '</div>';
    }

    if (this.props_.phone) {
        infoHTML = infoHTML + '<div class="phone">' + this.props_.phone + '</div>';
    }



    if (this.props_.featureList) {
        featuresHTML = '';

        if (this.props_.featureList.beer) {
            featuresHTML += '<div class="beer"><i class="flaticon-food"></i></div>';
        }
        if (this.props_.featureList.wine) {
            featuresHTML += '<div class="wine"><i class="flaticon-food-1"></i></div>';
        }
        if (this.props_.featureList.cocktails) {
            featuresHTML += '<div class="cocktails"><i class="flaticon-food-2"></i></div>';
        }
        if (this.props_.featureList.food) {
            featuresHTML += '<div class="food"><i class="flaticon-spoon"></i></div>';
        }
        if (this.props_.featureList.hookah) {
            featuresHTML += '<div class="hookah"><i class="flaticon-oriental"></i></div>';
        }
        if (this.props_.featureList.dog) {
            featuresHTML += '<div class="dog"><i class="flaticon-dog"></i></div>';
        }
        if (this.props_.featureList.fav) {
            featuresHTML += '<div class="fav"><i class="flaticon-favorite"></i></div>';
        }
        infoHTML = infoHTML + '<div class="featurelist d-flex justify-content-around">' + featuresHTML + '</div>';
    }
    return infoHTML + "</div>";

}

//////////////////////////////////////////////////

PlacesDataSource.prototype.getStores = function (bounds, features, callback) {
    var service = this.service_;
    var details_cache = this.details_cache_;
    var database = firebase.database();

    service.search({
        bounds: bounds,
        type: ['restaurant'],
        keyword: searchwords

    }, function (results, search_status) {
        var stores = [];

        if (!results) {
            return;
        }

        var callbacksRemaining = results.length;

        function detailsCallback(details, details_status, snapshot, result) {
            // console.log(result);

            if (details && details_status != 'CACHED') {
                details_cache[result.place_id] = details;
            }

            var props = {
                place_id: result.place_id,
                title: result.name,
                price_level: result.price_level,
                address: result.vicinity.substring(0, result.vicinity.length - 8),
                types: result.types,
                //icon: result.icon,
                hours: result.opening_hours,
                website: result.website,
            };

            if (result.price_level) {
                if (result.price_level == "1" || result.price_level == "0") {
                    props.price_level = "$";
                } else if (result.price_level == "2") {
                    props.price_level = "$$";
                } else if (result.price_level == "3") {
                    props.price_level = "$$$";
                } else {
                    props.price_level = "$$$$";
                }
            } else {
                props.price_level = "";
            }

            if (details) {
                if (details.formatted_phone_number) {
                    props.phone = details.formatted_phone_number;
                } else if (details.international_phone_number) {
                    props.phone = details.international_phone_number;
                }
            }

            if (result.photos) {
                props.picture = result.photos[0].getUrl({ 'maxWidth': 100, 'maxHeight': 100 });
            }

            if (result.opening_hours) {
                if (result.opening_hours.open_now == true) {
                    props.hours = "Open Now";
                } else if (result.opening_hours.open_now == false) {
                    props.hours = "Closed Now";
                }
            }

            var features = {};
            if (snapshot.val() !== null) {
                props.times = snapshot.val().times.starttime + " - " + snapshot.val().times.endtime;
                props.featureList = snapshot.val().features;
                features = snapshot.val().features;
            }

            if (snapshot.val() !== null) {
                props.specials = snapshot.val().specials;
            }

            if (matchFeatures(features, result.place_id)) {
                var store = new storeLocator.Store(result.id, result.geometry.location, null, props);
                stores.push(store);
            } else {
                console.log("skipping '" + props.title + "' due to missing feature");
            }

            if (--callbacksRemaining <= 0) {
                console.log('invoking stores callback');
                callback(stores);
            }

        }

        function databaseCallback(snapshot, result) {
            if (details_cache[result.place_id]) {
                detailsCallback(details_cache[result.place_id], 'CACHED', snapshot, result);
            } else {
                var request = {
                    placeId: result.place_id
                };
                service.getDetails(request, function (details, details_status) {
                    detailsCallback(details, details_status, snapshot, result)
                });
            }
        }

        for (let result of results) {
            if (!result) {
                if (--callbacksRemaining <= 0) {
                    console.log('invoking stores callback');
                    callback(stores);
                }
                continue;
            }

            database.ref("/happyHowlerData/places").child(result.place_id).once("value", function (snapshot) {
                databaseCallback(snapshot, result);
            });
        }
    });
};

//////////////////////////////////////////////////

function matchFeatures(features, place_id) {
    if (($("#beer-check").prop("checked") && !features.beer) ||
        ($("#wine-check").prop("checked") && !features.wine) ||
        ($("#cocktails-check").prop("checked") && !features.cocktails) ||
        ($("#food-check").prop("checked") && !features.food) ||
        ($("#hookah-check").prop("checked") && !features.hookah) ||
        ($("#dog-check").prop("checked") && !features.dog) ||
        ($("#fav-check").prop("checked") && (typeof (window.userFavorites) !== "object" || !window.userFavorites[place_id]))) {
        return false;
    } else {
        return true;
    }
}


google.maps.event.addDomListener(window, 'load', initMap);


















