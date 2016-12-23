(function(){
	angular
		.module('MaintenanceTracker')
		.service('UserService', UserService);	

		UserService.$inject = ['$http'];

		function UserService($http){
			var service = this;

			service.getAllUsers = function(){
				var response = $http.get('/users');
				return response;
			};


			service.checkUser = function(userData){
				var response = $http.post('/users',userData);
				return response;
			};

			service.getAdminPage = function(userData){
				var response = $http.post('/admin', userData);
				return response;
			};

			service.getStaffPage = function(userData){
				var response = $http.post('/staff', userData);
				return response;
			}

			service.getUserCookie = function(cookieName){
				var value = document.cookie.split(cookieName+"=");
				if (value.length === 2){
					return value.pop().replace(/%[0-9]+?\w/g," ").split(" ");
				}
				
			};

			service.signOut = function(){
				var response = $http.post('/logout');
				return response;
			};
		}

		
			
})();