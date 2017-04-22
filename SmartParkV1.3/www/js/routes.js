angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

      .state('menu.in', {
    url: '/in',
    params: {
            street: null,
            number: null,
            city: null,
            country: null
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
            country: null
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
    params: {
        userParams: {
            userName: null,
            password: null,
            gToken: null
        }
    },
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
    params: {
        distance: null,
        date: null,
        time: null,
        street: null,
        number: null,
        city: null,
        country: null,
        size: null,
        handicap: null,
        comments: null,
        picture: null
    },
    views: {
      'side-menu21': {
        templateUrl: 'templates/availabeParking.html',
        controller: 'availabeParkingCtrl'
      }
    }
  })

  .state('menu.myProfile', {
    url: '/EditProfile',
    params: {
        userParams: {
            userName: null,
            userId: null,
            carType: null,
            inHistory: null,
            outHistory: null
        }
    },
    views: {
      'side-menu21': {
        templateUrl: 'templates/myProfile.html',
        controller: 'myProfileCtrl'
      }
    }
  })

  .state('menu.myHistory', {
    url: '/history',
    params: {
        userParams: {
            userName: null,
            userId: null,
            carType: null,
            inHistory: null,
            outHistory: null
        }
    },
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
    params: {
        userName: null,
        password: null,
        userId: null,
        carId: null,
        gToken: null
    },
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
    params: {
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
    views:{
      'searches-tab':{
        templateUrl: 'templates/searchesHistory.html'
    }}})
  .state('menu.myHistory.reportsHistory', {
    url: '/reportsHistory',
    views:{
      'reports-tab':{
        templateUrl: 'templates/reportsHistory.html'
  }}})


$urlRouterProvider.otherwise('/login')



});
