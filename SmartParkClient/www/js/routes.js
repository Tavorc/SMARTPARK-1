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

  .state('menu.sMARTPARKIN', {
    url: '/in',
    views: {
      'side-menu21': {
        templateUrl: 'templates/sMARTPARKIN.html',
        controller: 'sMARTPARKINCtrl'
      }
    }
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
    url: '/side-menu21',
    templateUrl: 'templates/menu.html',
    controller: 'menuCtrl'
  })

$urlRouterProvider.otherwise('/side-menu21/index')

  

});