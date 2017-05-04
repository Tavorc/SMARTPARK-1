// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'app.controllers', 'app.routes', 'app.directives','app.services','uiGmapgoogle-maps','googlemaps.init','ionic.cloud', 'ngStorage',])

.config(function($ionicConfigProvider, $sceDelegateProvider, $ionicCloudProvider, $stateProvider, $urlRouterProvider){
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

  $sceDelegateProvider.resourceUrlWhitelist([ 'self','*://www.youtube.com/**', '*://player.vimeo.com/video/**']);

})

.run(function($ionicPlatform, $ionicPopup, StorageService) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    cordova.plugins.notification.local.on("click", function (notification) {
    cordova.plugins.notification.local.cancel(notification.id, function () {
          // Notification was cancelled
          
            var confirmPopup = $ionicPopup.confirm({
             title: 'Time to parking',
             template: 'Is parking available?'
           });

           confirmPopup.then(function(res) {
             
             if(res) {
              var locSelect={lat: -86, lng:  -86};
              StorageService.add(locSelect);
             } else {
                var myPopup = $ionicPopup.show({
                template: '<input type="text">',
                title: 'Enter Number of car',
                subTitle: 'Car that parking',
                buttons: [
                  { text: 'Cancel' },
                  {
                    text: '<b>Save</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                      // if () {
                      //   //don't allow the user to close unless he enters wifi password
                      //   e.preventDefault();
                      // } else {
                      //   return;
                      // }
                    }
                  }
                ]
                 });
               console.log('You are not sure');
               var locSelect={lat: -86, lng:  -86};
              StorageService.add(locSelect);
             }
           });
          console.log('notification is cancelled : '+ notification.id);
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
        controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {

            function stopDrag(){
              $ionicSideMenuDelegate.canDragContent(false);
            }

            function allowDrag(){
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

      attrs.$observe('hrefInappbrowser', function(val){
        href = val;
      });
      
      element.bind('click', function (event) {

        window.open(href, '_system', 'location=yes');

        event.preventDefault();
        event.stopPropagation();

      });
    }
  };
});