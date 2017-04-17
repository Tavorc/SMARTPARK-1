angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider



      .state('menu.in', {
    url: '/in',
    views: {
      'side-menu21': {
        templateUrl: 'templates/in.html',
        controller: 'inCtrl'
      }
    }
  })

  .state('menu.out', {
    url: '/out',
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
    params: {
        formParams: {
            // distance: null,
            // date: null,
            // time: null,
            street: null,
            number: null,
            city: null,
            country: null
            // size: null,
            // handicap: null,
            // comments: null
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
        formParams: {
            // distance: null,
            // date: null,
            // time: null,
            street: null,
            number: null,
            city: null,
            country: null
            // size: null,
            // handicap: null,
            // comments: null
        }
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
    views: {
      'side-menu21': {
        templateUrl: 'templates/mapIN.html',
        controller: 'mapINCtrl'
      }
    }
  })

  .state('menu.mapOUT', {
    url: '/mapout',
    views: {
      'side-menu21': {
        templateUrl: 'templates/mapOUT.html',
        controller: 'mapOUTCtrl'
      }
    }
  })

$urlRouterProvider.otherwise('/login')



});
