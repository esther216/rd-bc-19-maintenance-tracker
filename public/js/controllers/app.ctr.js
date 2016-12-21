(function(){
	angular
		.module('MaintenanceTracker')
		.controller('AppCtrl', AppCtrl);

		function AppCtrl($scope, $http){
			$scope.user = {};
			$scope.currentUser;

			$scope.signOut = function (){
				$http.post('/logout')
					.success(function(data){
						window.location = data.redirect;
					});
			};

			$scope.signIn = function(){
				$http.post('/users', $scope.user)
					.success(function(data){
						for ( var key in data ){
							if ( data[key].role === "staff" ){
								$http.post('/staff', data[key])
									.success(function(data){
										//window.location = data.redirect;
									})
									.error(function(data){
										console.log("error");
									})
							}
							// else role ==== admin
						}
					})
					.error(function(data){
						console.log("error in posting");
					});
			};
			
			function getCookie(name){
				var value = document.cookie.split(name+"=");
				if (value.length === 2){
					return value.pop().replace(/%[0-9]+?\w/g," ").split(" ");
				}
				
			}

			$scope.currentUser = getCookie("currentUser");
			console.log($scope.currentUser);
		}
})();