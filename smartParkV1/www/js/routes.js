angular.module('app.routes', ['ionicUIRouter'])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js

  $stateProvider



  .state('tabsController.sMARTIn', {
    url: '/in',
    params: {
        formParams: {
            distance: null,
            date: null,
            time: null,
            street: null,
            number: null,
            city: null,
            country: null
            size: null,
            handicap: null,
            comments: null
        }
    },
    views: {
      'tab1': {
        templateUrl: 'templates/sMARTIn.html',

        params: {
            param1: null
        },
        controller: 'sMARTInCtrl'
      }
    }
  })


.state('tabsController.mapsExampleOUT', {
  url: '/mapsExampleOut',
  views: {
    'tab4': {
      templateUrl: 'templates/mapsExampleOUT.html',
      controller: 'mapsExampleOutCtrl'
  }
  }
})

  .state('tabsController.sMARTOut', {
    url: '/out',
    views: {
      'tab4': {
        templateUrl: 'templates/sMARTOut.html',
        controller: 'sMARTOutCtrl'
      }
    }
  })

  /*
    The IonicUIRouter.js UI-Router Modification is being used for this route.
    To navigate to this route, do NOT use a URL. Instead use one of the following:
      1) Using the ui-sref HTML attribute:
        ui-sref='tabsController.sMARTPARK'
      2) Using $state.go programatically:
        $state.go('tabsController.sMARTPARK');
    This allows your app to figure out which Tab to open this page in on the fly.
    If you're setting a Tabs default page or modifying the .otherwise for your app and
    must use a URL, use one of the following:
      /page1/tab1/home
      /page1/tab2/home
  */
  .state('tabsController.sMARTPARK', {
    url: '/home',
    views: {
      'tab1': {
        templateUrl: 'templates/sMARTPARK.html',
        controller: 'sMARTPARKCtrl'
      },
      'tab2': {
        templateUrl: 'templates/sMARTPARK.html',
        controller: 'sMARTPARKCtrl'
      },
      'tab4': {
        templateUrl: 'templates/sMARTPARK.html',
        controller: 'sMARTPARKCtrl'
      }
    }
  })

  .state('tabsController', {
    url: '/page1',
    templateUrl: 'templates/tabsController.html',
    abstract:true
  })

  .state('tabsController.availableSMARTParks', {
    url: '/avbl_sp',
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
        comments: null
    },
      'tab1': {
        templateUrl: 'templates/availableSMARTParks.html',
        controller: 'availableSMARTParksCtrl'
      }
    }
  })

  .state('tabsController.mapsExample', {
    url: '/page6',
    views: {
      'tab1': {
        templateUrl: 'templates/mapsExample.html',
        controller: 'mapsExampleCtrl'
      }
  },
  url: '/page1',
  views: {
    'tab1': {
      templateUrl: 'templates/mapsExample.html',
      controller: 'mapsExampleCtrl'
    }
  }
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

  // .state('tabsController.sMARTPARKOut', {
  //   url: '/status_sp',
  //   views: {
  //     'tab4': {
  //       templateUrl: 'templates/sMARTPARKOut.html',
  //       controller: 'sMARTPARKOutCtrl'
  //     }
  //   }
  // })
// $urlRouterProvider.when('page1/in', '/in');
$urlRouterProvider.otherwise('/login')

});
