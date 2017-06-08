var userDetails = {
	name: null,
	email: null,
	password: null,
	carId: null,
	smarties: 5
};

angular
.module('app.controllers', ['ionic.cloud', 'ionic', 'ngCordova', 'ngStorage'])

.run(function($http) {})

.controller('inCtrl', ['$scope', '$http', '$state', '$stateParams', '$location', '$localStorage', 'UserService', '$ionicLoading', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
		function($scope, $http, $state, $stateParams, $location, $localStorage, UserService, $ionicLoading) {
			// console.log($stateParams);
			$scope.location = {
				country: $stateParams.country,
				city: $stateParams.city,
				street: $stateParams.street,
				number: $stateParams.number,
				lat: $stateParams.lat,
				lng: $stateParams.lng
			}
			$scope.time = {
				d: null,
				t: null
			}
			$scope.booking = {
				time: $scope.time,
				distance: null,
				location: $scope.location,
				searcherId: 'hjhsdjhs'
			}
			// console.log($location.url() );// NOTE: needed to go back to previus state
			$scope.getInfoFromServer = function() {
				$ionicLoading.show({
					template: 'Loading..:)'
				});
				setTimeout(function() {
					console.log($scope.booking);
					$http
						.post('http://smartserver1.herokuapp.com/searchparking/', $scope.booking)
						.success(function(answer) {
							console.log(answer);
							$localStorage.answer = answer;
							console.log($localStorage.answer);
							$state.go('menu.availabeParking', {
								reload: true
							});
							$ionicLoading.hide();
						})
						.error(function(answer) {
							$ionicLoading.hide();
							console.log('can not post');
							console.log($scope.booking);
						});
				}, 500);
			};
		}
	])

.controller('outCtrl', ['$scope', '$http', '$state', '$stateParams', '$cordovaCamera', '$localStorage', '$ionicLoading', 'UserService', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
		function($scope, $http, $state, $stateParams, $cordovaCamera, $localStorage, $ionicLoading, UserService) {
			var emailPublisher = UserService.getUser().email;
			var reportParkCoords = {
				lat: $stateParams.lat,
				lng: $stateParams.lng
			};
			console.log(reportParkCoords);
			$localStorage.reportParkCoords = reportParkCoords;
			console.log($stateParams);
			$scope.size = {
				small: 0,
				medium: 1,
				large: 2,
				lengthParking: 3
			}
			$scope.location = {
				country: $stateParams.country,
				city: $stateParams.city,
				street: $stateParams.street,
				number: $stateParams.number,
				lat: $stateParams.lat,
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
			$scope.openCamera = function() {
				var options = {
					destinationType: Camera.DestinationType.FILE_URI,
					sourceType: Camera.PictureSourceType.CAMERA,
				};

				$cordovaCamera.getPicture(options).then(function(imageURI) {
					var image = document.getElementById('myImage');
					$scope.img = imageURI;
					// console.log($scope.img);
				}, function(err) {
					// error
				});
			}
			$scope.getInfoFromServer = function() {
				$ionicLoading.show({
					template: 'Loading in..:)'
				});
				setTimeout(function() {
					$http
						.post('http://smartserver1.herokuapp.com/addnewparking/', $scope.parking)//http://smartserver1.herokuapp.com/
						.success(function(answer) {
							console.log(answer);
							window.localStorage.setItem("repo", answer.id);
							console.log(window.localStorage.getItem("repo"));
							$state.go('menu.home',{reload: true});//
							window.location.reload(true); //NOTE this might be the solution for reduce map!
						})
						.error(function(answer) {
							$ionicLoading.hide();
							console.log('can not post');
							console.log($scope.parking);
						});
				}, 500);
			};
		}
	])

.controller('menuCtrl', ['$scope', '$stateParams', '$ionicLoading', '$ionicActionSheet', '$state', 'UserService', '$ionicAuth', '$localStorage', '$ionicPush', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
		function($scope, $stateParams, $ionicLoading, $ionicActionSheet, $state, UserService, $ionicAuth, $localStorage, $ionicPush) {
			var userN = UserService.getUser().givenName;
			console.log("user: " + userN);
			$scope.userName = userN;
			$scope.goHome = function() {
				$state.go('menu.home');
			}
			$scope.pushNotification = {
				checked: true
			};
			$scope.pushNotificationChange = function() {
				if ($scope.pushNotification.checked == true) {
					$ionicPush.register().then(function(t) {
						return $ionicPush.saveToken(t);
					}).then(function(t) {});
				}
				if ($scope.pushNotification.checked == false) {
					$ionicPush.unregister(function() {
						console.log('success');
					}, function() {
						console.log('error');
					});
					cordova.plugins.notification.local.cancel(10, function() {}, '');
				}
				console.log('Push Notification Change', $scope.pushNotification.checked);
			};
			$scope.googleLogOut = function() {
				var hideSheet = $ionicActionSheet.show({
					destructiveText: 'Logout',
					titleText: 'Are you sure you want to logout?',
					cancelText: 'Cancel',
					cancel: function() {},
					buttonClicked: function(index) {
						return true;
					},
					destructiveButtonClicked: function() {
						window.plugins.googleplus.logout(
							function(msg) {
								console.log(msg);
								var user = UserService.getUser();
								$ionicAuth.logout();
								$localStorage.flagMap = true;
								$state.go('login');
							},
							function(fail) {
								$localStorage.flagMap = true;
								$ionicAuth.logout();
								$state.go('login');
								console.log(fail);
							}
						);
					}
				});
			};
		}
	])

.controller('loginCtrl', ['$scope', '$stateParams', '$ionicLoading', '$ionicSideMenuDelegate', '$state', '$ionicPush', 'UserService', '$ionicAuth', '$ionicPopup', '$localStorage', '$ionicUser', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
		function($scope, $stateParams, $ionicLoading, $ionicSideMenuDelegate, $state, $ionicPush, UserService, $ionicAuth, $ionicPopup, $localStorage, $ionicUser) {
			$scope.formSignInParams = {
				email: $stateParams.email,
				password: $stateParams.password,
				gToken: null
			}
			if ($ionicAuth.isAuthenticated()) {
				$localStorage.flagMap = false;
				$state.go('menu.home');
			}
			$ionicPush
				.register()
				.then(function(t) {
					return $ionicPush.saveToken(t);
				})
				.then(function(t) {
					console.log('Token saved:', t.token);
				});
			document.addEventListener('deviceready', deviceReady, false);

			function deviceReady() {
				console.log('Device is ready!');
				window.plugins.googleplus.trySilentLogin({},
					function(obj) {
						UserService.setUser(obj);
						$localStorage.flagMap = false;
						$state.go('menu.home');
					},
					function(msg) {
						console.log("not success");
					}
				);
			}
			$scope.googleSignIn = function() {
				$ionicLoading.show({
					template: 'Logging in..:)'
				});
				window.plugins.googleplus.trySilentLogin({},
					function(obj) {
						UserService.setUser(obj);
						$state.go('menu.home');
						console.log(UserService.getUser().email);
						$ionicLoading.hide();
					},
					function(msg) {
						window.plugins.googleplus.login({},
							function(user_data) {
								//DAVID check if the user exist in DB(mongo)
								var emailToCheck = user_data.email;
								var register = false;
								UserService.setUser(user_data);
								if (!register) {
									$scope.data = {};
									var myPopup = $ionicPopup.show({
										template: '<input type="password" ng-model="data.numCar">',
										title: 'Enter Number of your car',
										subTitle: 'Please use normal things',
										scope: $scope,
										buttons: [{
												text: 'Cancel'
											},
											{
												text: '<b>Save</b>',
												type: 'button-positive',
												onTap: function(e) {
													if (!$scope.data.numCar) {
														e.preventDefault();
													} else {
														// $localStorage.password = "No need a password";
														// $localStorage.carId = $scope.data.numCar;
														console.log($scope.data.numCar);
														console.log(user_data.givenName + ": " + user_data.email + ": " + user_data.userId);
															userDetails = {
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
								if (register) {
									$state.go('menu.home');
								}
								$ionicLoading.hide();
							},
							function(msg) {
								$ionicLoading.hide();
							}
						);
					}
				);
			};
			$scope.signIn = function() {
				var emailU = $scope.formSignInParams.email.text;
				var details = {
					'email': $scope.formSignInParams.email.text,
					'password': $scope.formSignInParams.password
				};
				var userData = {
					givenName: emailU.substring(0, emailU.lastIndexOf("@")),
					email: emailU
				};
				UserService.setUser(userData);
				$ionicAuth.login('basic', details).then(function() {
					$state.go('menu.home');
				}, function(err) {
					console.log(err);
				});
			}
		}
	])

.controller('homeCtrl', ['$scope', '$state', '$http', '$stateParams', '$ionicLoading', '$ionicPopup', '$ionicPlatform', 'UserService', '$ionicActionSheet', '$timeout', '$localStorage', '$ionicPush', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
		function($scope, $state, $http, $stateParams, $ionicLoading, $ionicPopup, $ionicPlatform, UserService, $ionicActionSheet, $timeout, $localStorage, $ionicPush) {
			$scope.$on('cloud:push:notification', function(event, data) {
				var msg = data.message;
				alert(msg.title + ': ' + msg.text);
			});
			if ($localStorage.flagMap == true) {
				setTimeout(function() {
					window.location.reload(true);
				}, 200);
				$localStorage.flagMap = false;
			}
			$scope.init = function() {
				$ionicLoading.hide();
				var parkReportValue = $localStorage.reportParkCoords;
				if (parkReportValue == null) {
					$localStorage.reportPark = {
						lat: -86,
						lng: -86
					};
					console.log($localStorage.reportParkCoords);
				}
				if ($localStorage.flagChose == false) {
					var locSelect = {
						lat: -86,
						lng: -86
					};
					$localStorage.myChose = locSelect;
				}
				var location = {
					lat: 0,
					lng: 0
				}
				ionic.Platform.ready(function() {
					function getLocation(callback) {
						var options = {
							enableHighAccuracy: true,
							timeout: 10000,
							maximumAge: 30000
						};
						navigator.geolocation.getCurrentPosition(function(position) {
							var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
							var geocoder = new google.maps.Geocoder();
							var latitude = position.coords.latitude;
							var longitude = position.coords.longitude;
							var location = {
								lat: latitude,
								lng: longitude
							}
							callback(location);
						}, geolocationError, options);

						function geolocationError(error) {
							console.log('error');
							$ionicPopup.alert({
								title: "You need to Enable Location Services!!",
								subTitle: error.message,
								template: JSON.stringify(error)
							});
						}
					}
					getLocation(function(locationResult) {
						var myLatlng = new google.maps.LatLng(32.3000, 12.4833);
						var mapOptions = {
							mapTypeId: google.maps.MapTypeId.ROADMAP,
							disableDefaultUI: true,
							showTraficLayer: true,
							center: myLatlng,
							zoom: 16,
							mapTypeId: google.maps.MapTypeId.ROADMAP,
						};
						var map = new google.maps.Map(document.getElementById("mapHOME"), mapOptions);
						var geocoder = new google.maps.Geocoder();
						geocoder.geocode({
							'address': 'telAviv , ISRAEL'
						}, function(results, status) {
							console.log(results[0].geometry.location.lat(), results[0].geometry.location.lng());
						})
						$scope.myLocation;
						map.setCenter(new google.maps.LatLng(locationResult.lat, locationResult.lng)); // NOTE: pos.coords.latitude, pos.coords.longitude
						var myLocation = new google.maps.Marker({
							id: 0,
							options: {
								icon: imgs.imHereBlue,
								draggable: false,
								animation: google.maps.Animation.BOUNCE
							},
							position: new google.maps.LatLng(locationResult.lat, locationResult.lng), // NOTE: pos.coords.latitude, pos.coords.longitude
							map: map,

							title: "My Location"
						});
						$scope.myLocation = myLocation;

						document.addEventListener('deviceready', function() {
							if ($localStorage.flagChose == true) {
								var parkChosen = $localStorage.myChose;
								console.log(parkChosen);
								$scope.choseLocation;
								$ionicLoading.hide();
								if (parkChosen.lat != -86) {
									google.maps.event.addListener(map, 'dragend', function() {
										var choseLocation = new google.maps.Marker({
											id: 1,
											position: new google.maps.LatLng(parkChosen.lat, parkChosen.lng),
											map: map,
											icon: imgs.markerBlack
										});
										$scope.choseLocation = choseLocation;
										google.maps.event.addListener(choseLocation, 'click', function(event) {
											var hideSheet = $ionicActionSheet.show({
												buttons: [{
														text: 'Drive'
													},
													{
														text: 'Delete'
													}
												],
												titleText: '<b>Options</b>',
												cancelText: 'Back',
												cancel: function() {
													return true; // add cancel code..
												},
												buttonClicked: function(index) {
													if (index == 0) {
														var latToNavigate = $localStorage.myChose.lat,
															lngToNavigate = $localStorage.myChose.lng;
														console.log(latToNavigate + " : " + lngToNavigate);
														WazeLink.open('waze://?ll=' + latToNavigate + ',' + lngToNavigate);
													}
													if (index == 1) {

														var bookingId = $localStorage.answer.bookingId;
														var parkingId = $localStorage.choosenIdParking;
														var cancelDetails = {
															parkingId: parkingId,
															bookingId: bookingId
														};
														$http
															.post('http://smartserver1.herokuapp.com/cancelParking/', cancelDetails)
															.success(function(answer) {
																cordova.plugins.notification.local.cancel(10, function() {
																	// Notification was cancelled
																	console.log('notification is cancelled : ' + 10);
																}, '');
																$localStorage.flagChose = false;
																var locSelect = {
																	lat: -86,
																	lng: -86
																};
																$localStorage.myChose = locSelect;
																$ionicLoading.show({
																	template: 'Loading in..:)'
																});
																if ($localStorage.myChose.lat == -86) {
																	setTimeout(function() {
																		window.location.reload(true);
																	}, 300);
																}
															})
															.error(function(answer) {});
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
						var parkReport = $localStorage.reportParkCoords;
						$scope.parkReported;
						if (parkReport.lat != -86) {
							google.maps.event.addListener(map, 'dragend', function() {
								var parkReportedMarker = new google.maps.Marker({
									id: 2,
									position: new google.maps.LatLng(parkReport.lat, parkReport.lng),
									map: map,
									icon: imgs.markerBlue
								});
								$scope.parkReported = parkReportedMarker;
								google.maps.event.addListener(parkReportedMarker, 'click', function(event) {
									var hideSheet = $ionicActionSheet.show({
										buttons: [{
												text: 'show details'
											},
											{
												text: 'Delete'
											}
										],
										titleText: '<b>Options</b>',
										cancelText: 'Back',
										cancel: function() {
											return true; // add cancel code..
										},
										buttonClicked: function(index) {
											if (index == 0) {

											}
											if (index == 1) {
												var temp = window.localStorage.getItem("repo");
												var tempo = temp.toString();
												var reports = {
													parkingId: tempo
												};
												$http
													.post('http://smartserver1.herokuapp.com/deleteParking/', reports)
													.success(function(answer) {
														var reportCoords = {
															lat: -86,
															lng: -86
														};
														$localStorage.reportParkCoords = reportCoords;
														$ionicLoading.show({
															template: 'Loading in..:)'
														});
														if ($localStorage.reportParkCoords.lat == -86) {
															setTimeout(function() {
																window.location.reload(true);
															}, 300);
														}
													})
													.error(function(answer) {
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
							$http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + this.getPosition().lat() + ',' + this.getPosition().lng() + '&key=AIzaSyCHQ31H0pHcnqIc0U-WBXx1I5nJAoQM4kA').success(function(jsn) {
								$scope.chosenLocation = {
									formatted_address: jsn.results[0].formatted_address, //+ event.latLng.lat() + 'Longitude: ' + event.latLng.lng()+
									number: jsn.results[0].address_components[0].short_name,
									street: jsn.results[0].address_components[1].short_name,
									city: jsn.results[0].address_components[2].short_name,
									country: jsn.results[0].address_components[4].short_name,
									lat: jsn.results[0].geometry.location.lat,
									lng: jsn.results[0].geometry.location.lng
								}
								console.log('returnd info: ' + jsn.results[0].formatted_address);
							});

						});
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
		}
	])

.controller('availabeParkingCtrl', ['$scope', '$state', '$http', '$stateParams', '$ionicLoading', '$ionicActionSheet', '$timeout', '$ionicPopup', 'UserService', '$localStorage', 'sendPush', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
		function($scope, $state, $http, $stateParams, $ionicLoading, $ionicActionSheet, $timeout, $ionicPopup, UserService, $localStorage, sendPush) {
			console.log($localStorage);
			$scope.init = function() {
				console.log($localStorage.answer);
				var locations = $localStorage.answer.results;

				function getLocation(callback) {
					var options = {
						enableHighAccuracy: true,
						timeout: 10000,
						maximumAge: 30000
					};
					navigator.geolocation.getCurrentPosition(function(position) {
						var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
						var geocoder = new google.maps.Geocoder();
						var latitude = position.coords.latitude;
						var longitude = position.coords.longitude;
						var location = {
							lat: latitude,
							lng: longitude
						}
						callback(location);
					}, geolocationError, options);

					function geolocationError(error) {
						console.log('error');
						$ionicPopup.alert({
							title: "You need to Enable Location Services!!",
							subTitle: error.message,
							template: JSON.stringify(error)
						});
					}
				}
				getLocation(function(locationResult) {
					var myLatlng = new google.maps.LatLng(32.3000, 12.4833);

					var mapOptions = {
						mapTypeId: google.maps.MapTypeId.ROADMAP,
						disableDefaultUI: true,
						showTraficLayer: true,
						center: myLatlng,
						zoom: 17,
						mapTypeId: google.maps.MapTypeId.ROADMAP
					};

					var map = new google.maps.Map(document.getElementById("mapAvblParking"), mapOptions);
					var geocoder = new google.maps.Geocoder();
					geocoder.geocode({
						'address': 'telAviv,ISRAEL'
					}, function(results, status) {
						console.log(results[0].geometry.location.lat(), results[0].geometry.location.lng());
					})
					$scope.myLocation;
					$scope.markers = [];
					map.setCenter(new google.maps.LatLng(locationResult.lat, locationResult.lng)); // NOTE: pos.coords.latitude, pos.coords.longitude
					var myLocation = new google.maps.Marker({
						id: 0,
						options: {
							icon: imgs.imHereBlue,
							draggable: false,
							animation: google.maps.Animation.BOUNCE
						},
						position: new google.maps.LatLng(locationResult.lat, locationResult.lng), // NOTE: pos.coords.latitude, pos.coords.longitude
						map: map,
						title: "My Location"
					});
					locations.forEach(function(loc) {
						//    console.log(loc);
						console.log(loc);
						var tempLatLng = new google.maps.LatLng(loc.location.coords[0], loc.location.coords[1]);
						var tempMarker = new google.maps.Marker({
							id: $scope.markers.length + 1,
							options: {
								icon: imgs.markerGreen,
								draggable: false,
								animation: google.maps.Animation.DROP
							},
							position: new google.maps.LatLng(loc.location.coords[0], loc.location.coords[1]), // NOTE: pos.coords.latitude, pos.coords.longitude
							map: map,
							title: loc.description
						});
						var infowindow = new google.maps.InfoWindow({
							content: 'Latitude: ' + loc.location.coords[0] + '<br>Longitude: ' + loc.location.coords[1]
						})
						google.maps.event.addListener(tempMarker, 'click', function(event) {
							infowindow.open(map, tempMarker);
							var hideSheet = $ionicActionSheet.show({
								buttons: [{
										text: 'Details'
									},
									{
										text: 'Choose'
									},
									{
										text: 'Choose And Drive'
									}
								],
								titleText: '<b>Options</b>',
								cancelText: 'Back',
								cancel: function() {
									return true; // add cancel code..
								},
								buttonClicked: function(index) {
									console.log(index);
									if (index == 0) {
										var choseOccupied = loc.occupied;
										var statusChose;
										if (choseOccupied == false) {
											statusChose = "Availabe";
										}
										if (choseOccupied == true) {
											statusChose = "Occupied";
										}
										var alertPopup = $ionicPopup.alert({
											title: 'Details',
											template: 'Description: ' + loc.description + '<br>address: ' + loc.location.city + "," + loc.location.street + ',' + loc.location.number + '<br> time: ' + loc.time + '<br>occupied:' + statusChose
										});
									}
									if (index == 1) {
										var bookingId = $localStorage.answer.bookingId;
										var searchId = UserService.getUser().email;
										$localStorage.choosenIdParking = loc['id'];
										var chooseDetails = {
											searcherId: searchId,
											bookingId: bookingId,
											parkingId: $localStorage.choosenIdParking
										};
										$http
											.post('http://smartserver1.herokuapp.com/chooseParking/', chooseDetails)
											.success(function(answer) {
												$localStorage.flagChose = true;
												$ionicLoading.show({
													template: 'Loading...:)'
												});
												var now = new Date(),
													timeOfParking = new Date(loc.time);
												cordova.plugins.notification.local.schedule({
													id: 10,
													title: "Time to Parking",
													text: "Is occupied",
													at: timeOfParking,
													color: 'FF0000',
													data: {
														meetingId: "11"
													}
												});
												cordova.plugins.notification.local.on("click", function(notification) {
													if (notification.id == 10) {}
												});
												cordova.plugins.notification.local.on("trigger", function(notification) {
													if (notification.id != 10)
														return;
												});
												var locSelect = {
													lat: loc.location.coords[0],
													lng: loc.location.coords[1]
												};
												$localStorage.myChose = locSelect;
												if ($localStorage.myChose.lat != -86) {
													$timeout(function() {
														$state.go('menu.home', {}, {
															reload: true
														});
														// window.location.reload(true);
													}, 300);
												}
											})
											.error(function(answer) {
												console.log('can not post choose');
											});
									}
									if (index == 2) {}
									return true;
								},
							});
							$timeout(function() {
								hideSheet();
							}, 20000);
							console.log('mouseEvent!');
						});
						$scope.markers.push(tempMarker)
					});
					// $scope.myLocation = myLocation;
					$scope.continue = function() {
						$state.go('menu.out', $scope.chosenLocation)
					}
				});
			};
		}
	])

.controller('myProfileCtrl', ['$scope', '$stateParams', 'UserService', '$localStorage', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
		function($scope, $stateParams, UserService, $localStorage) {
			var userN = UserService.getUser().givenName;
			//get user details from server
			var userIdByEmail = {
				email: UserService.getUser().email
			};
			console.log(userIdByEmail);
			// NOTE: david need to handle this
			// $http
			// .post('http://localhost:8080/readUser/', userIdByEmail.email)
			// .success(function(answer) {
			// console.log(answer);
			//   })
			// .error(function(answer) {
			//       console.log('can not post');
			//       console.log(answer);
			//     });
			console.log("user: " + userN);
			$scope.email = UserService.getUser().email;
			$scope.password = $localStorage.password;
			$scope.carId = $localStorage.carId;
			$scope.userName = userN;

		}
	])

.controller('myHistoryCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
		function($scope, $stateParams) {
			console.log($stateParams);
			$scope.items = [{
					id: 1,
					location: 'even gvirol 12 tel aviv',
					time: '2017-03-08 14:20'
				},
				{
					id: 2,
					location: 'even gvirol 15 tel aviv',
					time: '2017-03-24 20:20'
				},
				{
					id: 3,
					location: 'alenbi 2 tel aviv',
					time: '2017-04-02 08:00'
				},
				{
					id: 4,
					location: 'oshiskin 12 tel aviv',
					time: '2017-05-01 21:00'
				},
				{
					id: 5,
					location: 'queen 380 hadera',
					time: '2017-01-18 10:15'
				}
			];
			$scope.items2 = [{
					id: 1,
					location: 'even gvirol 12 eilat',
					time: '2017-03-10 14:20'
				},
				{
					id: 2,
					location: 'even gvirol 15 eilat',
					time: '2017-03-30 20:20'
				},
				{
					id: 3,
					location: 'alenbi 2 eilat',
					time: '2017-04-29 08:00'
				},
				{
					id: 4,
					location: 'oshiskin 12 eilat',
					time: '2017-05-02 21:00'
				},
				{
					id: 5,
					location: 'queen 380 eilat',
					time: '2017-10-18 10:15'
				}
			];

		}
	])

.controller('MyCtrlSearchesHistory', ['$scope',
		function($scope) {
			$scope.data = {
				showDelete: false
			};
			$scope.onItemDelete = function(item) {

				$scope.items.splice($scope.items.indexOf(item), 1);

			}
		}
	])

.controller('MyCtrlReportsHistory', ['$scope',
		function($scope) {
			$scope.data = {
				showDelete: false
			};
			$scope.onItemDelete = function(item) {
				$scope.items2.splice($scope.items2.indexOf(item), 1);
			}
		}
	])

.controller('signupCtrl', ['$scope', '$state', '$stateParams', '$ionicAuth', '$ionicUser', 'UserService', '$localStorage', '$http', '$ionicPush', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
		function($scope, $state, $stateParams, $ionicAuth, $ionicUser, UserService, $localStorage, $http, $ionicPush) {
			$scope.formSignupParams = {
				name: $stateParams.name,
				email: $stateParams.email,
				password: $stateParams.password,
				carId: $stateParams.carId
			}
			$scope.signUp = function() {
				var userName = $scope.formSignupParams.name;
				var emailForm = $scope.formSignupParams.email.text;
				var password = $scope.formSignupParams.password;
				var carId = $scope.formSignupParams.carId;
				var details = {
					'email': emailForm,
					'password': password
				}
				var userData = {
					givenName: emailForm.substring(0, emailForm.lastIndexOf("@")),
					email: emailForm,
				};
				UserService.setUser(userData);
				$localStorage.password = password;
				$localStorage.carId = carId;
				$ionicAuth
					.signup(details)
					.then(function() {
						// `$ionicUser` is now registered
						//NOTE: DAVID send data to mongo
								userDetails = {
									name: userName,
									email: emailForm,
									password: password,
									carId: carId,
									smarties: 5
								};
								$http
									.post('http://smartserver1.herokuapp.com/createuser/', userDetails)
									.success(function(answer) {
										console.log(answer);

										$state.go('menu.home');
										return $ionicAuth.login('basic', details);
									})
									.error(function(answer) {
										console.log('can not post');
										console.log(answer);
									});
					}, function(err) {
						for (var e of err.details) {
							if (e === 'conflict_email') {
								alert('Email already exists.');
							} else {
								console.log(err.details); // handle other errors
							}
						}
					});
			};
		}
	])

.controller('mySmartiesCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
		function($scope, $stateParams) {}
	])

.controller('mapINCtrl', ['$scope', '$state', '$http', '$stateParams', '$ionicLoading', '$location', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
		function($scope, $state, $http, $stateParams, $ionicLoading, $location) {
			$scope.init = function() {
				$scope.chosenLocation;
				var myLatlng = new google.maps.LatLng(32.3000, 12.4833);
				var mapOptions = {
					mapTypeId: google.maps.MapTypeId.ROADMAP,
					disableDefaultUI: true,
					showTraficLayer: true,
					center: myLatlng,
					zoom: 16,
					mapTypeId: google.maps.MapTypeId.ROADMAP
				};
				var map = new google.maps.Map(document.getElementById("mapIN"), mapOptions);
				var geocoder = new google.maps.Geocoder();
				geocoder.geocode({
					'address': 'telAviv,ISRAEL'
				}, function(results, status) {
					console.log(results[0].geometry.location.lat(), results[0].geometry.location.lng());
				})
				$scope.myLocation;
				map.setCenter(new google.maps.LatLng(32.0852999, 34.78176759999997)); // NOTE: pos.coords.latitude, pos.coords.longitude
				var myLocation = new google.maps.Marker({
					id: 0,
					options: {
						icon: imgs.imHereBlue,
						draggable: true,
						animation: google.maps.Animation.BOUNCE

					},
					position: new google.maps.LatLng(32.0852999, 34.78176759999997), // NOTE: pos.coords.latitude, pos.coords.longitude
					map: map,
					title: "My Location"
				});
				$scope.myLocation = myLocation;
				$scope.myLocation.addListener('dragend', function(marker, eventName, args) {
					map.setZoom(map.zoom);
					map.setCenter(this.getPosition());
					$http
						.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + this.getPosition().lat() + ',' + this.getPosition().lng() + '&key=AIzaSyCHQ31H0pHcnqIc0U-WBXx1I5nJAoQM4kA')
						.success(function(jsn) {
							$scope.chosenLocation = {
								formatted_address: jsn.results[0].formatted_address, //+ event.latLng.lat() + 'Longitude: ' + event.latLng.lng()+
								number: jsn.results[0].address_components[0].short_name,
								street: jsn.results[0].address_components[1].short_name,
								city: jsn.results[0].address_components[2].short_name,
								country: jsn.results[0].address_components[4].short_name,
								lat: jsn.results[0].geometry.location.lat,
								lng: jsn.results[0].geometry.location.lng
							}
							console.log('returnd info: ' + jsn.results[0].formatted_address);
						});
				});
				$scope.continue = function() {
					$state.go('menu.in', $scope.chosenLocation)
				}
				$scope.goup = function() {
					$state.go('^', $scope.chosenLocation, {
						reload: true,
						notify: true
					})
				}
			};
		}
	])

.controller('mapOUTCtrl', ['$scope', '$state', '$http', '$stateParams', '$ionicLoading', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
		function($scope, $state, $http, $stateParams, $ionicLoading) {
			$scope.init = function() {
				$scope.chosenLocation;
				var myLatlng = new google.maps.LatLng(32.3000, 12.4833);
				var mapOptions = {
					mapTypeId: google.maps.MapTypeId.ROADMAP,
					disableDefaultUI: true,
					showTraficLayer: true,
					center: myLatlng,
					zoom: 16,
					mapTypeId: google.maps.MapTypeId.ROADMAP
				};
				var map = new google.maps.Map(document.getElementById("mapOUT"), mapOptions);
				var geocoder = new google.maps.Geocoder();
				geocoder.geocode({
					'address': 'telAviv,ISRAEL'
				}, function(results, status) {
					console.log(results[0].geometry.location.lat(), results[0].geometry.location.lng());
				})
				$scope.myLocation;
				map.setCenter(new google.maps.LatLng(32.0852999, 34.78176759999997)); // NOTE: pos.coords.latitude, pos.coords.longitude
				var myLocation = new google.maps.Marker({
					id: 0,
					options: {
						icon: imgs.imHereBlue,
						draggable: true,
						animation: google.maps.Animation.BOUNCE

					},
					position: new google.maps.LatLng(32.0852999, 34.78176759999997), // NOTE: pos.coords.latitude, pos.coords.longitude
					map: map,
					title: "My Location"
				});
				$scope.myLocation = myLocation;
				$scope.myLocation.addListener('dragend', function(marker, eventName, args) {
					map.setZoom(map.zoom);
					map.setCenter(this.getPosition());
					$http
						.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + this.getPosition().lat() + ',' + this.getPosition().lng() + '&key=AIzaSyCHQ31H0pHcnqIc0U-WBXx1I5nJAoQM4kA')
						.success(function(jsn) {
							$scope.chosenLocation = {
								formatted_address: jsn.results[0].formatted_address, //+ event.latLng.lat() + 'Longitude: ' + event.latLng.lng()+
								number: jsn.results[0].address_components[0].short_name,
								street: jsn.results[0].address_components[1].short_name,
								city: jsn.results[0].address_components[2].short_name,
								country: jsn.results[0].address_components[4].short_name,
								lat: jsn.results[0].geometry.location.lat,
								lng: jsn.results[0].geometry.location.lng
							}
							console.log('returnd info: ' + jsn.results[0].formatted_address);
						});
				});
				$scope.continue = function() {
					$state.go('menu.out', $scope.chosenLocation)
					// $state.go('menu.mapOUT', $scope.formOutParams);
				}
			};
		}
	])
