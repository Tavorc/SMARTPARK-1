// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'app.controllers', 'app.routes', 'app.directives', 'app.services', 'uiGmapgoogle-maps', 'googlemaps.init', 'ionic.cloud', 'ngStorage', ])

	.config(function($ionicConfigProvider, $sceDelegateProvider, $ionicCloudProvider, $stateProvider, $urlRouterProvider) {
		$ionicCloudProvider.init({
			"core": {
				"app_id": "535bc8c5"
			},
			"auth": {
				"google": {
					"webClientId": "179352626651-3680v7qjrqh5flhvop3t37h974nqoton.apps.googleusercontent.com",
					"scope": ["permission1", "permission2"]
				}
			}
		});
		// $ionicConfigProvider.views.maxCache(0); NOTE: use it to Enable $state.go('^')
		$ionicCloudProvider.init({
			"core": {
				"app_id": "535bc8c5"
			},
			"push": {
				"sender_id": "1094228718719",
				"pluginConfig": {
					"ios": {
						"badge": true,
						"sound": true
					},
					"android": {
						"iconColor": "#343434"
					}
				}
			}
		});

		//$urlRouterProvider.otherwise('/reportsHistory');

		$sceDelegateProvider.resourceUrlWhitelist(['self', '*://www.youtube.com/**', '*://player.vimeo.com/video/**']);

	})

	.run(function($ionicPlatform, $ionicPopup, $localStorage, $http, $state) {
		$ionicPlatform.ready(function() {
			// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
			// for form inputs)
			cordova.plugins.notification.local.on("click", function(notification) {
				cordova.plugins.notification.local.cancel(notification.id, function() {
					// Notification was cancelled

					var confirmPopup = $ionicPopup.confirm({
						title: 'Time to parking',
						template: 'Is parking available?'
					});
					var selectedParking = $localStorage.chosenParking;
					confirmPopup.then(function(res) {
						if (res) {
							// if yes: incPoints(publisherId);
							$http
							.get(`http://localhost:8000/incPoints/${selectedParking.publisherId}/1`)
							//http://smartserver1.herokuapp.com/
							//http://localhost:8000/
							//https://smartparkil.herokuapp.com/
							.success(function(response) {
								console.log(`success: ${response}`);
								//DAVID tell to server that the parking is avialible and the publisher need to get 1 smartiz
								$http
								.get(`https://smartparkil.herokuapp.com/setParking/${selectedParking.parkingId}/false`)
								.success(function(obj) {$state.go('home')})
								.error(function(err) {throw err});
							})
							.error(function(answer) {
								console.log(`error while trying to update points!`);
							});

						} else {
							var myPopup = $ionicPopup.show({
								template: '<input type="text"  ng-model="data.carNum">',
								title: 'Enter Number of car',
								subTitle: 'Car that parking',
								scope: $scope,
								buttons: [{
										text: 'Cancel'
									},
									{
										text: '<b>Save</b>',
										type: 'button-positive',
										onTap: function(e) {
											if (!$scope.data.carNum) {
												e.preventDefault();
											} else {
												//you don't need to tell to server that the parking is not availible it's Obvious
												//DAVID send number car to server and check if the number is compatible with the number of the publisher car
												return $scope.data.carNum;
											}
										}
									}
								]
							});
							myPopup.then(answer => {
								var points = 1;
								if (answer != selectedParking.carId)
									points *= (-1);
								$http
								.get(`https://smartparkil.herokuapp.com/incPoints/${selectedParking.publisherId}/${points}`)
								//http://smartserver1.herokuapp.com/
								//http://localhost:8000/
								//https://smartparkil.herokuapp.com/
								.success(function(response) {
									console.log(`success: ${response}`);
									$state.go('home')
								})
								.error(function(answer) {
									console.log(`error while trying to update points!`);
								});
							})
						}
					});
					console.log('notification is cancelled : ' + notification.id);
				}, '');
			});
			if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
				cordova.plugins.Keyboard.disableScroll(true);
			}
			if (window.StatusBar) {
				// org.apache.cordova.statusbar required
				StatusBar.styleDefault();
			}
		});
	})

	/*
	  This directive is used to disable the "drag to open" functionality of the Side-Menu
	  when you are dragging a Slider component.
	*/
	.directive('disableSideMenuDrag', ['$ionicSideMenuDelegate', '$rootScope', function($ionicSideMenuDelegate, $rootScope) {
		return {
			restrict: "A",
			controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {

				function stopDrag() {
					$ionicSideMenuDelegate.canDragContent(false);
				}

				function allowDrag() {
					$ionicSideMenuDelegate.canDragContent(true);
				}

				$rootScope.$on('$ionicSlides.slideChangeEnd', allowDrag);
				$element.on('touchstart', stopDrag);
				$element.on('touchend', allowDrag);
				$element.on('mousedown', stopDrag);
				$element.on('mouseup', allowDrag);

			}]
		};
	}])

	/*
	  This directive is used to open regular and dynamic href links inside of inappbrowser.
	*/
	.directive('hrefInappbrowser', function() {
		return {
			restrict: 'A',
			replace: false,
			transclude: false,
			link: function(scope, element, attrs) {
				var href = attrs['hrefInappbrowser'];

				attrs.$observe('hrefInappbrowser', function(val) {
					href = val;
				});

				element.bind('click', function(event) {

					window.open(href, '_system', 'location=yes');

					event.preventDefault();
					event.stopPropagation();

				});
			}
		};
	});
