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
     //return 'india' ;
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

// .directive('creatorMapComponent', ['uiGmapGoogleMapApi', '$timeout',
//
//     /*
//         Do not remove this directive, it is what powers the Creator Drag & Drop Component.
//     */
//
//     function(uiGmapGoogleMapApi, $timeout) {
//
//         return {
//             restrict: 'E',
//             scope: true,
//             link: function($scope, $element, $attr, _c, transclude) {
//
//                 $scope.map = {};
//
//                 if ($attr.marker=="true"){
//                     $scope.map.marker = {
//                         id: 0,
//                         options: {
//                             icon: imgs.imHereBlue,
//                             draggable: true
//                         }
//                     }
//                 }
//
//                 $attr.$observe('location', function(val){
//
//                     uiGmapGoogleMapApi.then(function(maps){
//
//                         function setupMap(lat, lng){
//
//                             $scope.map.zoom = parseInt($attr.zoom);
//                             $timeout(function(){
//                                 $scope.map.center = {
//                                     latitude: lat,
//                                     longitude: lng
//                                 };
//                             });
//                             $scope.map.options = {
//                                 mapTypeId: maps.MapTypeId.ROADMAP,
//                                 disableDefaultUI: true,
//                                 showTraficLayer:true
//                             }
//
//                             if ($attr.marker=="true"){
//                                 // $scope.map.marker.icon = imgs.imHereBlue;
//                                 // $scope.map.marker.draggable = true;
//                                 $scope.map.marker.options.animation = maps.Animation.BOUNCE,
//                                 $scope.map.marker.coords = {
//                                     latitude: lat,
//                                     longitude: lng
//                                 }
//                             }
//                         }
//
//                         if (val.indexOf('"latitude"') > -1){
//                             val = JSON.parse(val);
//                             setupMap(val.latitude, val.longitude);
//                         }else{
//                             var geocoder = new maps.Geocoder();
//                             geocoder.geocode({'address' : val}, function(results, status){
//
//                                 $scope.$apply(function(){
//                                     setupMap(results[0].geometry.location.lat(), results[0].geometry.location.lng());
//                                 });
//
//                             });
//                         }
//                     });
//
//                 });
//
//             }
//
//         };
// }]);
