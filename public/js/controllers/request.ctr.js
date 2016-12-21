(function(){
	angular
		.module('MaintenanceTracker')
		.controller('RequestCtrl', RequestCtrl);

		function RequestCtrl($scope, $mdDialog){
			$scope.mRequest = {};
			$scope.showDialog = function($event){
				var parentEl = angular.element(document.body);
				$mdDialog.show({
						parent: parentEl,
         		targetEvent: $event,
         		templateUrl: '../directives/request.html',
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

	        $scope.getRequestDetails = function(){
	        	$scope.closeDialog();
	        	if ( typeof $scope.mRequest === 'undefined' ){
	        		console.log("Empty Fields");
	        	}
	        	else{
	        		$http.post('/requests', $scope.mRequest)
	        			.success(function(data){
	        				// display a toast here
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