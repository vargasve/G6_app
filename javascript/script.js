// Grabbing and populating favorites based on map boundaries

var map;
var infowindow;
var searchwords = "happy+hour";
var bars = [];
var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var labelIndex = 0;
var markers = [];

var austin = { lat: 30.2672, lng: -97.7431 };

google.maps.event.addDomListener(window, 'load', function () {
  var map = new google.maps.Map(document.getElementById('map-canvas'), {
    center: austin,
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  var panelDiv = document.getElementById('panel');

  var data = new PlacesDataSource(map);

  var view = new storeLocator.View(map, data);

  var markerSize = new google.maps.Size(24, 24);
  view.createMarker = function (store) {
    return new google.maps.Marker({
      position: store.getLocation(),
      icon: new google.maps.MarkerImage(store.getDetails().icon, null, null,
        null, markerSize)
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
  return fieldsHTML;
}

//////////////////////////////////////////////////

/**
 * @inheritDoc
 */
PlacesDataSource.prototype.getStores = function (bounds, features, callback) {
  var service = this.service_;
  var details_cache = this.details_cache_;

  service.search({
    bounds: bounds,
    type: ['restaurant'],
    keyword: searchwords

  }, function (results, search_status) {
    var stores = [];

    var callbacksRemaining = results.length;

    for (var i = 0, result; result = results[i]; i++) {
      function detailsCallback(details, details_status) {
        if (result) {
          if (details && details_status != 'CACHED') {
            details_cache[result.place_id] = details;
          }

          var props = {
            title: result.name,
            address: result.vicinity,

            icon: result.icon,
            hours: result.opening_hours.open_now,
            price: result.price_level,
          };

          if (details) {
            props.phone = details.formatted_phone_number;
          }

          if (result.photos) {
            props.picture = result.photos[0].getUrl({ 'maxWidth': 100, 'maxHeight': 100 });
          }

          var store = new storeLocator.Store(result.id, result.geometry.location, null, props);

          stores.push(store);
        }

        if (--callbacksRemaining <= 0) {
          callback(stores);
        }
      }

      if (details_cache[result.place_id]) {
        detailsCallback(details_cache[result.place_id], 'CACHED');
      } else {
        var request = {
          placeId: results[i]['place_id']
        };
        service.getDetails(request, detailsCallback);
      }
    }
  });
};
