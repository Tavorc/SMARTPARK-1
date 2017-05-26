angular.module('app.services', ['ngStorage'])

.factory('BlankFactory', [function(){

}])

.factory ('StorageService', function ($localStorage) {
	$localStorage = $localStorage.$default({
  locationSelect: {}
});
var _getAll = function () {
  return $localStorage.locationSelect;
};
var _add = function (locationSelect) {
  $localStorage.locationSelect=locationSelect;
}

return {
    getAll: _getAll,
    add: _add
  };
})
.service('UserService', function() {

	  var setUser = function(user_data) {
	    window.localStorage.starter_google_user = JSON.stringify(user_data);
	  };

	  var getUser = function(){
	    return JSON.parse(window.localStorage.starter_google_user || '{}');
	  };

	  return {
	    getUser: getUser,
	    setUser: setUser
	  };
  })
.service('BlankService', [function(){

}]);

