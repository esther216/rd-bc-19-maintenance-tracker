(function(){
	angular
		.module('MaintenanceTracker')
		.controller('AuthCtrl', AuthCtrl);

		AuthCtrl.$inject = ['UserService'];

		function AuthCtrl(UserService){
			
			var app = this;
			app.user = {};
			var promise = UserService.getAllUsers();


			app.signIn = function (){
				UserService.checkUser(app.user)
					.then(function(response){
						console.log(response);
						var data = response.data;
						for ( var key in data ){
							if ( data.role === 'staff'){
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

			// promise.then(function(response){
			// 	app.users = response.data;
			// })
			// .catch(function(response){
			// 	console.log(response.statusText);
			// });

			
		}
})();