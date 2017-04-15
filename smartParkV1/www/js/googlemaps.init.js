//NOTE:*INBAR* $http.get('https://maps.googleapis.com/maps/api/geocode/json?address=tel+Aviv,+ISRAEL&key=AIzaSyCHQ31H0pHcnqIc0U-WBXx1I5nJAoQM4kA').success(function(jsn){console.log('file ignore info: '+jsn);});
myLocation = {
  name:"TEL AVIV, ISRAEL",
  latitude: 32.0852999,
  longitude: 34.78176759999999
},
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
getMyLocation = function(){ //NOTE: ***TAVOR***
    return('tel aviv, israel');
  };

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
                // console.log($element);
                $scope.map = {};

                if ($attr.marker=="true"){
                    $scope.map.marker = {
                        id: 0
                    }
                }

                $attr.$observe('location', function(val){

                    uiGmapGoogleMapApi.then(function(maps){

                        function setupMap(lat, lng){

                            $scope.map.zoom = parseInt($attr.zoom);
                            $timeout(function(){
                                $scope.map.center = {
                                    latitude: lat,
                                    longitude: lng
                                };
                                console.log(lat, lng);
                            });
                            $scope.map.options = JSON.parse($attr.options);

                            if ($attr.marker=="true"){
                                $scope.map.marker.coords = {
                                    latitude: lat,
                                    longitude: lng
                                }
                                $scope.map.marker.options = {
                                    // animation: maps.Animation.BOUNCE,
                                    // draggable: true
                                    icon: imgs.imHereBlue
                                }
                            }
                        }

                        if (val.indexOf('"latitude"') > -1){
                            val = JSON.parse(val);
                            setupMap(val.latitude, val.longitude);
                        }else{
                            var geocoder = new maps.Geocoder();
                            geocoder.geocode({'address' : val}, function(results, status){

                                $scope.$apply(function(){
                                    setupMap(results[0].geometry.location.lat(), results[0].geometry.location.lng());
                                });

                            });
                        }
                    });

                });
                // mainMarker = $scope.map.marker;
            }
        };
    }
]);
