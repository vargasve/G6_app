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

storeLocator.Store.prototype.getInfoWindowContent = function (x) {

    var infoHTML = "<div class='store'>";

    if (this.props_.picture) {
        infoHTML = infoHTML + '<div class="picture"><img src="' + this.props_.picture + '"></div>';
    }
    if (this.props_.price_level) {
        infoHTML = infoHTML + '<div class="prices">' + this.props_.price_level + '</div>';
    }
    if (this.props_.title) {
        infoHTML = infoHTML + '<div class="title">' + this.props_.title + '</div>';
    }
    if (this.props_.times) {
        infoHTML = infoHTML + '<div class="times">' + this.props_.times + '</div>';
    }
    if (this.props_.specials) {
        infoHTML = infoHTML + '<div class="specials">' + this.props_.specials + '</div>';
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


    if (this.props_.hours) {
        infoHTML = infoHTML + '<div class="hours">' + this.props_.hours + '</div>';
    }
    if (this.props_.featureList) {
        featuresHTML = '';

        if (this.props_.featureList.beer) {
            featuresHTML += '<div class="beer"><i class="flaticon-beer"></i></div>';
        }
        if (this.props_.featureList.wine) {
            featuresHTML += '<div class="wine"><i class="flaticon-wine-glass"></i></div>';
        }
        if (this.props_.featureList.cocktails) {
            featuresHTML += '<div class="cocktails"><i class="flaticon-food"></i></div>';
        }
        if (this.props_.featureList.food) {
            featuresHTML += '<div class="food"><i class="flaticon-cutlery"></i></div>';
        }
        if (this.props_.featureList.hookah) {
            featuresHTML += '<div class="hookah"><i class="flaticon-hookah"></i></div>';
        }
        if (this.props_.featureList.dog) {
            featuresHTML += '<div class="dog"><i class="flaticon-dog"></i></div>';
        }
        if (this.props_.featureList.fav) {
            featuresHTML += '<div class="fav"><i class="flaticon-dog"></i></div>';
        }
        infoHTML = infoHTML + '<div class="featurelist d-flex justify-content-center">' + featuresHTML + '</div>';
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
                title: result.name,
                price_level: result.price_level,
                address: result.vicinity,
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
            if(snapshot.val() !== null) {

                props.specials = snapshot.val().specials;
            }

            if (matchFeatures(features)) {
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

function matchFeatures(features) {
    if (($("#beer-check").prop("checked") && !features.beer) ||
        ($("#wine-check").prop("checked") && !features.wine) ||
        ($("#cocktails-check").prop("checked") && !features.cocktails) ||
        ($("#food-check").prop("checked") && !features.food) ||
        ($("#hookah-check").prop("checked") && !features.hookah) ||
        ($("#dog-check").prop("checked") && !features.dog) ||
        ($("#fav-check").prop("checked") && !features.fav)) {
        return false;
    } else {
        return true;
    }
}

google.maps.event.addDomListener(window, 'load', initMap);



















// Check out code

/*
storeLocator.Panel.prototype.selectedStore_changed = function() {
    $(".highlighted", this.storeList_).removeClass("highlighted");
    var a = this,
        b = this.get("selectedStore");
    if (b) {
        this.directionsTo_ = b;
      this.storeList_.find("#store-" + b.getId()).addClass("highlighted");
                                $(".highlighted").click(function () { 
                                $(this).parent().prepend($(this));
                                }) 
        this.settings_.directions && this.directionsPanel_.find(".directions-to").val(b.getDetails().title);
        var c = a.get("view").getInfoWindow().getContent(),
            d = $("\x3ca/\x3e").text("Directions").attr("href", "#").addClass("action").addClass("directions"),
            e = $("\x3ca/\x3e").text("Zoom here").attr("href",
                "#").addClass("action").addClass("zoomhere"),
            f = $("\x3ca/\x3e").text("Street view").attr("href", "#").addClass("action").addClass("streetview");
        d.click(function() {
            a.showDirections();
            return !1
        });
        e.click(function() {
            a.get("view").getMap().setOptions({
                center: b.getLocation(),
                zoom: 16
            })
        });
        f.click(function() {
            var c = a.get("view").getMap().getStreetView();
            c.setPosition(b.getLocation());
            c.setVisible(!0)
        });
        $(c).append(d).append(e).append(f)
    }
};

$("li").click(function() {
     
    $(this).parent().prepend($(this));
    
  });*/