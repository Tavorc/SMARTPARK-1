imgs = {
     imHereBlue: './img/myLocPinBlue.png',
     markerBlack: './img/markerBlack.png',
     markerBlue: './img/markerBlue.png',
     markerBlue2: './img/markerBlue2.png',
     markerGreen: './img/markerGreen.png',
     markerPink: './img/markerPink.png',
     markerRed: './img/markerRed.png',
     markerYellow: './img/markerYellow.png',
     myLocGreen: './img/myLocGreen.png',
     myLocPinBlue: './img/myLocPinBlue.png',
     myLocPinPink: './img/myLocPinPink.png',
     pointBlue: './img/pointBlue.png',
     pointGreen: './img/pointGreen.png',
     pointPink: './img/pointPink.png',
     reserved: './img/reserved.png'
     // size: new google.maps.Size(100, 100),
     // origin: new google.maps.Point(0, 0),
     // anchor: new google.maps.Point(0, 32)
 },
 tempMyLocation = {
     name:"TEL AVIV, ISRAEL",
     coords: {
         lat: 32.0852999,
         lng: 34.78176759999999
     }
 },

 getLocation = function(){

    // NOTE: *TAVOR*
    getLocation = function() {
                        navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError);
                        }
                         function geolocationSuccess(position)
                             {
                              var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                              var geocoder = new google.maps.Geocoder();
                              Latitude=position.coords.latitude;
                              Longitude=position.coords.longitude;
                              var location={
                                lat:Latitude,
                                lng:Longitude
                              }
                              console.log(location);
                              return location;
                              }
                        function geolocationError(error)
                         {
                           $ionicPopup.alert({
                           title: "Error Location",
                           subTitle: "Error",
                           template: JSON.stringify(error)
                            });
                        }
};
angular.module('googlemaps.init', ['uiGmapgoogle-maps'])

.config(['uiGmapGoogleMapApiProvider', function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyCHQ31H0pHcnqIc0U-WBXx1I5nJAoQM4kA',
        libraries: 'weather,geometry,visualization'
    });
}])
