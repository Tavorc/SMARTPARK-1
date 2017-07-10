var userDetails = {
	name: null,
	email: null,
	password: null,
	carId: null,
	smarties: 5
};

angular
	.module('app.controllers', ['ionic.cloud', 'ionic', 'ngCordova', 'ngStorage'])

	.controller('inCtrl', ['$scope', '$http', '$state', '$stateParams', '$location', '$localStorage', 'UserService', '$ionicLoading', 'd3TimeFormat', '$ionicPopup', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
		function($scope, $http, $state, $stateParams, $location, $localStorage, UserService, $ionicLoading, d3TimeFormat, $ionicPopup) {
			$scope.location = {
				country: $stateParams.country,
				city: $stateParams.city,
				street: $stateParams.street,
				number: $stateParams.number,
				lat: $stateParams.lat,
				lng: $stateParams.lng
			}
			// $scope.cancelInFunction =function(){
			// 		$state.go('menu.home');
			// };
			$scope.time = {
				d: null,
				t: null
			}
			$scope.booking = {
				time: $scope.time,
				distance: null,
				location: $scope.location,
				size: 0,
				searcherId: UserService.getUser().email
			}
			$localStorage.searchCoords={
 				lat:$scope.location.lat,
 				lng:$scope.location.lng
 			}
			$scope.smartiesAlert;
			// NOTE: error hendler is important!
			if($localStorage.userLoginData === undefined){
				console.error('Error: Can\'t load user login data!');
				$scope.smartiesAlert = {
					value : 5
				}
			}

			else{
				console.log($localStorage.userLoginData.smarties);
				$scope.smartiesAlert = {
					value:$localStorage.userLoginData.smarties
				}
			};


			// console.log($location.url() );// NOTE: needed to go back to previus state
			$scope.getInfoFromServer = function() {
				var confirmPopup = $ionicPopup.confirm({
					template: '<img id="smartiesImgAlert" src="./img/alerIcons.png" height="16" width="16" > <b>YOU HAVE: </b> <b id="boldSmarties" ng-model="smartiesAlert.value" >{{smartiesAlert.value}}<br>smarties</b><img id="smartiesImg" src="./img/circleSmarties.png" height="64" width="64" ><br> You are going to lose 1 smarties<br><br><b>DO YOU AGREE?</b>',
					cancelText: 'CANCEL',
					cancelType: 'button-dark',
					scope: $scope,
					okText: 'I AGREE',
					okType: 'button-calm'
				});
				confirmPopup.then(function(res) {
					if (res) {
						d3TimeFormat.toLocalDate($scope.time, (formatedTime) => {
							$scope.booking.time = formatedTime;
							$ionicLoading.show({
								template: 'Loading..:)'
							});
							setTimeout(function() {
								console.log($scope.booking);
								$http
									.post('https://smartparkil.herokuapp.com/searchparking/', $scope.booking)
									//http://smartserver1.herokuapp.com/searchparking/
									//http://localhost:8000/searchparking/
									//https://smartparkil.herokuapp.com/
									.success(function(answer) {
										// console.log(answer);
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
						});
						console.log('You are sure');
					} else {
						console.log('You are not sure');
					}
				});
			};
		}
	])

	.controller('outCtrl', ['$scope', '$http', '$state', '$stateParams', '$cordovaCamera', '$localStorage', '$ionicLoading', 'UserService', '$ionicPush', 'd3TimeFormat',
		function($scope, $http, $state, $stateParams, $cordovaCamera, $localStorage, $ionicLoading, UserService, $ionicPush, d3TimeFormat) {
			var publisherEmail = UserService.getUser().email;
			var reportParkCoords = {
				lat: $stateParams.lat,
				lng: $stateParams.lng
			};
			$scope.cancelInFunction =function(){
				//$localStorage.flagMap = true;
					$state.go('menu.home');
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
				time: $scope.time,
				location: $scope.location,
				handicapped: false,
				description: null,
				img: null, //NOTE: it will change if $scope.openCamera will be called.
				size: 0,
				publisherId: publisherEmail,
				publisherToken: null
			}
			$ionicPush
				.register()
				.then(function(t) {
					console.log(t);
					return $ionicPush.saveToken(t);
				})
				.then(function(t) {
					console.log('Token saved:', t.token);
					$scope.parking.publisherToken = t.token;
					return t.token;
				});

			// $scope.openCamera = function() {
			// 	var options = {
			// 		destinationType: Camera.DestinationType.FILE_URI,
			// 		sourceType: Camera.PictureSourceType.CAMERA,
			// 	};
			// 	$cordovaCamera.getPicture(options).then(function(imageURI) {
			// 		var image = document.getElementById('myImage');
			// 		// $scope.parking.img = imageURI;
			// 		// console.log($scope.img);
			// 	}, function(err) {
			// 		// error
			// 	});
			// }

			$localStorage.answerReporterDetails = $scope.parking;
			$scope.getInfoFromServer = function() {
				d3TimeFormat.toLocalDate($scope.time, (formatedTime) => {
					$scope.parking.time = formatedTime;
					$ionicLoading.show({
						template: 'Loading in..:)'
					});
					setTimeout(function() {
						$http
							.post('https://smartparkil.herokuapp.com/addnewparking/', $scope.parking)
							//http://smartserver1.herokuapp.com/addnewparking/
							//http://localhost:8000/addnewparking/
							//https://smartparkil.herokuapp.com/
							.success(function(answer) {
								console.log(answer);
								window.localStorage.setItem("repo", answer.id);
								console.log(window.localStorage.getItem("repo"));
								$state.go('menu.home', {
									reload: true
								}); //
								window.location.reload(true); //NOTE this might be the solution for reduce map!
							})
							.error(function(answer) {
								$ionicLoading.hide();
								console.log('can not post');
								console.log($scope.parking);
							});
					}, 500);
				})
			};
		}
	])

	.controller('menuCtrl', ['$scope', '$ionicPopup', '$stateParams', '$ionicLoading', '$ionicActionSheet', '$state', 'UserService', '$ionicAuth', '$localStorage', '$ionicPush', '$cordovaSocialSharing', '$ionicSideMenuDelegate',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
		function($scope, $ionicPopup, $stateParams, $ionicLoading, $ionicActionSheet, $state, UserService, $ionicAuth, $localStorage, $ionicPush, $cordovaSocialSharing, $ionicSideMenuDelegate) {

			var userN = UserService.getUser().givenName;

			console.log("user: " + userN);
			var today = new Date()
			var curHr = today.getHours()

			if (curHr < 12) {
				$scope.timeOfDay = "Morning";
			} else if (curHr < 18) {
				$scope.timeOfDay = "Afternoon";
			} else {
				$scope.timeOfDay = "Evening";
			}

			$scope.aboutFriend = function(){
				 $ionicSideMenuDelegate.toggleRight();
				 //$localStorage.flagMap = true;
				$state.go('menu.home');
				var alertPopup = $ionicPopup.alert({
					title: "About SmartPark",
					template: 'SmartPark is a social network for publish and find parking.<br>This project was developed as part of the final project at Shenkar by Inbar Takdim,David Avigad and Tavor Cohen. '
				});
			}

			$scope.userName = userN;
			$scope.goHome = function() {
				//$localStorage.flagMap = true;
				$state.go('menu.home');
			}
			$scope.pushNotification = {
				checked: true
			};
			$scope.inviteFriend = function() {
				$ionicSideMenuDelegate.toggleRight();
				var message = 'Hello, click into the link and download the app  ',
					subject = 'SmartPark Social Networking for Parking',
					link = 'www.smartpark.com',
					image = './img/logo.jpg',
					file = ['', ''];
				$cordovaSocialSharing
					.share(message, subject, file, link) // Share via native share sheet
					.then(function(result) {
						// Success!
					}, function(err) {
						// An error occured. Show a message to the user
					});
			};
			$scope.pushNotificationChange = function() {
				 $ionicSideMenuDelegate.toggleRight();
				var notificationAlert = "";
				if ($scope.pushNotification.checked == true) {
					$ionicPush.register().then(function(t) {
						return $ionicPush.saveToken(t);
					}).then(function(t) {});
					notificationAlert = "";
				}
				if ($scope.pushNotification.checked == false) {
					$ionicPush.unregister(function() {
						console.log('success');
					}, function() {
						console.log('error');
					});
					notificationAlert = "";
					cordova.plugins.notification.local.cancel(10, function() {}, '');
				}
				var alertPopup = $ionicPopup.alert({
					title: "Notifcations status changed",
					template: notificationAlert
				});

				alertPopup.then(function(res) {
					console.log('Thank you for not eating my delicious ice cream cone');
				});
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

	.controller('loginCtrl', ['$scope', '$stateParams', '$http', '$ionicLoading', '$ionicSideMenuDelegate', '$state', '$ionicPush', 'UserService', '$ionicAuth', '$ionicPopup', '$localStorage', '$ionicUser', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
		function($scope, $stateParams, $http, $ionicLoading, $ionicSideMenuDelegate, $state, $ionicPush, UserService, $ionicAuth, $ionicPopup, $localStorage, $ionicUser) {
				$scope.$on('cloud:push:notification', function(event, data) {
				var msg = data.message;
				//alert(msg.title + ': ' + msg.text);
					var alertPopup = $ionicPopup.alert({
						title: msg.text,
						});
			});
			$scope.formSignInParams = {
				email: $stateParams.email,
				password: $stateParams.password,
				gToken: null //NOTE @tavor is this variable necc?
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
						console.log(UserService.getUser());
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
						//$localStorage.flagMap = true;
						$state.go('menu.home');
						console.log(UserService.getUser().email);
					},
					function(msg) {
						window.plugins.googleplus.login({},
							function(user_data) {
								console.log(UserService.getUser());
								var register = false,
									emailToCheck = user_data.email,
									userPass = 'gtoken';
								$http
									.get('https://smartparkil.herokuapp.com/readUser/' + emailToCheck + '/' + userPass)
									//http://smartserver1.herokuapp.com/
									//http://localhost:8000/
									//https://smartparkil.herokuapp.com/
									.success(function(response) {
										console.log(response);
										if (!response) {
											$ionicLoading.hide();
											console.log('user not found');
											//then create new user:
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
																console.log($scope.data.numCar);
																console.log(user_data.givenName + ": " + user_data.email + ": " + user_data.userId);
																userDetails = {
																	name: user_data.givenName,
																	email: user_data.email,
																	password: userPass,
																	carId: $scope.data.numCar,
																	smarties: 5
																};
																$http
																	.post('https://smartparkil.herokuapp.com/createUser/', userDetails)
																	//http://smartserver1.herokuapp.com/
																	//http://localhost:8000/
																	//https://smartparkil.herokuapp.com/
																	.success(function(response) {
																		console.log(response);
																		console.log('user created');
																		$localStorage.userLoginData = userDetails;
																		var userData = {
																				givenName: user_data.givenName,
																				email: user_data.email
																			};
																		$localStorage.flagMap = true;
																		$state.go('menu.home');
																		return $scope.data.numCar; //if TRUE continue code needs to get here..
																	})
																	.error(function(answer) {
																		$ionicLoading.hide();
																		console.log('error while create user!')
																	});
															}
														}
													}
												]
											});
										} else {
											$ionicLoading.show({
												template: 'Logging in..:)'
											});
											$localStorage.userLoginData = response;
											console.log('user found! going home..');
											$localStorage.flagMap = true;
											$state.go('menu.home');
											//$ionicLoading.hide();
										}
									})
									.error(function(answer) {
										$ionicLoading.hide();
											$ionicPopup.alert({
												title: "Something wrong with this account",
											});
										console.log('error while read user!');
									});
									$ionicLoading.hide();
								UserService.setUser(user_data);
							},
							function(msg) {
								$ionicPopup.alert({
								title: "Something wrong with this account",
								});
								$ionicLoading.hide();
							}
						);
					}
				);
			};
			$scope.details ={
				email: null,
				password: null
			}
			$scope.signIn = function() {
				$ionicLoading.show({
					template: 'Logging in..:)'
				});
				if (($scope.details.email || $scope.details.password) === null || undefined){
					$ionicPopup.alert({
						title: 'Please insert correct email and password!',
					});
					$ionicLoading.hide();
					throw 'Please insert correct email and password!';
				}
				//formSignInParams
				var emailU = $scope.details.email;
				console.log($scope.details.email);
				var details = {
					'email': $scope.details.email,
					'password': $scope.details.password
				};
				console.log(details);
					$http
					.get('https://smartparkil.herokuapp.com/readUser/' + $scope.details.email + '/' + $scope.details.password)
					//http://smartserver1.herokuapp.com/
					//http://localhost:8000/
					//https://smartparkil.herokuapp.com/
					.success(function(response) {
						console.log(response);
						if (!response){
							$ionicLoading.hide();
								$ionicPopup.alert({
								title: `user ${$scope.details.email} not found`,
						});
							console.log(`user ${$scope.details.email} not found`);
						}
						else {
							console.log('user found! do some code here...');
							$localStorage.userLoginData = response;
							var userData = {
								givenName: emailU.substring(0, emailU.lastIndexOf("@")),
								email: emailU
							};
							UserService.setUser(userData);
							$ionicAuth.login('basic', details).then(function() {
								$localStorage.flagMap = true;
								$state.go('menu.home');
							}, function(err) {
								$ionicLoading.hide();
									$ionicPopup.alert({
									title: " Email or password is wrong",
								});
								console.log(err);
							});
						}
					})
					.error(function(answer) {
						$ionicLoading.hide();
						$ionicPopup.alert({
						title: "Email or password is wrong",
					});
						console.log('error while read user!');
					});
			}
			$ionicLoading.hide();
		}
	])

	.controller('homeCtrl', ['$scope', '$state', '$http', '$stateParams', '$ionicLoading', '$ionicPopup', '$ionicPlatform', 'UserService', '$ionicActionSheet', '$timeout', '$localStorage', '$ionicPush', '$cordovaLaunchNavigator', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
		function($scope, $state, $http, $stateParams, $ionicLoading, $ionicPopup, $ionicPlatform, UserService, $ionicActionSheet, $timeout, $localStorage, $ionicPush, $cordovaLaunchNavigator) {
				$ionicLoading.hide();
				$scope.$on('cloud:push:notification', function(event, data) {
				var msg = data.message;
				//alert(msg.title + ': ' + msg.text);
					var alertPopup = $ionicPopup.alert({
						title: msg.text,
						});
			});
			if ($localStorage.flagMap == true) {
				setTimeout(function() {
					window.location.reload(true);
				}, 200);
				$localStorage.flagMap = false;
			}
			console.log($localStorage);
			console.log(`$localStorage.userLoginData: ${$localStorage.userLoginData}`);

			// $scope.smarties = $localStorage.userLoginData.smarties;
			$scope.smarties = 5; // FIXME: just for test: s/b $localStorage.userLoginData.smarties;
			$scope.init = function() {

				$ionicLoading.hide();
				var parkReportValue = $localStorage.reportParkCoords;
				if (parkReportValue == null) {
					$localStorage.reportParkCoords = { // FIXME: what is it for?
						lat: -86,
						lng: -86
					};
					console.log($localStorage.reportParkCoords);
				}
				if ($localStorage.flagChose == false) {
					var locSelect = { // FIXME: what is it for?
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
						$localStorage.myLocationStore={
							lat: locationResult.lat,
							lng: locationResult.lng
						}
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
							console.log(`My Location: ${results[0].geometry.location.lat()}, ${results[0].geometry.location.lng()}`);
						})
						$scope.myLocation;
						$scope.centerMyLocation = function( ){
				map.setCenter(new google.maps.LatLng(locationResult.lat, locationResult.lng));
						}
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
								map.setCenter(new google.maps.LatLng(parkChosen.lat, parkChosen.lng));
								$scope.choseLocation;
								$ionicLoading.hide();
								if (parkChosen.lat != -86  ) {
									google.maps.event.addListener(map, 'bounds_changed', function() {
										var choseLocation = new google.maps.Marker({
											id: 1,
											position: new google.maps.LatLng(parkChosen.lat, parkChosen.lng),
											map: map,
											icon: "./img/parkChoose.png"
										});
								$scope.choseLocation = choseLocation;
										if($localStorage.flagActionSheet == true){
													var hideSheet = $ionicActionSheet.show({
												buttons: [{
														text: 'Drive'
													},
													{
														text: 'Show Details'
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
														// WazeLink.open('waze://?ll=' + latToNavigate + ',' + lngToNavigate);
														   var destination = [latToNavigate, lngToNavigate];
															var start = [locationResult.lat,locationResult.lng];
														    $cordovaLaunchNavigator.navigate(destination, start).then(function() {
														      console.log("Navigator launched");
														    }, function (err) {
														      console.error(err);
														    });
													}
													if (index == 1) {
														var detailsChoose = $localStorage.myChoseDetails;
														var alertPopup = $ionicPopup.alert({
															title: 'DETAILS',
															okType: 'button-calm',
															template: '<b>Description: </b>' + detailsChoose.Description + '<br><b>address: </b>' + detailsChoose.address + '<br><b>time: </b>' + detailsChoose.time + '<br><b>occupied: </b>' + detailsChoose.occupied + '<br><b>Handicapped: </b>' +detailsChoose.handicapp
														});
													}
													if (index == 2) {

														var bookingId = $localStorage.answer.bookingId;
														var parkingId = $localStorage.choosenIdParking;
														var cancelDetails = {
															parkingId: parkingId,
															bookingId: bookingId
														};
														$http
															.post('https://smartparkil.herokuapp.com/cancelParking/', cancelDetails)
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
										$localStorage.flagActionSheet =false;
										}

										google.maps.event.addListener(choseLocation, 'click', function(event) {
											var hideSheet = $ionicActionSheet.show({
												buttons: [{
														text: 'Drive'
													},
													{
														text: 'Show Details'
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
														// WazeLink.open('waze://?ll=' + latToNavigate + ',' + lngToNavigate);
														var destination = [latToNavigate, lngToNavigate];
														var start = [locationResult.lat, locationResult.lng];
														$cordovaLaunchNavigator.navigate(destination, start).then(function() {
															console.log("Navigator launched");
														}, function(err) {
															console.error(err);
														});
													}
													if (index == 1) {
														var detailsChoose = $localStorage.myChoseDetails;
														var alertPopup = $ionicPopup.alert({
															title: 'DETAILS',
															okType: 'button-calm',
															template: '<b>Description: </b>' + detailsChoose.Description + '<br><b>Address: </b>' + detailsChoose.address + '<br><b>Time: </b>' + detailsChoose.time + '<br><b>Occupied: </b>' + detailsChoose.occupied + '<br><b>Handicapped: </b>' +detailsChoose.handicapp
														});
													}
													if (index == 2) {

														var bookingId = $localStorage.answer.bookingId;
														var parkingId = $localStorage.choosenIdParking;
														var cancelDetails = {
															parkingId: parkingId,
															bookingId: bookingId
														};
														$http
															.post('https://smartparkil.herokuapp.com/cancelParking/', cancelDetails)
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
							google.maps.event.addListener(map, 'bounds_changed', function() {
								var parkReportedMarker = new google.maps.Marker({
									id: 2,
									position: new google.maps.LatLng(parkReport.lat, parkReport.lng),
									map: map,
									icon: "./img/blueFlag.png"
								});
								$scope.parkReported = parkReportedMarker;
								google.maps.event.addListener(parkReportedMarker, 'click', function(event) {
									var hideSheet = $ionicActionSheet.show({
										buttons: [{
												text: 'Show Details'
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
												var detailsReporter = $localStorage.answerReporterDetails;
												console.log(detailsReporter);
												var dateTime = new Date(detailsReporter.time);
												console.log(dateTime);
												var alertPopup = $ionicPopup.alert({
													title: 'DETAILS',
													okType: 'button-calm',
													template: '<b>Address: </b>' + detailsReporter.location.city + "," + detailsReporter.location.street + ',' + detailsReporter.location.number + '<br><b>Time: </b>' + dateTime
												});
											}
											if (index == 1) {
												var temp = window.localStorage.getItem("repo");
												var tempo = temp.toString();
												var reports = {
													parkingId: tempo
												};
												$http
													.post('https://smartparkil.herokuapp.com/deleteParking/', reports)
													.success(function(answer) {
														var reportCoords = { // FIXME: what is it for?
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
						$scope.continue = function() {
							$state.go('menu.out', $scope.chosenLocation)
						}
					});
				});
			};
		}
	])

	.controller('availabeParkingCtrl', ['$scope', '$state', '$http', '$stateParams', '$ionicLoading', '$ionicActionSheet', '$timeout', '$ionicPopup', 'UserService', '$localStorage', 'sendPush', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
		function($scope, $state, $http, $stateParams, $ionicLoading, $ionicActionSheet, $timeout, $ionicPopup, UserService, $localStorage, sendPush) {
			$scope.init = function() {
				console.log($localStorage.answer);
				var massege = " ";
				var locations = $localStorage.answer.results;

				function getLocation(callback) { //NOTE: can be as a service component
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
						zoom: 15,
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
					map.setCenter(new google.maps.LatLng($localStorage.searchCoords.lat, $localStorage.searchCoords.lng)); // NOTE: pos.coords.latitude, pos.coords.longitude
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
					// NOTE: handle the returned data from server
					locations.forEach(function(loc) {
						console.log(loc);
						var tempLatLng = new google.maps.LatLng(loc.location.coords[0], loc.location.coords[1]);
						var tempMarker = new google.maps.Marker({
							id: $scope.markers.length + 1, //NOTE: loc[0] = main marker -> myLocation
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
							var hideSheet = $ionicActionSheet.show({
								buttons: [{
										text: 'Details'
									},
									{
										text: 'Choose'
									}
								],
								titleText: '<b>Options</b>',
								cancelText: 'Back',
								cancel: function() {
									return true; // add cancel code..
								},
								buttonClicked: function(index) {
									console.log(index);
									var choseOccupied = loc.occupied;
									var statusChose, handicapped;
									if (choseOccupied == false) {
										statusChose = "Availabe";
									}
									if (choseOccupied == true) {
										statusChose = "Occupied";
									}
									if(loc.handicapped==false)
									{
									handicapped	="no";
									}
									if(loc.handicapped==true)
									{
									handicapped	="Only for handicapped";
									}
									if (index == 0) {
										massege = 'Someone intrested in your parking!'
										sendPush.pushToPublisher(loc.publisherToken, massege); //NOTE here is the push service
										var alertPopup = $ionicPopup.alert({
											title: 'DETAILS',
											okType: 'button-calm',
											template: '<b>Description: </b>' + loc.description + '<br><b>Address: </b>' + loc.location.city + "," + loc.location.street + ',' + loc.location.number + '<br><b>Time: </b>' + loc.time + '<br><b>Occupied: </b>' + statusChose + '<br><b> Handicapped: </b>' + handicapped
										});
									}
									if (index == 1) {
										$localStorage.chosenParking = loc;
										massege = 'Someone reserved your parking!'
										sendPush.pushToPublisher(loc.publisherToken, massege); //NOTE here is the push service
										console.log(loc);
										var bookingId = $localStorage.answer.bookingId;
										var searchId = UserService.getUser().email;
										$localStorage.choosenIdParking = loc.id;
										var chooseDetails = {
											searcherId: searchId,
											bookingId: bookingId,
											parkingId: $localStorage.choosenIdParking
										};
										$http
											.post('https://smartparkil.herokuapp.com/chooseParking/', chooseDetails)
											.success(function(answer) {
												$localStorage.flagChose = true;
												$localStorage.flagActionSheet = true;
												$ionicLoading.show({
													template: 'Loading...:)'
												});
												var now = new Date(),
													timeOfParking = new Date(loc.time);
												cordova.plugins.notification.local.schedule({
													id: 10,
													title: "Time to Parking",
													text: "Tap on notification and answer the question",
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
												$localStorage.myChoseDetails = {
													Description: loc.description,
													address: loc.location.city + "," + loc.location.street + ',' + loc.location.number,
													time: loc.time,
													occupied: statusChose,
													handicapp: handicapped
												};
												console.log($localStorage.myChoseDetails);
												$localStorage.myChose = locSelect;
												if ($localStorage.myChose.lat != -86) {
													$timeout(function() {
														$state.go('menu.home', {}, {
															reload: true
														});
														window.location.reload(true);
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
					$scope.continue = function() {
						$state.go('menu.out', $scope.chosenLocation)
					}
				});
			};
		}
	])

	.controller('myProfileCtrl', ['$scope', '$stateParams', 'UserService', '$localStorage', '$http', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
		function($scope, $stateParams, UserService, $localStorage, $http) {
			$scope.userData = $localStorage.userLoginData; //NOTE: here is all the user info from login!
			console.log($scope.userData);
			var userN = UserService.getUser().givenName;
			if ($scope.userData.password == "gtoken") {
				$scope.userData.password = "No Password";
			}
			$scope.email = $scope.userData.email;
			$scope.password = $scope.userData.password;
			$scope.carId = $scope.userData.carId;
			$scope.userName = $scope.userData.name;
			$scope.smarties = $scope.userData.smarties;
		}
	])

	.controller('myHistoryCtrl', ['$scope', '$http', 'UserService', '$stateParams', 'd3TimeFormat', '$ionicLoading', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
		function($scope, $http, UserService, $stateParams, d3TimeFormat, $ionicLoading) {
			console.log($stateParams);
			$ionicLoading.show({
							template: 'Loading in..:)'
							});
			$scope.items = [];
			$scope.items2 = [];
			// Should be searcher_id
			userDetails = {
				userId: UserService.getUser().email
			};
			$http.post('https://smartparkil.herokuapp.com/historyBooking' , userDetails).then((res) => {
				$ionicLoading.hide();
				res.data.forEach((v, k) => {
					timeOfParking = new Date(v.time);
					$scope.items.push({
						location: `${v.location.city} ${v.location.street} ${v.location.number}`,
						time: d3TimeFormat.toClean(v.time)
					})
				});
			});

			$http.post('https://smartparkil.herokuapp.com/historyParking' , userDetails).then((res) => {
				$ionicLoading.hide();
				res.data.forEach((v, k) => {
					timeOfParking = new Date(v.time);
					$scope.items2.push({
						location: `${v.location.city} ${v.location.street} ${v.location.number}`,
						time: d3TimeFormat.toClean(v.time)
					})
				});
			});
		}
	])

	.controller('MyCtrlSearchesHistory', ['$scope','$ionicLoading',
		function($scope, $ionicLoading) {
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
	.controller('helpCtrl', ['$scope',
		function($scope) {

		}
	])
	.controller('aboutCtrl', ['$scope',
		function($scope) {

		}
	])
	.controller('signupCtrl', ['$scope', '$state', '$stateParams', '$ionicAuth', '$ionicUser', 'UserService', '$localStorage', '$http', '$ionicPush', '$ionicPopup', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
		function($scope, $state, $stateParams, $ionicAuth, $ionicUser, UserService, $localStorage, $http, $ionicPush, $ionicPopup) {
			$scope.signUp = (name, mail, password, carid) => {
				var userDetails = {
					name: name,
					email: mail,
					password: password,
					carId: carid,
					smarties: 5
				};
				console.log(userDetails)
				var details = {
					'email': userDetails.email,
					'password': userDetails.password
				};
				var userData = {
					givenName: name,
					email: mail
				};
				UserService.setUser(userData);
				// UserService.setUser(userDetails);
				$http
				.post('https://smartparkil.herokuapp.com/createUser/', userDetails)
				.success(function(answer) {
					console.log(answer);
					if (answer) {
						$ionicAuth
							.signup(details)
							.then(function() {
								$localStorage.userLoginData = userDetails;
							//	$localStorage.flagMap = true;
								$state.go('menu.home');
								return $ionicAuth.login('basic', details);
							}, function(err) {
								for (var e of err.details) {
									if (e === 'conflict_email') {
											$ionicPopup.alert({
											title: "Email already exists.",
											template: ''
										});
									} else {
											$ionicPopup.alert({
											title: err.details,
										});
										console.log(err.details);
									}
								}
							});
					} else {
							$ionicPopup.alert({
											title: "Invalid email",
										});
					}
				})
				.error(function(answer) {
					console.log('can not post');
					console.log(answer);
				});
			}
		}
	])

	.controller('buySmartiesCtrl', ['$scope', '$http', '$stateParams', '$localStorage','$ionicPopup',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
		function($scope, $http, $stateParams, $localStorage, $ionicPopup) {
			$scope.choice1 = false;
			$scope.choice2 = false;
			$scope.paymentQuantity = null;

			$scope.push = element => {
				if(element)
				return 'item item-icon-left calm-bg';
				return 'item item-icon-left';
			}
			var showAlert = message => {
			   var alertPopup = $ionicPopup.alert({
			     title: 'SMARTIES PAYMENT MESSAGE:',
			     template: `${message}`
			   });

			   alertPopup.then(function(res) {
			     console.log('PAYMENT sent to server');
			   });
			 };

			if($localStorage.userLoginData === undefined){
				$scope.currentSmarties = 5;
				console.error('Error: Can\'t load user login data!');
			}
			else
				$scope.currentSmarties = $localStorage.userLoginData.smarties;

			// These are fixed values, do not change this
			var NOODLIO_PAY_API_URL = "https://noodlio-pay.p.mashape.com";
			var NOODLIO_PAY_API_KEY = "3fEagjJCGAmshMqVnwTR70bVqG3yp1lerJNjsnTzx5ODeOa99V";

			// Obtain your unique Stripe Account Id from here:
			// https://www.noodl.io/pay/connect
			var STRIPE_ACCOUNT_ID = "<YOUR-UNIQUE-ID>";

			// Define whether you are in development mode (TEST_MODE: true) or production mode (TEST_MODE: false)
			var TEST_MODE = true;

			// add the following headers for authentication
			$http.defaults.headers.common['X-Mashape-Key'] = NOODLIO_PAY_API_KEY;
			$http.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';
			$http.defaults.headers.common['Accept'] = 'application/json';

			$scope.FormData = {
				number: "",
				cvc: "",
				exp_month: "",
				exp_year: "",
				test: TEST_MODE,
			};

			$scope.createToken = function() {
				// init for the DOM
				$scope.ResponseData = {
					loading: true
				};

				// create a token and validate the credit card details
				$http.post(NOODLIO_PAY_API_URL + "/tokens/create", $scope.FormData)
					.success(
						function(response) {

							// --> success
							console.log(response)
							console.log(response.message);
							showAlert(response.message);

							if (response.hasOwnProperty('id')) {
								var token = response.id;
								$scope.ResponseData['token'] = token;
								proceedCharge(token);
							} else {
								$scope.ResponseData['token'] = 'Error, please contact admin.';
								$scope.ResponseData['loading'] = false;
							};
						}
					)
					.error(
						function(response) {
							console.log(response)
							$scope.ResponseData['token'] = 'Error, see console';
							$scope.ResponseData['loading'] = false;
						}
					);
			};

			// charge the customer with the token
			function proceedCharge(token) {

				var param = {
					source: token,
					amount: 100,
					currency: "usd",
					description: "Your custom description here",
					stripe_account: STRIPE_ACCOUNT_ID,
					test: TEST_MODE,
				};

				$http.post(NOODLIO_PAY_API_URL + "/charge/token", param)
					.success(
						function(response) {

							// --> success
							console.log(response);
							$scope.ResponseData['loading'] = false;

							if (response.hasOwnProperty('id')) {
								var paymentId = response.id;
								$scope.ResponseData['paymentId'] = paymentId;
							} else {
								$scope.ResponseData['paymentId'] = 'Error, see console';
							};

						}
					)
					.error(
						function(response) {
							console.log(response)
							$scope.ResponseData['paymentId'] = 'Error, see console';
							$scope.ResponseData['loading'] = false;
						}
					);
			};
			paypal.Button.render({

				env: 'sandbox', // sandbox | production
				client: {
					sandbox: 'AaV2tDFCFbiaSD5npltuu9GgW6EHIOr4Zy4opHLJA8ZiQxnLAjzjEGLJcu3xlQa95PtjLZCnuShjTwoQ',
					production: 'EJjbaC7gkiWrUNgxbNx8n-95dKqMqfLN5BeVnQibi7CIzYVzMmOFNOgWWy7WyGHDkFeyVcOBGqKZTv-Y'
				},

				// Show the buyer a 'Pay Now' button in the checkout flow
				commit: true,

				// payment() is called when the button is clicked
				payment: function(data, actions) {
					console.log($scope.paymentQuantity);
					// Make a call to the REST api to create the payment
					return actions.payment.create({
						transactions: [{
							amount: {
								total: '1.00',
								currency: 'USD'
							}
						}]
					});
				},

				// onAuthorize() is called when the buyer approves the payment
				onAuthorize: function(data, actions) {

					// Make a call to the REST api to execute the payment
					return actions.payment.execute().then(function() {
						showAlert('Payment Complete!');
					});
				}

			}, '#paypal-button-container');
		}
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

	.controller('mapOUTCtrl', ['$scope', '$state', '$http', '$stateParams', '$ionicLoading', '$localStorage', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
		function($scope, $state, $http, $stateParams, $ionicLoading, $localStorage) {
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
				map.setCenter(new google.maps.LatLng($localStorage.myLocationStore.lat, $localStorage.myLocationStore.lng)); // NOTE: pos.coords.latitude, pos.coords.longitude
				var myLocation = new google.maps.Marker({
					id: 0,
					options: {
						icon: imgs.imHereBlue,
						draggable: true,
						animation: google.maps.Animation.BOUNCE

					},
					position: new google.maps.LatLng($localStorage.myLocationStore.lat, $localStorage.myLocationStore.lng), // NOTE: pos.coords.latitude, pos.coords.longitude
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
				}
			};
		}
	])
