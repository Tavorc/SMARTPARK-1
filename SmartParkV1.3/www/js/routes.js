angular
	.module('app.routes', [])

	.config(function($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('menu.in', {
				url: '/in',
				params: null,
				views: {
					'side-menu21': {
						templateUrl: 'templates/in.html',
						controller: 'inCtrl'
					}
				}
			})

			.state('menu.out', {
				url: '/out',
				params: null,
				views: {
					'side-menu21': {
						templateUrl: 'templates/out.html',
						controller: 'outCtrl'
					}
				}
			})

			.state('menu.about', {
				url: '/about',
				views: {
					'side-menu21': {
						templateUrl: 'templates/about.html'
						// ,controller: 'aboutCtrl'
					}
				}
			})

			.state('menu', {
				url: '/side-menu',
				templateUrl: 'templates/menu.html',
				controller: 'menuCtrl'
			})

			.state('login', {
				url: '/login',
				templateUrl: 'templates/login.html',
				controller: 'loginCtrl'
			})

			.state('menu.home', {
				url: '/home',
				views: {
					'side-menu21': {
						templateUrl: 'templates/home.html',
						controller: 'homeCtrl'
					}
				}
			})

			.state('menu.availabeParking', {
				url: '/avl_prks',
				views: {
					'side-menu21': {
						templateUrl: 'templates/availabeParking.html',
						controller: 'availabeParkingCtrl'
					}
				}
			})

			.state('menu.myProfile', {
				url: '/EditProfile',
				views: {
					'side-menu21': {
						templateUrl: 'templates/myProfile.html',
						controller: 'myProfileCtrl'
					}
				}
			})

			.state('menu.myHistory', {
				url: '/history',
				views: {
					'side-menu21': {
						templateUrl: 'templates/myHistory.html',
						controller: 'myHistoryCtrl'
					}
				}
			})

			.state('signup', {
				url: '/signup',
				templateUrl: 'templates/signup.html',
				controller: 'signupCtrl'
			})
			.state('menu.buySmarties', {
				url: '/buySmarties',
				views: {
					'side-menu21': {
						templateUrl: 'templates/buySmarties.html',
						controller: 'buySmartiesCtrl'
					}
				}
			})
			.state('menu.help', {
				url: '/help',
				views: {
					'side-menu21': {
						templateUrl: 'templates/help.html'
						// ,controller: 'helpCtrl'
					}
				}
			})
			.state('menu.selectionMap', {
				url: '/selectionMap',
				params: {},
				views: {
					'side-menu21': {
						templateUrl: 'templates/selectionMap.html',
						controller: 'selectionMapCtrl'
					}
				}
			})

			// .state('menu.mapOUT', {
			// 	url: '/mapout',
			// 	params: { // FIXME: need to remove it
			// 		date: null,
			// 		time: null,
			// 		street: null,
			// 		number: null,
			// 		city: null,
			// 		country: null,
			// 		repeat: null,
			// 		size: null,
			// 		handicap: null,
			// 		comments: null
			// 	},
			// 	views: {
			// 		'side-menu21': {
			// 			templateUrl: 'templates/mapOUT.html',
			// 			controller: 'mapOUTCtrl'
			// 		}
			// 	}
			// })

			// .state('menu.myHistory.searchHistory', {
			// 	url: '/searchHistory',
			// 	views: {
			// 		'searches-tab': {
			// 			templateUrl: 'templates/myHistory.html',
			// 			controller: 'MyCtrlSearchesHistory'
			// 		}
			// 	}
			// })
			// .state('menu.myHistory.reportsHistory', {
			// 	url: '/reportsHistory',
			// 	views: {
			// 		'reports-tab': {
			// 			templateUrl: 'templates/myHistory.html',
			// 			controller: 'MyCtrlReportsHistory'
			// 		}
			// 	}
			// })


		$urlRouterProvider.otherwise('/login')


	});
