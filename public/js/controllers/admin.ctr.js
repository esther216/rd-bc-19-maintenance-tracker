(function(){
	angular
		.module('MaintenanceTracker')
		.controller('AdminCtrl', AdminCtrl);	
		
		AdminCtrl.inject = ['UserService'];
		function AdminCtrl(UserService){
			var admin = this;
			admin.data = UserService.getUserCookie("currentUser");
			admin.allUsers = UserService.getAllUsers();

			admin.signOut = function(){
				UserService.signOut()
					.then(function(response){
						window.location = response.data.redirect;
					})
					.catch(function(response){

					});
			}
		}
		
})();