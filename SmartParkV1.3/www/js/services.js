angular.module('app.services', [])

	.factory('BlankFactory', [function() {

	}])

	.service('UserService', function() {

		var setUser = function(user_data) {
			window.localStorage.starter_google_user = JSON.stringify(user_data);
		};

		var getUser = function() {
			return JSON.parse(window.localStorage.starter_google_user || '{}');
		};

		return {
			getUser: getUser,
			setUser: setUser
		};
	})

	.service('sendPush', function($http) {
		this.pushToPublisher = function(publisherId, message) {
			// Define relevant info
			var jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2YWRjYTRlMy0wYWNjLTQ3NDAtYmRmZS1lZDdlOWZhZTk4NTMifQ.mXx2ulV4fl5k0TKs-0FOIbyxChpn0A2icQlhhjFR5a0';
			var tokens = [publisherId] //['dKn5i2rnsMI:APA91bF5tvcAkudiU7OqypPO3nzLHciyGHp1sYkSLQLzn_vBRym5LoozcOO27Tu2ditc5lmBqLB285x65knWLICC1o1zGBAxGM4N5wA46KM6o6BmjT13cJYigDODZ-xx8vL-udLf3Qbd'];
			var profile = 'tavorc';

			// Build the request object
			var req = {
				method: 'POST',
				url: 'https://api.ionic.io/push/notifications',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + jwt
				},
				data: {
					"tokens": tokens,
					"profile": profile,
					"notification": {
						"title": "Hi :)",
						"message": message,
						"android": {
							"title": "SMARTPARK message:",
							"message": message
						},
						"ios": {
							"title": "Howdy iOS",
							"message": message
						}
					}
				}
			};

			// Make the API call
			$http(req).success(resp => {
				// Handle success
				console.log(`Push to publisherID: ${publisherId}`);
				console.log("Ionic Push: Push success", resp);
			}).error(error => {
				// Handle error
				console.log("Ionic Push: Push error", error);
			});
		}
	})

	.service('d3TimeFormat', function($http){
		var formatDay 	= d3.timeFormat("%Y-%m-%d"),
			formatTime 	= d3.timeFormat("%H:%M"),
			formatDate 	= d3.timeFormat("%Y-%m-%d %H:%M:00");

		this.toLocalDate = (date, callback) => {
			var day 			= formatDay(new Date(date.d)),
				time 			= formatTime(new Date(date.t)),
			 	formatedDate 	= formatDate(new Date(`${day} ${time}`));

			console.log(`day: ${day}`);
			console.log(`time: ${time}`);
			console.log(`formated: ${formatedDate}`);
			console.log(`${formatedDate.toString()}`)
			callback(formatedDate);
		};
		this.toClean = (date) => {
			return formatDate(new Date(`${date}`))
		};
	})
	.service('BlankService', [function() {

	}]);
