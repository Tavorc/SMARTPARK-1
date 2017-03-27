angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

      .state('menu.sMARTPARK', {
    url: '/index',
    views: {
      'side-menu21': {
        templateUrl: 'templates/sMARTPARK.html',
        controller: 'sMARTPARKCtrl'
      }
    }
  })

  .state('sMARTPARKIN', {
    url: '/in',
    templateUrl: 'templates/sMARTPARKIN.html',
    controller: 'sMARTPARKINCtrl'
  })

  .state('menu.sMARTPARKOUT', {
    url: '/out',
    views: {
      'side-menu21': {
        templateUrl: 'templates/sMARTPARKOUT.html',
        controller: 'sMARTPARKOUTCtrl'
      }
    }
  })

  .state('menu', {
    url: '/side-menu',
    templateUrl: 'templates/menu.html',
    controller: 'menuCtrl'
  })

  .state('sMARTPARKLogin', {
    url: '/login',
    templateUrl: 'templates/sMARTPARKLogin.html',
    controller: 'sMARTPARKLoginCtrl'
  })

  .state('sMARTPARKSignup', {
    url: '/signup',
    templateUrl: 'templates/sMARTPARKSignup.html',
    controller: 'sMARTPARKSignupCtrl'
  })

  .state('chooseSMARTPARK', {
    url: '/in-choose',
    templateUrl: 'templates/chooseSMARTPARK.html',
    controller: 'chooseSMARTPARKCtrl'
  })

$urlRouterProvider.otherwise('/login')
});