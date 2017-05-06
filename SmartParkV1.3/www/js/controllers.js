
angular.module('app.controllers', ['ionic.cloud', 'ionic', 'ngCordova', 'ngStorage'])

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
    var test = {
        time: '2017-02-13 12:50:10',
        // reporter_id: 1,
        diff: 84,
        // street: 2,
        // number: 3,
        // city: 'tempChosenLocation',
        // img: 'string',
        lat: 12,
        lng: 30
        // description: 'test'
    }
    $scope.getInfoFromServer = function(){
        // $http.post('https://smartserver1.herokuapp.com/addnewparking/',$scope.formInParams).success(function(answer){
        $http.post('https://smartserver1.herokuapp.com/searchparking/',test).success(function(answer){
            console.log(answer);
            $state.go('menu.availabeParking', answer);
        });
        // $state.go('menu.availabeParking', $scope.formInParams);
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

.controller('menuCtrl', ['$scope', '$stateParams', '$ionicLoading', '$ionicActionSheet', '$state', 'UserService', '$ionicAuth', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, UserService, $ionicActionSheet, $state, UserService, $ionicAuth) {
var userN=UserService.getUser().givenName;
console.log("user: " + userN);
  $scope.userName=userN;
  $scope.goHome = function()
  {
    $state.go('menu.home');
  }
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
            var user = UserService.getUser();
            $ionicAuth.logout();
            $state.go('login');
          },
          function(fail){
        $ionicAuth.logout();
        $state.go('login');
        console.log(fail);
          }
        );
      }
    });
  };
}])

.controller('loginCtrl', ['$scope', '$stateParams','$ionicLoading', '$ionicSideMenuDelegate', '$state', '$ionicPush', 'UserService', '$ionicAuth', '$ionicPopup', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicLoading, $ionicSideMenuDelegate, $state, $ionicPush, UserService, $ionicAuth, $ionicPopup) {
    $scope.formSignInParams = {
    email : $stateParams.email,
    password : $stateParams.password,
    gToken: null
  }

  if ($ionicAuth.isAuthenticated()) {
    $state.go('menu.home');
    }
document.addEventListener('deviceready', deviceReady, false);
function deviceReady() {
    console.log('Device is ready!');
     window.plugins.googleplus.trySilentLogin(
         {
         },
        function (obj) {
          UserService.setUser(obj);
            $state.go('menu.home');
            //console.log(JSON.stringify(obj));
            var dataU=UserService.getUser();
        },
        function (msg)
         {
          console.log("not success");
        }
      );
  }
 $scope.googleSignIn = function() {
        $ionicLoading.show({
          template: 'Logging in..:)'
        });
         window.plugins.googleplus.trySilentLogin(
         {
         },
        function (obj) {
           UserService.setUser(obj);
            $state.go('menu.home');
            //console.log(JSON.stringify(obj));
            console.log(UserService.getUser().email);
            $ionicLoading.hide();
        },
        function (msg)
         {
             window.plugins.googleplus.login(
                  {
                  },
                    function (user_data) {
                      //DAVID check if the user appear in DB(mongo)
                      var emailToCheck=user_data.email;
                      var register=true;
                   // console.log(user_data);
                    UserService.setUser(user_data);
                    if(!register)
                    {
                       $scope.data = {};
                      var myPopup = $ionicPopup.show({
                        template: '<input type="password" ng-model="data.numCar">',
                        title: 'Enter Number of your car',
                        subTitle: 'Please use normal things',
                        scope: $scope,
                        buttons: [
                          { text: 'Cancel' },
                          {
                            text: '<b>Save</b>',
                            type: 'button-positive',
                            onTap: function(e) {
                              if (!$scope.data.numCar) {
                                //don't allow the user to close unless he enters wifi password
                                e.preventDefault();
                              } else {
                                console.log($scope.data.numCar);
                                $state.go('menu.home');
                                return $scope.data.numCar;
                              }
                            }
                          }
                        ]
                      });
                    }
                    if(register)
                    {
                      $state.go('menu.home');
                      console.log(UserService.getUser().email);
                    }
                    $ionicLoading.hide();
                  },
                  function (msg) {
                     $ionicLoading.hide();
                  }
                );
        }
      );
    };
      $scope.signIn = function()
      {
          var details = {'email': $scope.formSignInParams.email.text, 'password': $scope.formSignInParams.password};
          var emailU=$scope.formSignInParams.email.text;
          var userData ={
            givenName:  emailU.substring(0, emailU.lastIndexOf("@")),
            email: emailU
          } ;
          UserService.setUser(userData);
          $ionicAuth.login('basic', details).then(function() {

             $state.go('menu.home');
            }, function(err) {
              console.log(err);
            });
      }
     $ionicPush.register().then(function(t) {
      return $ionicPush.saveToken(t);
      }).then(function(t) {
         console.log('Token saved:', t.token);
      });
}])

.controller('homeCtrl', ['$scope', '$state', '$http', '$stateParams', '$ionicLoading', '$ionicPopup', '$ionicPlatform', 'UserService', 'StorageService', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $state, $http, $stateParams, $ionicLoading, $ionicPopup, $ionicPlatform, UserService, StorageService) {
       $scope.$on('cloud:push:notification', function(event, data) {
  var msg = data.message;
    alert(msg.title + ': ' + msg.text);
  });

        $scope.init = function(){
         var  location={
                       lat:0,
                       lng:0
                       }
         function getLocation(callback)
                 {
                        var options = {
                        enableHighAccuracy: true,
                        timeout: 5000,
                          maximumAge: 0
                         };
                      navigator.geolocation.getCurrentPosition(function(position)
                         {
                            var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                            var geocoder = new google.maps.Geocoder();
                            var  latitude=position.coords.latitude;
                            var longitude=position.coords.longitude;
                            var  location={
                                lat:latitude,
                                lng:longitude
                              }
                              callback(location);
                         }, geolocationError, options);
                        function geolocationError(error)
                         {
                            console.log('error');
                           $ionicPopup.alert({
                           title: "Error Location",
                           subTitle: error.message,
                           template: JSON.stringify(error)
                            });
                        }
                     }
        $scope.chosenLocation;
        getLocation (function(locationResult){
        var myLatlng = new google.maps.LatLng(32.3000, 12.4833);
        var mapOptions = {
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true,
            showTraficLayer:true,
            center: myLatlng,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
        };
        var map = new google.maps.Map(document.getElementById("mapHOME"), mapOptions);
        var geocoder = new google.maps.Geocoder();
            geocoder.geocode({'address' : 'telAviv , ISRAEL'}, function(results, status){
                    console.log(results[0].geometry.location.lat() , results[0].geometry.location.lng());
                })
        // navigator.geolocation.getCurrentPosition(function(pos) {
        $scope.myLocation;
            map.setCenter(new google.maps.LatLng(locationResult.lat , locationResult.lng)); // NOTE: pos.coords.latitude, pos.coords.longitude
            var myLocation = new google.maps.Marker({
                id: 0,
                options: {
                    icon: imgs.imHereBlue,
                    draggable: false,
                    animation : google.maps.Animation.BOUNCE
                },
                position: new google.maps.LatLng(locationResult.lat , locationResult.lng),// NOTE: pos.coords.latitude, pos.coords.longitude
                map: map,

                title: "My Location"
            });
            $scope.myLocation = myLocation;
            //NOTE: this function center the map around the main marker
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
        // }); NOTE: end of navigator
        // console.log(map);
        // $scope.map = map;
        // $scope.myLocation.
        $scope.continue = function() {
            $state.go('menu.out', $scope.chosenLocation)
            // $state.go('menu.mapOUT', $scope.formOutParams);
        }
        });
    };


}])

.controller('availabeParkingCtrl', ['$scope', '$state', '$http', '$stateParams', '$ionicLoading', '$ionicActionSheet', '$timeout', '$ionicPopup', 'UserService', 'StorageService',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $state, $http, $stateParams, $ionicLoading, $ionicActionSheet, $timeout, $ionicPopup, UserService, StorageService) {
    // console.log($stateParams);
    // ionic.Platform.ready(initialize);
    console.log(tempMyLocation.name);
        $scope.init = function(){
            console.log($stateParams); // NOTE: =>send to server  $http.get('fromServer').success(function(parkingJson){locations = parkingJson;});

            // var locations = $stateParams;
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
               // console.log(location);
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
                    var hideSheet = $ionicActionSheet.show({
                     buttons: [
                       { text: 'Details' },
                       { text: 'Choose'  },
                       { text: 'Choose And Drive' }
                     ],
                     titleText: '<b>Options</b>',
                     cancelText: 'Back',
                     cancel: function() {
                         return true; // add cancel code..
                        },
                     buttonClicked: function(index) {
                        console.log(index);
                        if(index == 0)
                        {
                           var alertPopup = $ionicPopup.alert({
                             title: 'Details',
                             template: 'number: 24<br>street: Ibn Gavirol <br> city: Tel Aviv<br>country: Israel <br>Time: 15:00<br>Date: 15/03/2017<br>Comments: hello'
                           });
                        }
                        if(index == 1)
                        {
                                var now = new Date().getTime(),_5_sec_from_now = new Date(now + 20 * 1000);
                                cordova.plugins.notification.local.schedule(
                                {
                                id: 10,
                                title: "Time to Parking",
                                text: "Is occupied",
                                at: _5_sec_from_now,
                                color: 'FF0000',
                                data: { meetingId:"11" }
                               });
                                cordova.plugins.notification.local.on("click", function (notification)
                                 {
                                if (notification.id == 10) {
                                }
                                });
                                cordova.plugins.notification.local.on("trigger", function (notification)
                                {
                                if (notification.id != 10)
                                    return;
                               });

                                var locSelect={lat: location.lat, lng:  location.lng};
                                StorageService.add(locSelect);
                                var chec=StorageService.getAll();
                                $state.go('menu.home');
                        }
                        if(index == 2)
                        {

                        }
                       return true;
                     },
                   });

                   // For example's sake, hide the sheet after two seconds
                   $timeout(function() {
                     hideSheet();
                   }, 20000);
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
        // }); NOTE: end of navigator
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
     $scope.items = [
    {id:1, location:'even gvirol 12 tel aviv' , time:'2017-03-08 14:20'},
    {id:2, location:'even gvirol 15 tel aviv' , time:'2017-03-24 20:20'},
    {id:3, location:'alenbi 2 tel aviv' , time:'2017-04-02 08:00'},
    {id:4, location:'oshiskin 12 tel aviv' , time:'2017-05-01 21:00'},
    {id:5, location:'queen 380 hadera' , time:'2017-01-18 10:15'}
    ];
    $scope.items2 = [
    {id:1, location:'even gvirol 12 eilat' , time:'2017-03-10 14:20'},
    {id:2, location:'even gvirol 15 eilat' , time:'2017-03-30 20:20'},
    {id:3, location:'alenbi 2 eilat' , time:'2017-04-29 08:00'},
    {id:4, location:'oshiskin 12 eilat' , time:'2017-05-02 21:00'},
    {id:5, location:'queen 380 eilat' , time:'2017-10-18 10:15'}
    ];

}])
.controller('MyCtrlSearchesHistory', function($scope) {

   $scope.data = {
    showDelete: false
  };
  $scope.onItemDelete = function(item) {

    $scope.items.splice($scope.items.indexOf(item), 1);

}
})

.controller('MyCtrlReportsHistory', function($scope) {

   $scope.data = {
    showDelete: false
  };
  $scope.onItemDelete = function(item) {

    $scope.items2.splice($scope.items2.indexOf(item), 1);

}
})

.controller('signupCtrl', ['$scope', '$state', '$stateParams', '$ionicAuth', '$ionicUser', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $state, $stateParams, $ionicAuth, $ionicUser) {
    console.log($stateParams);
    $scope.formSignupParams = {
    name : $stateParams.name,
    email : $stateParams.email,
    password : $stateParams.password,
    carId : $stateParams.carId
  }
    $scope.signUp = function() {
        //send data to mongo DAVID
  var details={'email': $scope.formSignupParams.email.text, 'password':  $scope.formSignupParams.password}
   var emailU=$scope.formSignupParams.email.text;
          var userData ={
            givenName:  emailU.substring(0, emailU.lastIndexOf("@")),
            email:emailU
          } ;
          UserService.setUser(userData);
  $ionicAuth.signup(details).then(function() {
  // `$ionicUser` is now registered
  $state.go('menu.home');
  return $ionicAuth.login('basic', details);
    }, function(err) {
      for (var e of err.details) {
        if (e === 'conflict_email') {
          alert('Email already exists.');
        } else {
          console.log(err.details);// handle other errors
        }
      }
    });
    };
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

        google.maps.event.addListener(map, 'dragend', function(){
        var locationSelected=StorageService.getAll();
        if(locationSelected.lat != -86)
        {
          // map.setCenter(new google.maps.LatLng(locationSelected.lat , locationSelected.lng));
        $scope.markerChosen;
                    var markerChosen = new google.maps.Marker({
                    map: map,
                    icon: imgs.markerBlack,
                    position: new google.maps.LatLng(locationSelected.lat, locationSelected.lng)
                });
                $scope.markerChosen = markerChosen;
        }
        });

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
