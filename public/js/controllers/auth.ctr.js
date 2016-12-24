(function(){
	angular
		.module('MaintenanceTracker')
		.controller('AuthCtrl', AuthCtrl);

		AuthCtrl.$inject = ['UserService', '$mdDialog'];

		function AuthCtrl(UserService, $mdDialog){
			
			var app = this;
			app.user = {};

			var promise = UserService.getAllUsers();

			
			app.signIn = function (){
				UserService.checkUser(app.user)
					.then(function(response){
						
						var data = response.data;

						for ( var key in data ){
							if ( data[key].role === 'staff' ){
								UserService.getStaffPage(data[key])
									.then(function(response){
										window.location = response.data.redirect;
									});
							}
							else{
								UserService.getAdminPage(data[key])
									.then(function(response){
										window.location = response.data.redirect;
									});
							}
						}
					})
					.catch(function(error){
						console.log(response.data);
					});
			};

			app.signUp = function(user){
				showSignUpForm();
			};

			app.closeSignUpForm = function(){
				$mdDialog.hide();
			};

			app.getUserDetails = function(user){
				UserService.checkUser(user)
					.then(function(response){
						window.location = response.data.redirect;
						app.closeSignUpForm();
					})
					.catch(function(error){
						console.log(error.data);
					});
			};

			function showSignUpForm($event){
				$mdDialog.show({
						parent: angular.element(document.body),
         		targetEvent: $event,
         		templateUrl: '../directives/sign-up.html',
         		controller: 'AuthCtrl as appAuth'
					});
			}
			
		}
})();