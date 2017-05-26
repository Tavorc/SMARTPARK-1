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
.service('OutService', function() {

	  var setOut = function(out) {
	    window.localStorage.outId = JSON.stringify(out);
	  };

	  var getOut = function(){
	    return JSON.parse(window.localStorage.out || '{}');
	  };
	  return {
	    getOut: getOut,
	    setOut: setOut
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

