angular.module('googlemaps.init', ['uiGmapgoogle-maps'])

.config(['uiGmapGoogleMapApiProvider', function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyCHQ31H0pHcnqIc0U-WBXx1I5nJAoQM4kA',
        libraries: 'weather,geometry,visualization'
    });
}])

.directive('creatorMapComponent', ['uiGmapGoogleMapApi', '$timeout',

    /*
        Do not remove this directive, it is what powers the Creator Drag & Drop Component.
    */

    function(uiGmapGoogleMapApi, $timeout) {
        return {
            restrict: 'E',
            scope: true,
            link: function($scope, $element, $attr, _c, transclude) {
                $scope.map = {};
                if ($attr.marker=="true"){
                    $scope.map.marker = {
                        id: 0
                    }
                    $scope.map.marker.options = {
                        icon:'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
                    }
                }
                $attr.$observe('location', function(val){
                    uiGmapGoogleMapApi.then(function(maps){
                        var Latitude = undefined;
                        var Longitude = undefined;
                        $scope.map.zoom = parseInt(14);
                        function getMapLocation()
                        {
                        navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError);
                        }
                         function geolocationSuccess(position)
                             {
                              var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                              var geocoder = new google.maps.Geocoder();  
                              Latitude=position.coords.latitude;
                              Longitude=position.coords.longitude;
                              setupMap(Latitude, Longitude);
                              }
                        function geolocationError(error)
                         {
                           $ionicPopup.alert({
                           title: "Error Location",
                           subTitle: "Error",
                           template: JSON.stringify(error)
                            });
                        }
                        function setupMap(lat, lng){
                             $timeout(function(){
                                $scope.map.center = {
                                    latitude: Latitude,
                                    longitude: Longitude
                                };  
                             });
                              $scope.map.options = JSON.parse($attr.options);
                            if ($attr.marker=="true"){
                                $scope.map.marker.coords = {
                                latitude: Latitude,
                                longitude: Longitude
                                }
                            }  
                          //  console.log($scope.map.marker.coords.latitude);
                        }
                         var  onSuccess = function(position)
                            {
                            var lati  = position.coords.latitude;
                            var long = position.coords.longitude;
                            if (lati != Latitude && long != Longitude)
                             {
                                Latitude = lati;
                                Longitude = long;
                                setupMap(lati, long);
                             }
                            }
                            function onError(error)
                             {
                             alert('code: '    + error.code    + '\n' +
                                'message: ' + error.message + '\n');
                             }
                        var watchID = navigator.geolocation.watchPosition(onSuccess, onError, { timeout: 3000, enableHighAccuracy: true });
                        if (val.indexOf('"latitude"') > -1){
                            val = JSON.parse(val);
                            setupMap(val.latitude, val.longitude);
                        }else{
                            var geocoder = new maps.Geocoder();
                            geocoder.geocode({'address' : val}, function(results, status){
                                $scope.$apply(function(){
                                });
            
                            });
                        }
                    });       
                });
            }
        };
}]);