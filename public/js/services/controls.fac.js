(function(){
	angular
		.module('MaintenanceTracker')
		.service('ControlService', ControlService);	

		ControlService.$inject = ['$mdDialog', '$q'];

		function ControlService($mdDialog, $q){
			var service = this;

			service.openDeleteDialog = function(body, event){
				var deferred = $q.defer();
				var status = {
					message: ""
				};

        $mdDialog.show({
         controller: DialogController,
         parent: angular.element(document.body),
         targetEvent: event,
         clickOutsideToClose:true,
         templateUrl: '../../directives/confirmDelete.html',
         locals:{
           body: body
         }  
        })
        	.then(function(response){
        		status.message = response;
        		deferred.resolve(status);

        	}, function(){
        		status.message = "cancelled";
        		deferred.reject(status);
        	});
        return deferred.promise;
			};

			function DialogController($scope, $mdDialog, body) {
        $scope.body = body;

        $scope.cancelDialog = function(){
          $mdDialog.cancel();
        };

        $scope.closeDialog = function() {
          $mdDialog.hide();
        };

        $scope.response = function(response){
        	$mdDialog.hide(response);
        };
      }

		}
			
})();