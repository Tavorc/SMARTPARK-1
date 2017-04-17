tempChosenLocation = {
    street: '',
    number: '',
    city: '',
    country: ''
};

function placeMarker(map, location ,withInfo = true) {
    var marker = new google.maps.Marker({
        position: location,
        map: map,
        // url:'/',
        icon: imgs.markerGreen,
        draggable: true,
        animation: google.maps.Animation.DROP
    });
    var infowindow = new google.maps.InfoWindow({
        content: 'Latitude: ' + location.lat() + '<br>Longitude: ' + location.lng()
    })
    if(withInfo){
        google.maps.event.addListener(marker, 'click', function(event) {
            infowindow.open(map,marker);
            console.log('mouseEvent!');
            // maps.event.addListener(chosenMark, 'click', function() {
                //  chosenMark.setMap(null);// clicke to remove pin
        //         chosenMark.setAnimation(google.maps.Animation.BOUNCE);
        //         // console.log('marker has been removed!');
        //     /*window.location.href = marker.url;*/
        //     });
        });
    }
    return(marker);
}

angular.module('app.controllers', ['ionic'])//'ionic.cloud'

.run(function($http){
    //***INBAR***

    // $http.get('fromServer').success(function(parkingJson){locations = parkingJson;});
    locations = [
        {lat: 32.085999, lng: 34.781555},
        {lat: 32.085234, lng: 34.781181},
        {lat: 32.085111, lng: 34.781124},
        {lat: 32.085588, lng: 34.781834},
        {lat: 32.085702, lng: 34.781968},
        {lat: 32.085264, lng: 34.781657},
        {lat: 32.085724, lng: 34.781905},
        {lat: 32.085685, lng: 34.781196},
        {lat: 32.085611, lng: 34.781222},
        // {lat: 32.085000, lng: 34.781667},
        // {lat: 32.085859, lng: 34.781708},
        // {lat: 32.085015, lng: 34.781858},
        // {lat: 32.085104, lng: 34.781299},
        // {lat: 32.085700, lng: 34.781187},
        // {lat: 32.085785, lng: 34.781978},
        // {lat: 32.085616, lng: 34.781119},
        // {lat: 32.085766, lng: 34.781692},
        // {lat: 32.085193, lng: 34.781218},
        // {lat: 32.085162, lng: 34.781694},
        // {lat: 32.085358, lng: 34.781506},
        // {lat: 32.085358, lng: 34.781315},
        // {lat: 32.085258, lng: 34.781000},
        {lat: 32.085792, lng: 34.781352}
    ];


})

.controller('sMARTInCtrl', ['$scope', '$stateParams', '$state',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $state) {
    // console.log($stateParams);
    $scope.print = function(){
        console.log($stateParams);
    }
    $scope.smartInForm = $stateParams;
    // console.log($scope.smartInForm);

    // {
    //     distance: 'hello',
    //     date: '',
    //     time: '',
    //     street: tempChosenLocation.street,
    //     number: tempChosenLocation.number,
    //     city: tempChosenLocation.city,
    //     country: tempChosenLocation.country,
    //     size: '',
    //     handicap: '',
    //     comments: ''
    // };
    // console.log($scope.smartInForm);
    $scope.transfer = function(){
        // console.log('hello_again');
        $state.go('tabsController.availableSMARTParks', { veryLongParamParent:'Parent--0b2a585f-fcef-4462-b656-544e4575fca5' })
        // $state.go('tabsController.availableSMARTParks',$scope.smartInForm);
    }
}])

.controller('sMARTOutCtrl', ['$scope', '$http', '$log', '$timeout','$stateParams','uiGmapGoogleMapApi', 'uiGmapIsReady', //NOTE: '$cordovaGeolocation',
function ($scope, $http, $log, $timeout, $stateParams, uiGmapGoogleMapApi, uiGmapIsReady) {
    // console.log(tempChosenLocation);
    $scope.smartOutForm = {
        date: '',
        time: '',
        street: tempChosenLocation.street,
        number: tempChosenLocation.number,
        city: tempChosenLocation.city,
        country: tempChosenLocation.country,
        repeat: '',
        size: '',
        waiting: '',
        handicap: '',
        comments: ''
    };
    // $scope.transfer = function(){
    //     // console.log('hello_again');
    //     $state.go('tabsController.sMARTPARK', $scope.smartOutForm)
    //     // $state.go('tabsController.availableSMARTParks',$scope.smartInForm);
    // }

    uiGmapGoogleMapApi.then(function(maps){
        $scope.outMap = {
                center: {
                    latitude: 32.0852999,
                    longitude: 34.78176759999999
                    // latitude: 40.1451, longitude: -20.6680
                },
                zoom: 14,
                options: {
                    mapTypeId: maps.MapTypeId.ROADMAP,
                    disableDefaultUI: true,
                    showTraficLayer:true,
                }
        }
        $scope.mainMarker = {
            id: 0,
            coords: {
                latitude: myLocation.latitude,
                longitude: myLocation.longitude
                // latitude: 40.1451, longitude: -20.6680
            },
            options: {
                animation: maps.Animation.BOUNCE,
                draggable: true
            },
            events: {
                dragend: function (marker, eventName, args) {
                    $log.log('marker dragend');
                    var lat = marker.getPosition().lat();
                    var lon = marker.getPosition().lng();
                    $log.log(lat);
                    $log.log(lon);
                    $scope.mainMarker.options = {
                        animation: maps.Animation.BOUNCE,
                        draggable: true
                    };
                    $http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng='+marker.getPosition().lat()+','+marker.getPosition().lng() +'&key=AIzaSyCHQ31H0pHcnqIc0U-WBXx1I5nJAoQM4kA').success(function(jsn){
                        $scope.chosenLocation = jsn.results[0].formatted_address;//+ event.latLng.lat() + 'Longitude: ' + event.latLng.lng()+
                        tempChosenLocation.number = jsn.results[0].address_components[0].short_name;
                        tempChosenLocation.street = jsn.results[0].address_components[1].short_name;
                        tempChosenLocation.city = jsn.results[0].address_components[2].short_name;
                        tempChosenLocation.country = jsn.results[0].address_components[4].short_name;
                        console.log('returnd info: '+jsn.results[0].formatted_address);
                    });
                },
                click: function (marker, eventName, args) {
                    $log.log('marker clicked');
                    var lat = marker.getPosition().lat();
                    var lon = marker.getPosition().lng();
                    console.log(args);
                    $log.log(lat);
                    $log.log(lon);
                    $scope.mainMarker.options = {
                        animation: maps.Animation.BOUNCE,
                        draggable: true
                    };
                    var infowindow = new google.maps.InfoWindow({
                        content: 'Latitude: ' + marker.getPosition().lat() + '<br>Longitude: ' + marker.getPosition().lng()
                    })
                    infowindow.open($scope.inMap,marker);
                    console.log('mouseEvent!');
                }
            }
        }

    })
    }])

.controller('sMARTPARKCtrl', ['$scope', '$http', '$stateParams', 'uiGmapGoogleMapApi','uiGmapIsReady', '$ionicLoading', '$ionicActionSheet', '$state',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
  // You can include any angular dependencies as parameters for this function
  // TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $http, $stateParams, uiGmapGoogleMapApi, uiGmapIsReady, UserService, $ionicActionSheet, $state) {
    $scope.getLocation = function() {
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
$scope.$on('cloud:push:notification', function(event, data) {
  var msg = data.message;
    alert(msg.title + ': ' + msg.text);
  });

    uiGmapGoogleMapApi.then(function(maps){
        // Configuration needed to display the road-map with traffic
        // Displaying Ile-de-france (Paris neighbourhood)
        uiGmapIsReady.promise(1).then(function(instances) {
            instances.forEach(function(inst) {
                var map = inst.map;
                var uuid = map.uiGmap_id;
                var mapInstanceNumber = inst.instance; // Starts at 1.
                var markers = [];
            });
        });

        $scope.mainMap = {
            // center: {
            //   latitude: maps.latitude,
            //   longitude: maps.longitude
            // },
            zoom: 12,
            options: {
                mapTypeId: google.maps.MapTypeId.ROADMAP, // This is an example of a variable that cannot be placed outside of uiGmapGooogleMapApi without forcing of calling the google.map helper outside of the function
                disableDefaultUI: true,
                showTraficLayer:true,
            }
        };
    });
}])

.controller('sMARTMenuCtrl', ['$scope', '$stateParams', '$ionicLoading', '$ionicActionSheet', '$state',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, UserService, $ionicActionSheet, $state) {
 $scope.googleLogOut = function() {
    var hideSheet = $ionicActionSheet.show({
      destructiveText: 'Logout',
      titleText: 'Are you sure you want to logout?',
      cancelText: 'Cancel',
      cancel: function() {},
      buttonClicked: function(index) {
        return true;
      },
      destructiveButtonClicked: function(){
        window.plugins.googleplus.logout(
          function (msg) {
            console.log(msg);
            $state.go('sMARTPARKLogin');
          },
          function(fail){
            console.log(fail);
          }
        );
      }
    });
  };
}])

.controller('availableSMARTParksCtrl', ['$scope', '$stateParams', '$state', '$http', 'uiGmapIsReady', 'uiGmapGoogleMapApi',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $state, $http, uiGmapIsReady, uiGmapGoogleMapApi) {
    uiGmapGoogleMapApi.then(function(maps){
        console.log($stateParams);
        $scope.avblSPMap = {
                center: {
                    latitude: myLocation.latitude,
                    longitude: myLocation.longitude
                },
                zoom: 18,
                options: {
                    mapTypeId: maps.MapTypeId.ROADMAP,
                    disableDefaultUI: true,
                    showTraficLayer:true,
                }
        }

        $scope.mainMarker = {
            id: 0,
            coords: {
                latitude: myLocation.latitude,
                longitude: myLocation.longitude
            },
            options: {
                animation: maps.Animation.BOUNCE,
                icon: imgs.imHereBlue

            }
        }
        //TODO:INBAR- $http.get('fromServer').success(function(parkingJson){locations = parkingJson;});
        uiGmapIsReady.promise(1).then(function(instances) {
            instances.forEach(function(inst) {
                var inst = instances[0];
                var map = inst.map;
                var uuid = map.uiGmap_id;
                var mapInstanceNumber = inst.instance; // Starts at 1.
                var markers = [];
                // NOTE: function to mark points on map
                locations.forEach(function(location) {
                    var tempLatLng = new maps.LatLng(location.lat, location.lng);
                    markers.push(placeMarker(map, tempLatLng));
                });
            });
        })
    })
}])



.controller('mapsExampleCtrl', ['$scope', '$http', '$log', '$timeout','$stateParams','uiGmapGoogleMapApi', 'uiGmapIsReady', '$state', //NOTE: '$cordovaGeolocation',
function ($scope, $http, $log, $timeout, $stateParams, uiGmapGoogleMapApi, uiGmapIsReady, $cordovaGeolocation, $state) {

    // NOTE: ***TAVOR*** https://forum.ionicframework.com/t/google-maps-not-displaying-angular-google-maps/30904
    // $cordovaGeolocation
    // .getCurrentPosition()
    // .then(function (position) {
    //     var lat  = position.coords.latitude
    //     var long = position.coords.longitude
    //   $scope.map = {center: {latitude: lat, longitude: long}, zoom: 16 };
    // }

    uiGmapGoogleMapApi.then(function(maps){
        $scope.inMap = {
                center: {
                    latitude: myLocation.latitude,
                    longitude: myLocation.longitude
                    // latitude: 40.1451, longitude: -20.6680
                },
                zoom: 14,
                options: {
                    mapTypeId: maps.MapTypeId.ROADMAP,
                    disableDefaultUI: true,
                    showTraficLayer:true,
                }
        }
        $scope.mainMarker = {
            id: 0,
            coords: {
                latitude: myLocation.latitude,
                longitude: myLocation.longitude
                // latitude: 40.1451, longitude: -20.6680
            },
            options: {
                animation: maps.Animation.BOUNCE,
                draggable: true
            },
            events: {
                dragend: function (marker, eventName, args) {
                    $log.log('marker dragend');
                    var lat = marker.getPosition().lat();
                    var lon = marker.getPosition().lng();
                    $log.log(lat);
                    $log.log(lon);
                    $scope.mainMarker.options = {
                        animation: maps.Animation.BOUNCE,
                        draggable: true
                    };
                    $http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng='+marker.getPosition().lat()+','+marker.getPosition().lng() +'&key=AIzaSyCHQ31H0pHcnqIc0U-WBXx1I5nJAoQM4kA').success(function(jsn){
                        $scope.chosenLocation = jsn.results[0].formatted_address;//+ event.latLng.lat() + 'Longitude: ' + event.latLng.lng()+
                        // tempChosenLocation.number = jsn.results[0].address_components[0].short_name;
                        // tempChosenLocation.street = jsn.results[0].address_components[1].short_name;
                        // tempChosenLocation.city = jsn.results[0].address_components[2].short_name;
                        // tempChosenLocation.country = jsn.results[0].address_components[4].short_name;
                        console.log('returnd info: '+jsn.results[0].formatted_address);
                    });
                },
                click: function (marker, eventName, args) {
                    $log.log('marker clicked');
                    var lat = marker.getPosition().lat();
                    var lon = marker.getPosition().lng();
                    console.log(args);
                    $log.log(lat);
                    $log.log(lon);
                    $scope.mainMarker.options = {
                        animation: maps.Animation.BOUNCE,
                        draggable: true
                    };
                    var infowindow = new google.maps.InfoWindow({
                        content: 'Latitude: ' + marker.getPosition().lat() + '<br>Longitude: ' + marker.getPosition().lng()
                    })
                    infowindow.open($scope.inMap,marker);
                    console.log('mouseEvent!');
                }
            }
        }

    })
}])


.controller('sMARTPARKLoginCtrl', ['$scope', '$stateParams','$ionicLoading', '$ionicSideMenuDelegate', '$state', '$ionicPush', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicLoading, $ionicSideMenuDelegate, $state, $ionicPush) {

    $ionicSideMenuDelegate.canDragContent(false);
    $scope.$on('$ionicView.leave', function () { $ionicSideMenuDelegate.canDragContent(true) });
    $scope.googleSignIn = function() {
        $ionicLoading.show({
          template: 'Logging in..:)'
        });

        window.plugins.googleplus.login(
          {},
          function (user_data) {
            // For the purpose of this example I will store user data on local storage
            console.log(user_data);
            // UserService.setUser({
            //   userID: user_data.userId,
            //   name: user_data.displayName,
            //   email: user_data.email,
            //   picture: user_data.imageUrl,
            //   accessToken: user_data.accessToken,
            //   idToken: user_data.idToken
            // });
            $ionicLoading.hide();
             $state.go('tabsController.sMARTPARK');
          },
          function (msg) {
             $ionicLoading.hide();
          }
        );
         $ionicPush.register().then(function(t) {
      return $ionicPush.saveToken(t);
      }).then(function(t) {
         console.log('Token saved:', t.token);
      });
    };

}])

.controller('sMARTPARKSignupCtrl', ['$scope', '$stateParams', '$ionicSideMenuDelegate',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams ,$ionicSideMenuDelegate) {
    // $ionicSideMenuDelegate.canDragContent(false);

}])


.controller('mapsExampleOutCtrl', ['$scope', '$http', '$log', '$timeout','$stateParams','uiGmapGoogleMapApi', 'uiGmapIsReady', //NOTE: '$cordovaGeolocation',
function ($scope, $http, $log, $timeout, $stateParams, uiGmapGoogleMapApi, uiGmapIsReady, $cordovaGeolocation) {

    // NOTE: ***TAVOR*** https://forum.ionicframework.com/t/google-maps-not-displaying-angular-google-maps/30904
    // $cordovaGeolocation
    // .getCurrentPosition()
    // .then(function (position) {
    //     var lat  = position.coords.latitude
    //     var long = position.coords.longitude
    //   $scope.map = {center: {latitude: lat, longitude: long}, zoom: 16 };
    // }

    uiGmapGoogleMapApi.then(function(maps){
        $scope.outMap = {
                center: {
                    latitude: myLocation.latitude,
                    longitude: myLocation.longitude
                    // latitude: 40.1451, longitude: -20.6680
                },
                zoom: 14,
                options: {
                    mapTypeId: maps.MapTypeId.ROADMAP,
                    disableDefaultUI: true,
                    showTraficLayer:true,
                }
        }
        $scope.mainMarker = {
            id: 0,
            coords: {
                latitude: myLocation.latitude,
                longitude: myLocation.longitude
                // latitude: 40.1451, longitude: -20.6680
            },
            options: {
                animation: maps.Animation.BOUNCE,
                draggable: true
            },
            events: {
                dragend: function (marker, eventName, args) {
                    $log.log('marker dragend');
                    var lat = marker.getPosition().lat();
                    var lon = marker.getPosition().lng();
                    $log.log(lat);
                    $log.log(lon);
                    $scope.mainMarker.options = {
                        animation: maps.Animation.BOUNCE,
                        draggable: true
                    };
                    $http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng='+marker.getPosition().lat()+','+marker.getPosition().lng() +'&key=AIzaSyCHQ31H0pHcnqIc0U-WBXx1I5nJAoQM4kA').success(function(jsn){
                        $scope.chosenLocation = jsn.results[0].formatted_address;//+ event.latLng.lat() + 'Longitude: ' + event.latLng.lng()+
                        tempChosenLocation.number = jsn.results[0].address_components[0].short_name;
                        tempChosenLocation.street = jsn.results[0].address_components[1].short_name;
                        tempChosenLocation.city = jsn.results[0].address_components[2].short_name;
                        tempChosenLocation.country = jsn.results[0].address_components[4].short_name;
                        console.log('returnd info: '+jsn.results[0].formatted_address);
                    });
                },
                click: function (marker, eventName, args) {
                    $log.log('marker clicked');
                    var lat = marker.getPosition().lat();
                    var lon = marker.getPosition().lng();
                    console.log(args);
                    $log.log(lat);
                    $log.log(lon);
                    $scope.mainMarker.options = {
                        animation: maps.Animation.BOUNCE,
                        draggable: true
                    };
                    var infowindow = new google.maps.InfoWindow({
                        content: 'Latitude: ' + marker.getPosition().lat() + '<br>Longitude: ' + marker.getPosition().lng()
                    })
                    infowindow.open($scope.inMap,marker);
                    console.log('mouseEvent!');
                }
            }
        }

    })
}])
