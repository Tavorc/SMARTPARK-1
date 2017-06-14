angular
	.module('app.routes', [])

	.config(function($stateProvider, $urlRouterProvider) {

		$stateProvider
			.state('menu.in', {
				url: '/in',
				params: {
					street: null,
					number: null,
					city: null,
					country: null,
					lat: null,
					lng: null
				},
				views: {
					'side-menu21': {
						templateUrl: 'templates/in.html',
						controller: 'inCtrl'
					}
				}
			})

			.state('menu.out', {
				url: '/out',
				params: {
					street: null,
					number: null,
					city: null,
					country: null,
					lat: null,
					lng: null
				},
				views: {
					'side-menu21': {
						templateUrl: 'templates/out.html',
						controller: 'outCtrl'
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

			.state('menu.mySmarties', {
				url: '/smarties',
				views: {
					'side-menu21': {
						templateUrl: 'templates/mySmarties.html',
						controller: 'mySmartiesCtrl'
					}
				}
			})
			.state('menu.help', {
				url: '/help',
				views: {
					'side-menu21': {
						templateUrl: 'templates/help.html',
						controller: 'helpCtrl'
					}
				}
			})
			.state('menu.mapIN', {
				url: '/mapIN',
				params: {},
				views: {
					'side-menu21': {
						templateUrl: 'templates/mapIN.html',
						controller: 'mapINCtrl'
					}
				}
			})

			.state('menu.mapOUT', {
				url: '/mapout',
				params: { // FIXME: need to remove it
					date: null,
					time: null,
					street: null,
					number: null,
					city: null,
					country: null,
					repeat: null,
					size: null,
					handicap: null,
					comments: null
				},
				views: {
					'side-menu21': {
						templateUrl: 'templates/mapOUT.html',
						controller: 'mapOUTCtrl'
					}
				}
			})

			.state('menu.myHistory.searchHistory', {
				url: '/searchHistory',
				views: {
					'searches-tab': {
						templateUrl: 'templates/myHistory.html',
						controller: 'MyCtrlSearchesHistory'
					}
				}
			})
			.state('menu.myHistory.reportsHistory', {
				url: '/reportsHistory',
				views: {
					'reports-tab': {
						templateUrl: 'templates/myHistory.html',
						controller: 'MyCtrlReportsHistory'
					}
				}
			})


		$urlRouterProvider.otherwise('/login')


	});
