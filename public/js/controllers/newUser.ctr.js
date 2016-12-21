(function(){
	angular
		.module('MaintenanceTracker')
		.controller('NewUserCtrl', NewUserCtrl);

		function NewUserCtrl($scope, $mdDialog){
			$scope.newUser = {};

			$scope.showDialog = function($event){
				var parentEl = angular.element(document.body);
				$mdDialog.show({
						parent: parentEl,
         		targetEvent: $event,
         		templateUrl: '../directives/sign-up.html',
            locals: {
           		items: $scope.items
         		},
         		controller: DialogController
					});

				function DialogController($scope, $mdDialog, $http, items){
					$scope.items = items;
	        $scope.closeDialog = function() {
	          $mdDialog.hide();
	        };

	        $scope.getUserDetails = function(){
	        	$scope.closeDialog();
	        	if ( typeof $scope.newUser === 'undefined' ){
	        		console.log("Empty Fields");
	        	}
	        	else{
	        		$http.post('/users', $scope.newUser)
	        			.success(function(data){
	        				//use a toast here
	        				window.location = data.redirect;	
	        			})
	        			.error(function(data){
	        				console.log("error in posting");
	        			});
	        	}
	        };
				}
			};
		}
})();