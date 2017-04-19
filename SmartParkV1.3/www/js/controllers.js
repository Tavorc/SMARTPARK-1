
angular.module('app.controllers', [])

.run(function($http){
    //***INBAR***



})

.controller('inCtrl', ['$scope', '$http', '$state', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $http, $state, $stateParams) {
    console.log($stateParams);
    $scope.formInParams = {
        distance: null,
        date: null,
        time: null,
        street: $stateParams.street,
        number: $stateParams.number,
        city: $stateParams.city,
        country: $stateParams.country,
        size: null,
        handicap: null,
        comments: null,
        picture: null
    }
    $scope.print = function(){
        console.log($scope.formInParams);
        // $state.go('^');
    }
    $scope.getInfoFromServer = function(){
        // TODO: $http.get('fromServer'+formInParams).success(function(answer){console.log(answer); $state.go('menu.mapOUT', {answer})});
        console.log($scope.formInParams);
        $state.go('menu.availabeParking', $scope.formInParams);
    };
}])

.controller('outCtrl', ['$scope', '$http', '$state', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $http, $state, $stateParams) {
    console.log($stateParams);
    $scope.formOutParams = {
        date: null,
        time: null,
        street: $stateParams.street,
        number: $stateParams.number,
        city: $stateParams.city,
        country: $stateParams.country,
        repeat: null,
        size: null,
        handicap: null,
        comments: null
    }
    $scope.print = function(){
        console.log($scope.formOutParams);
        // $state.go('^');
    }
    $scope.getInfoFromServer = function(){
        // TODO: $http.get('fromServer'+formOutParams).success(function(answer){console.log(answer); $state.go('menu.mapOUT', {answer})});
        console.log($scope.formOutParams);
        $state.go('menu.home', $scope.formOutParams);
    };
}])

.controller('menuCtrl', ['$scope', '$stateParams', '$ionicLoading', '$ionicActionSheet', '$state', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
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
            $state.go('login');
          },
          function(fail){
            console.log(fail);
          }
        );
      }
    });
  };

}])

.controller('loginCtrl', ['$scope', '$stateParams','$ionicLoading', '$ionicSideMenuDelegate', '$state', '$ionicPush', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicLoading, $ionicSideMenuDelegate, $state) {
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
      //    $ionicPush.register().then(function(t) {
      // return $ionicPush.saveToken(t);
      // }).then(function(t) {
      //    console.log('Token saved:', t.token);
      // });
    };

}])

.controller('homeCtrl', ['$scope', '$state', '$http', '$stateParams', '$ionicLoading', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $state, $http, $stateParams, $ionicLoading) {
        $scope.init = function(){
        $scope.chosenLocation;
        var myLatlng = new google.maps.LatLng(32.3000, 12.4833);

        var mapOptions = {
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true,
            showTraficLayer:true,
            center: myLatlng,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var map = new google.maps.Map(document.getElementById("mapHOME"), mapOptions);
        var geocoder = new google.maps.Geocoder();
            geocoder.geocode({'address' : 'telAviv , ISRAEL'}, function(results, status){
                    console.log(results[0].geometry.location.lat() , results[0].geometry.location.lng());
                })
        // navigator.geolocation.getCurrentPosition(function(pos) {
        $scope.myLocation;
            map.setCenter(new google.maps.LatLng(32.0852999 , 34.78176759999997)); // NOTE: pos.coords.latitude, pos.coords.longitude
            var myLocation = new google.maps.Marker({
                id: 0,
                options: {
                    icon: imgs.imHereBlue,
                    draggable: false,
                    animation : google.maps.Animation.BOUNCE
                },
                position: new google.maps.LatLng(32.0852999 , 34.78176759999997),// NOTE: pos.coords.latitude, pos.coords.longitude
                map: map,

                title: "My Location"
            });
            $scope.myLocation = myLocation;
            $scope.myLocation.addListener('dragend', function(marker, eventName, args) {
                map.setZoom(map.zoom);
                map.setCenter(this.getPosition());
                $http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng='+this.getPosition().lat()+','+this.getPosition().lng() +'&key=AIzaSyCHQ31H0pHcnqIc0U-WBXx1I5nJAoQM4kA').success(function(jsn){
                    $scope.chosenLocation = {
                        formatted_address : jsn.results[0].formatted_address, //+ event.latLng.lat() + 'Longitude: ' + event.latLng.lng()+
                        number : jsn.results[0].address_components[0].short_name,
                        street : jsn.results[0].address_components[1].short_name,
                        city : jsn.results[0].address_components[2].short_name,
                        country : jsn.results[0].address_components[4].short_name
                    }
                    console.log('returnd info: '+jsn.results[0].formatted_address);
                });
            });
        // });
        // console.log(map);
        // $scope.map = map;
        // $scope.myLocation.
        $scope.continue = function() {
            $state.go('menu.out', $scope.chosenLocation)
            // $state.go('menu.mapOUT', $scope.formOutParams);
        }
    };
}])


.controller('availabeParkingCtrl', ['$scope', '$state', '$http', '$stateParams', '$ionicLoading', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $state, $http, $stateParams, $ionicLoading) {
    // console.log($stateParams);
    // ionic.Platform.ready(initialize);
    console.log(tempMyLocation.name);
        $scope.init = function(){
            console.log($stateParams); // NOTE: =>send to server  $http.get('fromServer').success(function(parkingJson){locations = parkingJson;});
            var locations = [
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

            var myLatlng = new google.maps.LatLng(32.3000, 12.4833);

            var mapOptions = {
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                disableDefaultUI: true,
                showTraficLayer:true,
                center: myLatlng,
                zoom: 17,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            var map = new google.maps.Map(document.getElementById("mapAvblParking"), mapOptions);
            var geocoder = new google.maps.Geocoder();
                geocoder.geocode({'address' : 'telAviv,ISRAEL'}, function(results, status){
                        console.log(results[0].geometry.location.lat() , results[0].geometry.location.lng());
                })
            // navigator.geolocation.getCurrentPosition(function(pos) {
            $scope.myLocation;
            $scope.markers=[];
            map.setCenter(new google.maps.LatLng(32.0852999 , 34.78176759999997)); // NOTE: pos.coords.latitude, pos.coords.longitude
            var myLocation = new google.maps.Marker({
                id: 0,
                options: {
                    icon: imgs.imHereBlue,
                    draggable: false,
                    animation : google.maps.Animation.BOUNCE

                },
                position: new google.maps.LatLng(32.0852999 , 34.78176759999997),// NOTE: pos.coords.latitude, pos.coords.longitude
                map: map,

                title: "My Location"
            });
            locations.forEach(function(location) {
                console.log(location);
                var tempLatLng = new google.maps.LatLng(location.lat, location.lng);
                var tempMarker = new google.maps.Marker({
                    id: $scope.markers.length+1,
                    options: {
                        icon: imgs.markerGreen,
                        draggable: false,
                        animation : google.maps.Animation.DROP
                    },
                    position: new google.maps.LatLng(location.lat, location.lng),// NOTE: pos.coords.latitude, pos.coords.longitude
                    map: map,
                    title: "My Location"
                });
                var infowindow = new google.maps.InfoWindow({
                    content: 'Latitude: ' + location.lat + '<br>Longitude: ' + location.lng
                })
                google.maps.event.addListener(tempMarker, 'click', function(event) {
                    infowindow.open(map,tempMarker);
                    console.log('mouseEvent!');
                });
                $scope.markers.push(tempMarker)

            });

            $scope.myLocation = myLocation;

            // $scope.myLocation.addListener('dragend', function(marker, eventName, args) {
            //     map.setZoom(map.zoom);
            //     map.setCenter(this.getPosition());
            //     $http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng='+this.getPosition().lat()+','+this.getPosition().lng() +'&key=AIzaSyCHQ31H0pHcnqIc0U-WBXx1I5nJAoQM4kA').success(function(jsn){
            //         $scope.chosenLocation = {
            //             formatted_address : jsn.results[0].formatted_address, //+ event.latLng.lat() + 'Longitude: ' + event.latLng.lng()+
            //             number : jsn.results[0].address_components[0].short_name,
            //             street : jsn.results[0].address_components[1].short_name,
            //             city : jsn.results[0].address_components[2].short_name,
            //             country : jsn.results[0].address_components[4].short_name
            //         }
            //         console.log('returnd info: '+jsn.results[0].formatted_address);
            //     });
            // });
        // });
        // console.log(map);
        // $scope.map = map;
        // $scope.myLocation.
        $scope.continue = function() {
            $state.go('menu.out', $scope.chosenLocation)
            // $state.go('menu.mapOUT', $scope.formOutParams);
        }
    };
}])


.controller('myProfileCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])

.controller('myHistoryCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {
    console.log($stateParams);

}])

.controller('signupCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {
    console.log($stateParams);

}])

.controller('mySmartiesCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])

.controller('mapINCtrl', ['$scope', '$state', '$http', '$stateParams', '$ionicLoading', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $state, $http, $stateParams, $ionicLoading) {
    // console.log($stateParams);
    // ionic.Platform.ready(initialize);
    // console.log(myLocation.name);
        $scope.init = function(){
        $scope.chosenLocation;
        var myLatlng = new google.maps.LatLng(32.3000, 12.4833);

        var mapOptions = {
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true,
            showTraficLayer:true,
            center: myLatlng,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var map = new google.maps.Map(document.getElementById("mapIN"), mapOptions);
        var geocoder = new google.maps.Geocoder();
            geocoder.geocode({'address' : 'telAviv,ISRAEL'}, function(results, status){
                    console.log(results[0].geometry.location.lat() , results[0].geometry.location.lng());
                })
        // navigator.geolocation.getCurrentPosition(function(pos) {
        $scope.myLocation;
            map.setCenter(new google.maps.LatLng(32.0852999 , 34.78176759999997)); // NOTE: pos.coords.latitude, pos.coords.longitude
            var myLocation = new google.maps.Marker({
                id: 0,
                options: {
                    icon: imgs.imHereBlue,
                    draggable: true,
                    animation : google.maps.Animation.BOUNCE

                },
                position: new google.maps.LatLng(32.0852999 , 34.78176759999997),// NOTE: pos.coords.latitude, pos.coords.longitude
                map: map,

                title: "My Location"
            });
            $scope.myLocation = myLocation;
            $scope.myLocation.addListener('dragend', function(marker, eventName, args) {
                map.setZoom(map.zoom);
                map.setCenter(this.getPosition());
                $http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng='+this.getPosition().lat()+','+this.getPosition().lng() +'&key=AIzaSyCHQ31H0pHcnqIc0U-WBXx1I5nJAoQM4kA').success(function(jsn){
                    $scope.chosenLocation = {
                        formatted_address : jsn.results[0].formatted_address, //+ event.latLng.lat() + 'Longitude: ' + event.latLng.lng()+
                        number : jsn.results[0].address_components[0].short_name,
                        street : jsn.results[0].address_components[1].short_name,
                        city : jsn.results[0].address_components[2].short_name,
                        country : jsn.results[0].address_components[4].short_name
                    }
                    console.log('returnd info: '+jsn.results[0].formatted_address);
                });
            });
        // });
        // console.log(map);
        // $scope.map = map;
        // $scope.myLocation.
        $scope.continue = function() {
            $state.go('menu.in', $scope.chosenLocation)
            // $state.go('menu.mapOUT', $scope.formOutParams);
        }
    };
}])


.controller('mapOUTCtrl', ['$scope', '$state', '$http', '$stateParams', '$ionicLoading', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $state, $http, $stateParams, $ionicLoading) {
    // console.log($stateParams);
    // ionic.Platform.ready(initialize);
        $scope.init = function(){
        $scope.chosenLocation;
        var myLatlng = new google.maps.LatLng(32.3000, 12.4833);

        var mapOptions = {
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true,
            showTraficLayer:true,
            center: myLatlng,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var map = new google.maps.Map(document.getElementById("mapOUT"), mapOptions);
        var geocoder = new google.maps.Geocoder();
            geocoder.geocode({'address' : 'telAviv,ISRAEL'}, function(results, status){
                    console.log(results[0].geometry.location.lat() , results[0].geometry.location.lng());
                })
        // navigator.geolocation.getCurrentPosition(function(pos) {
        $scope.myLocation;
            map.setCenter(new google.maps.LatLng(32.0852999 , 34.78176759999997)); // NOTE: pos.coords.latitude, pos.coords.longitude
            var myLocation = new google.maps.Marker({
                id: 0,
                options: {
                    icon: imgs.imHereBlue,
                    draggable: true,
                    animation : google.maps.Animation.BOUNCE

                },
                position: new google.maps.LatLng(32.0852999 , 34.78176759999997),// NOTE: pos.coords.latitude, pos.coords.longitude
                map: map,

                title: "My Location"
            });
            $scope.myLocation = myLocation;
            $scope.myLocation.addListener('dragend', function(marker, eventName, args) {
                map.setZoom(map.zoom);
                map.setCenter(this.getPosition());
                $http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng='+this.getPosition().lat()+','+this.getPosition().lng() +'&key=AIzaSyCHQ31H0pHcnqIc0U-WBXx1I5nJAoQM4kA').success(function(jsn){
                    $scope.chosenLocation = {
                        formatted_address : jsn.results[0].formatted_address, //+ event.latLng.lat() + 'Longitude: ' + event.latLng.lng()+
                        number : jsn.results[0].address_components[0].short_name,
                        street : jsn.results[0].address_components[1].short_name,
                        city : jsn.results[0].address_components[2].short_name,
                        country : jsn.results[0].address_components[4].short_name
                    }
                    console.log('returnd info: '+jsn.results[0].formatted_address);
                });
            });
        // });
        // console.log(map);
        // $scope.map = map;
        // $scope.myLocation.
        $scope.continue = function() {
            $state.go('menu.out', $scope.chosenLocation)
            // $state.go('menu.mapOUT', $scope.formOutParams);
        }
    };
}])
