var userDetails={
            name: null,
            email: null,
            password: null,
            carId: null,
            smarties: 5
         };

angular.module('app.controllers', ['ionic.cloud', 'ionic', 'ngCordova', 'ngStorage'])

.run(function($http){
    //***INBAR***



})

.controller('inCtrl', ['$scope', '$http', '$state', '$stateParams', '$location', '$localStorage', 'UserService', '$ionicLoading', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $http, $state, $stateParams, $location, $localStorage, UserService, $ionicLoading) {
    console.log($stateParams);
    var formatDate = function(date, callback){
        $scope.booking.time = date.d.getFullYear() + "-" + (date.d.getMonth() + 1) + "-" + date.d.getDate() + " " + date.t.toLocaleTimeString();
        return callback ($scope.booking.time);
    };
    $scope.location = {
        country: $stateParams.country,
        city: $stateParams.city,
        street: $stateParams.street,
        number: $stateParams.number,
        lat:  $stateParams.lat,
        lng: $stateParams.lng
    }
    $scope.time = {
        d: null,
        t: null
    }
    $scope.booking = {
    time: $scope.time, //'2017-02-13 12:50:00',
    distance: null,
    location: $scope.location,
    searcherId: 'hjhsdjhs'
    // bookingId: null
    }
    // console.log($location.url() );// NOTE: needed to go back to previus state
    $scope.getInfoFromServer = function(){
           $ionicLoading.show({
          template: 'Loading..:)'
        });
setTimeout(function(){ 
        formatDate($scope.time, function(answer){
            console.log(answer);
            // $scope.booking.time = answer;
            // $scope.booking.time = formatDate($scope.time); // NOTE: async call doing problems!!!
            $http
            .post('http://smartserver1.herokuapp.com/searchparking/', $scope.booking)
            .success(function(answer){
                // console.log(answer);
                $localStorage.answer  = answer;
                console.log($localStorage.answer);
                $state.go('menu.availabeParking', {reload: true});
                $ionicLoading.hide();
            })
            .error(function(answer){
              $ionicLoading.hide();
                console.log('can not post');
                console.log($scope.booking);
                // console.log(formatDate($scope.booking.time.d, $scope.booking.time.t));
            });
        });
         }, 500);
    };
}])

.controller('outCtrl', ['$scope', '$http', '$state', '$stateParams', '$cordovaCamera', '$localStorage', '$ionicLoading', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $http, $state, $stateParams, $cordovaCamera, $localStorage, $ionicLoading) {
    var formatDate = function(date, callback){
        console.log(date);
        $scope.parking.time = date.d.getFullYear() + "-" + (date.d.getMonth() + 1) + "-" + date.d.getDate() + " " + date.t.toLocaleTimeString();
        return callback ($scope.parking.time);
    };

    var reportPark = {lat: $stateParams.lat, lng: $stateParams.lng};
    console.log(reportPark);
    $localStorage.reportPark=reportPark;

    console.log($stateParams);
    $scope.size = {
        small: 0,
        medium: 1,
        large: 2,
        lengthParking: 3
    }
    // console.log($scope.size);
    $scope.location = {
        country: $stateParams.country,
        city: $stateParams.city,
        street: $stateParams.street,
        number: $stateParams.number,
        lat:  $stateParams.lat,
        lng: $stateParams.lng
    }
    $scope.time = {
        d: null,
        t: null
    }
    $scope.parking = {
        time: $scope.time, //'2017-02-13 12:50:00',
        location: $scope.location,
        handicap: null,
        description: null,
        img: null,
        size: null,
        pubilsherId: null
    }
    $scope.openCamera = function(){
         var options = {
          destinationType: Camera.DestinationType.FILE_URI,
          sourceType: Camera.PictureSourceType.CAMERA,
        };

        $cordovaCamera.getPicture(options).then(function(imageURI) {
          var image = document.getElementById('myImage');
          $scope.img = imageURI;
          console.log($scope.img);
        }, function(err) {
          // error
        });
    }
    $scope.getInfoFromServer = function(){
       $ionicLoading.show({
            template: 'Loading in..:)'
            });
       setTimeout(function(){ 
        // // $http.post('https://smartserver1.herokuapp.com/addnewparking/',$scope.formInParams).success(function(answer){
        formatDate($scope.time, function(answer){
            console.log(answer);
            $http
            .post('https://smartserver1.herokuapp.com/addnewparking/', $scope.parking)
            .success(function(answer){
                 console.log(answer);
                $localStorage.answerReport  = answer.id;
                console.log("afterrrrrrrrrrrrrrrrrrrr"+ $localStorage.answerReport);
                  $state.go('menu.home', {reload: true});
                   window.location.reload(true);
            })
            .error(function(answer){
                console.log('can not post');
                console.log($scope.parking);
            });
        });
 }, 500);
    };
}])

.controller('menuCtrl', ['$scope', '$stateParams', '$ionicLoading', '$ionicActionSheet', '$state', 'UserService', '$ionicAuth', '$localStorage', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicLoading, $ionicActionSheet, $state, UserService, $ionicAuth, $localStorage) {
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
            $localStorage.flagMap=true;
            $state.go('login');
          },
          function(fail){
            $localStorage.flagMap=true;
        $ionicAuth.logout();
        $state.go('login');
        console.log(fail);
          }
        );
      }
    });
  };
}])

.controller('loginCtrl', ['$scope', '$stateParams','$ionicLoading', '$ionicSideMenuDelegate', '$state', '$ionicPush', 'UserService', '$ionicAuth', '$ionicPopup', '$localStorage', '$ionicUser', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicLoading, $ionicSideMenuDelegate, $state, $ionicPush, UserService, $ionicAuth, $ionicPopup, $localStorage, $ionicUser) {
    $scope.formSignInParams = {
    email : $stateParams.email,
    password : $stateParams.password,
    gToken: null
  }
      if ($ionicAuth.isAuthenticated()) {
          $localStorage.flagMap =false;
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
          $localStorage.flagMap =false;
            $state.go('menu.home');
            //console.log(JSON.stringify(obj));
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
                      //DAVID check if the user exist in DB(mongo)
                      var emailToCheck=user_data.email;
                      var register=false;
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
                                e.preventDefault();
                              } else {
                                $localStorage.password="No need a password";
                                $localStorage.carId = $scope.data.numCar;
                                console.log($scope.data.numCar);
                                console.log(user_data.givenName +": " + user_data.email +": " + user_data.userId );
                                userDetails={
                                              name: user_data.givenName,
                                              email: user_data.email,
                                              password: null,
                                              carId: $scope.data.numCar,
                                              smarties: 5
                                           };
                                           console.log(userDetails);
                                //DAVID send all this data  to server
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
}])

.controller('homeCtrl', ['$scope', '$state', '$http', '$stateParams', '$ionicLoading', '$ionicPopup', '$ionicPlatform', 'UserService', '$ionicActionSheet', '$timeout', '$localStorage', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $state, $http, $stateParams, $ionicLoading, $ionicPopup, $ionicPlatform, UserService, $ionicActionSheet, $timeout, $localStorage) {
        if($localStorage.flagMap == true){
          setTimeout(function() {
                  window.location.reload(true);
                              }, 200);
          $localStorage.flagMap =false;
        }
        $scope.init = function(){
          $ionicLoading.hide();
          var parkReportValue=$localStorage.reportPark;
          if(parkReportValue == null )
          {
            $localStorage.reportPark={lat:-86,lng:-86};
            console.log($localStorage.reportPark);
          }
          if($localStorage.flagChose == false)
          {
            var locSelect={lat: -86, lng:  -86};
            $localStorage.myChose=locSelect;
          }
         var  location={
                       lat:0,
                       lng:0
                       }
            ionic.Platform.ready(function(){
         function getLocation(callback){
                        var options = {
                        enableHighAccuracy: true,
                        timeout: 10000,
                          maximumAge: 30000
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
                           title: "You need to Enable Location Services!!",
                           subTitle: error.message,
                           template: JSON.stringify(error)
                            });
                        }
                     }
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

document.addEventListener('deviceready', function () {
if($localStorage.flagChose == true)
{
var parkChosen=$localStorage.myChose;
console.log(parkChosen);
$scope.choseLocation;
$ionicLoading.hide();
 if(parkChosen.lat != -86)
 {
  google.maps.event.addListener(map, 'dragend', function(){
          var choseLocation = new google.maps.Marker({
               id: 1,
               position: new google.maps.LatLng(parkChosen.lat , parkChosen.lng),
               map: map,
               icon:imgs.markerBlack
             });
          $scope.choseLocation = choseLocation;
  google.maps.event.addListener(choseLocation, 'click', function(event) {
                    var hideSheet = $ionicActionSheet.show({
                     buttons: [
                       { text: 'Drive' },
                       { text: 'Delete' }
                     ],
                     titleText: '<b>Options</b>',
                     cancelText: 'Back',
                     cancel: function() {
                         return true; // add cancel code..
                        },
                     buttonClicked: function(index) {
                        if(index == 0)
                        {
                          var latToNavigate=$localStorage.myChose.lat,lngToNavigate=$localStorage.myChose.lng;
                          console.log(latToNavigate + " : " + lngToNavigate);
                            WazeLink.open( 'waze://?ll=' + latToNavigate +','+ lngToNavigate);
                        }
                        if(index == 1)
                        {
                          
                            var bookingId=$localStorage.answer.bookingId;
                            var parkingId = $localStorage.choosenIdParking;
                            var cancelDetails= {parkingId: parkingId,bookingId: bookingId};
                               $http
                              .post('http://smartserver1.herokuapp.com/cancelParking/', cancelDetails)
                              .success(function(answer){
                                    cordova.plugins.notification.local.cancel(10, function () {
                                    // Notification was cancelled
                                        console.log('notification is cancelled : '+ 10);
                                        }, '');
                                  $localStorage.flagChose=false;
                                  var locSelect={lat: -86, lng:  -86};
                                 $localStorage.myChose=locSelect;
                                  $scope.choseLocation.setMap(null);
                                  choseLocation.setMap(null);
                                  $ionicLoading.show({
                                    template: 'Loading in..:)'
                                  });
                                 if($localStorage.myChose.lat == -86){
                                  setTimeout(function(){ 
                                   window.location.reload(true);
                                  }, 300);
                                  
                                 }
                                 
                              })
                              .error(function(answer){

                              });
                        }
                       return true;
                     },
                   });
                   $timeout(function() {
                     hideSheet();
                   }, 20000);
                });
      });
 }
}
}, false);
var parkReport=$localStorage.reportPark;
$scope.parkReported;
console.log(parkReport);
 if( parkReport.lat != -86){
  google.maps.event.addListener(map, 'dragend', function(){
          var  parkReportedMarker = new google.maps.Marker({
               id: 2,
               position: new google.maps.LatLng(parkReport.lat , parkReport.lng),
               map: map,
               icon:imgs.markerBlue
             });
          $scope.parkReported =  parkReportedMarker;
  google.maps.event.addListener(parkReportedMarker, 'click', function(event) {
                    var hideSheet = $ionicActionSheet.show({
                     buttons: [
                       { text: 'show details' },
                       { text: 'Delete' }
                     ],
                     titleText: '<b>Options</b>',
                     cancelText: 'Back',
                     cancel: function() {
                         return true; // add cancel code..
                        },
                     buttonClicked: function(index) {
                        if(index == 0) {
   
                        }
                        if(index == 1){
                              var reportCoords={lat: -86, lng:  -86};
                             $localStorage.reportPark=reportCoords;
                              $scope.parkReported.setMap(null);
                              parkReportedMarker.setMap(null);
                              $ionicLoading.show({
                                template: 'Loading in..:)'
                              });
                             if($localStorage.reportPark.lat == -86){
                              setTimeout(function(){ 
                               window.location.reload(true);
                              }, 300);
                             }
                        var reportId= {bookingId: $localStorage.answerReport};
                        console.log("report id : " + reportId);
                          $http
                          .post('http://smartserver1.herokuapp.com/deleteParking/',  reportId )
                          .success(function(answer){
                               console.log("After cancel : "+answer);
                          })
                          .error(function(answer){
                            $ionicLoading.hide();
                              console.log('can not post');
                          });

                        }
                       return true;
                     },
                   });
                   $timeout(function() {
                     hideSheet();
                   }, 20000);
                });
 });
}
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
                        country : jsn.results[0].address_components[4].short_name,
                        lat: jsn.results[0].geometry.location.lat,
                        lng: jsn.results[0].geometry.location.lng
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
      });
    };
}])

.controller('availabeParkingCtrl', ['$scope', '$state', '$http', '$stateParams', '$ionicLoading', '$ionicActionSheet', '$timeout', '$ionicPopup', 'UserService', '$localStorage',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $state, $http, $stateParams, $ionicLoading, $ionicActionSheet, $timeout, $ionicPopup, UserService, $localStorage) {
    console.log($localStorage);
        $scope.init = function(){
            console.log($localStorage.answer); // NOTE: =>send to server  $http.get('fromServer').success(function(parkingJson){locations = parkingJson;});
            var locations = $localStorage.answer.results;
  function getLocation(callback){
                        var options = {
                        enableHighAccuracy: true,
                        timeout: 10000,
                          maximumAge: 30000
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
                           title: "You need to Enable Location Services!!",
                           subTitle: error.message,
                           template: JSON.stringify(error)
                            });
                        }
                     }
            // var locations = [
            //     {lat: 32.085999, lng: 34.781555},
            //     {lat: 32.085234, lng: 34.781181},
            //     {lat: 32.085111, lng: 34.781124},
            //     {lat: 32.085588, lng: 34.781834},
            //     {lat: 32.085702, lng: 34.781968},
            //     {lat: 32.085264, lng: 34.781657},
            //     {lat: 32.085724, lng: 34.781905},
            //     {lat: 32.085685, lng: 34.781196},
            //     {lat: 32.085611, lng: 34.781222},
            //     // {lat: 32.085000, lng: 34.781667},
            //     // {lat: 32.085859, lng: 34.781708},
            //     // {lat: 32.085015, lng: 34.781858},
            //     // {lat: 32.085104, lng: 34.781299},
            //     // {lat: 32.085700, lng: 34.781187},
            //     // {lat: 32.085785, lng: 34.781978},
            //     // {lat: 32.085616, lng: 34.781119},
            //     // {lat: 32.085766, lng: 34.781692},
            //     // {lat: 32.085193, lng: 34.781218},
            //     // {lat: 32.085162, lng: 34.781694},
            //     // {lat: 32.085358, lng: 34.781506},
            //     // {lat: 32.085358, lng: 34.781315},
            //     // {lat: 32.085258, lng: 34.781000},
            //     {lat: 32.085792, lng: 34.781352}
            // ];
getLocation (function(locationResult){
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
            locations.forEach(function(loc) {
            //    console.log(loc);
             console.log(loc); 
                var tempLatLng = new google.maps.LatLng(loc.location.coords[0], loc.location.coords[1]);
                var tempMarker = new google.maps.Marker({
                    id: $scope.markers.length+1,
                    options: {
                        icon: imgs.markerGreen,
                        draggable: false,
                        animation : google.maps.Animation.DROP
                    },
                    position: new google.maps.LatLng(loc.location.coords[0], loc.location.coords[1]),// NOTE: pos.coords.latitude, pos.coords.longitude
                    map: map,
                    title: loc.description
                });
                var infowindow = new google.maps.InfoWindow({
                    content: 'Latitude: ' + loc.location.coords[0] + '<br>Longitude: ' + loc.location.coords[1]
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
                          var choseOccupied=loc.occupied;
                          var statusChose;
                             if( choseOccupied == false)
                          {
                              statusChose="Availabe";
                          }
                           if(choseOccupied == true)
                          {
                            statusChose="Occupied";
                          }
                           var alertPopup = $ionicPopup.alert({
                             title: 'Details',
                             template: 'Description: '+ loc.description + '<br>address: '+ loc.location.city+","+loc.location.street +','+ loc.location.number + '<br> time: ' + loc.time+ '<br>occupied:'+ statusChose
                           });
                        }
                        if(index == 1)
                        {
                          
                        
                        //INBAR You need to update the db that the parking is occupied
                        var bookingId=$localStorage.answer.bookingId;
                        var searchId= UserService.getUser().email;
                        $localStorage.choosenIdParking=loc['id'];
                        var chooseDetails={searcherId: searchId,bookingId: bookingId,parkingId: $localStorage.choosenIdParking};

                                   $http
                              .post('http://smartserver1.herokuapp.com/chooseParking/', chooseDetails)
                              .success(function(answer){
                                      $localStorage.flagChose=true;
                                      $ionicLoading.show({
                                        template: 'Loading...:)'
                                      });
                                       var now = new Date(),timeOfParking = new Date(loc.time);
                                       console.log(timeOfParking);
                                       console.log(now);
                                            cordova.plugins.notification.local.schedule(
                                            {
                                            id: 10,
                                            title: "Time to Parking",
                                            text: "Is occupied",
                                            at: timeOfParking,
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
                                            var locSelect={lat: loc.location.coords[0], lng:  loc.location.coords[1]};
                                            $localStorage.myChose=locSelect;
                                            if($localStorage.myChose.lat != -86){
                                               $timeout(function() {
                                                $state.go('menu.home', {}, { reload: true});
                                              window.location.reload(true);
                                               }, 300);
                                            }
                              })
                              .error(function(answer){
                                  console.log('can not post choose');
                              });

                        }
                        if(index == 2){
                        }
                       return true;
                     },
                   });
                   //NOTE????=>// For example's sake, hide the sheet after two seconds
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
        });
    };
}])


.controller('myProfileCtrl', ['$scope', '$stateParams', 'UserService', '$localStorage', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, UserService, $localStorage) {
var userN=UserService.getUser().givenName;
//get user details from server
console.log("user: " + userN);
  $scope.email=UserService.getUser().email;
  $scope.password=$localStorage.password;
  $scope.carId=$localStorage.carId;
  $scope.userName=userN;

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

.controller('signupCtrl', ['$scope', '$state', '$stateParams', '$ionicAuth', '$ionicUser','UserService', '$localStorage', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $state, $stateParams, $ionicAuth, $ionicUser, UserService, $localStorage) {
    console.log($stateParams);
    $scope.formSignupParams = {
    name : $stateParams.name,
    email : $stateParams.email,
    password : $stateParams.password,
    carId : $stateParams.carId
  }
    $scope.signUp = function() {
 var userName=$scope.formSignupParams.name;     
var emailForm=$scope.formSignupParams.email.text;
var password=$scope.formSignupParams.password;
var carId= $scope.formSignupParams.carId;
  var details={'email': emailForm, 'password':  password}
          var userData ={
            givenName:  emailForm.substring(0, emailForm.lastIndexOf("@")),
            email:emailForm,
          } ;
          UserService.setUser(userData);
          $localStorage.password=password;
          $localStorage.carId = carId;
  $ionicAuth.signup(details).then(function() {
  // `$ionicUser` is now registered
        //DAVID send data to mongo
     userDetails={
                  name: userName,
                  email: emailForm,
                  password: password,
                  carId: carId,
                  smarties: 5
                };
     setTimeout(function(){ 
        $state.go('menu.home');
      }, 300);
      
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

.controller('mapINCtrl', ['$scope', '$state', '$http', '$stateParams', '$ionicLoading', '$location',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $state, $http, $stateParams, $ionicLoading, $location) {
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
                        country : jsn.results[0].address_components[4].short_name,
                        lat: jsn.results[0].geometry.location.lat,
                        lng: jsn.results[0].geometry.location.lng
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
        $scope.goup = function() {
            $state.go('^', $scope.chosenLocation, {reload: true, notify:true})
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
                        country : jsn.results[0].address_components[4].short_name,
                        lat: jsn.results[0].geometry.location.lat,
                        lng: jsn.results[0].geometry.location.lng
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
