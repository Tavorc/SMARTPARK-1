angular.module('app.controllers', ['ionic.cloud' , 'ngCordova'])//'ionic.cloud'

.controller('sMARTInCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])

.controller('sMARTOutCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])

.controller('sMARTPARKCtrl', ['$scope', '$stateParams', '$ionicPush',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicPush, $ionicPopup) {
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

.controller('availableSMARTParksCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])

.controller('mapsExampleCtrl', ['$scope', 'uiGmapGoogleMapApi', function($scope, uiGmapGoogleMapApi) {
    // Do stuff with your $scope.
    // Note: Some of the directives require at least something to be defined originally!
    // e.g. $scope.markers = []

    // uiGmapGoogleMapApi is a promise.
    // The "then" callback function provides the google.maps object.
    uiGmapGoogleMapApi.then(function(maps, $cordovaGeolocation){
        // Configuration needed to display the road-map with traffic
        // Displaying Ile-de-france (Paris neighbourhood)

        $scope.map = {
            center: {
              latitude: -23.598763,
              longitude: -46.676547
            },
            zoom: 13,
            options: {
                mapTypeId: google.maps.MapTypeId.ROADMAP, // This is an example of a variable that cannot be placed outside of uiGmapGooogleMapApi without forcing of calling the google.map helper outside of the function
                streetViewControl: false,
                mapTypeControl: false,
                scaleControl: false,
                rotateControl: false,
                zoomControl: false
            },
            showTraficLayer:true
        };
    });

}])

// .controller('sMARTPARKLoginCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// // You can include any angular dependencies as parameters for this function
// // TIP: Access Route Parameters for your page via $stateParams.parameterName
// function ($scope, $stateParams) {
//
//
// }])

.controller('sMARTPARKLoginCtrl', ['$scope', '$state','$ionicLoading', '$ionicPush', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $state, $ionicLoading, $ionicPush) {
$scope.googleSignIn = function() {
    $ionicLoading.show({
      template: 'Logging in..:)'
    });
    window.plugins.googleplus.login(
      {},
      function (user_data) {
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
         $state.go('tabsController.sMARTPARK_tab2');
      },
      function (msg) {
      	 $ionicLoading.hide();
      }
    );
  };

  $ionicPush.register().then(function(t) {
  		return $ionicPush.saveToken(t);
			}).then(function(t) {
 				 console.log('Token saved:', t.token);
			});

}])

.controller('sMARTPARKSignupCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])

.controller('sMARTPARKOutCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
