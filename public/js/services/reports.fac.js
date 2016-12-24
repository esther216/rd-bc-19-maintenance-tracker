(function(){
	angular
		.module('MaintenanceTracker')
		.service('ReportService', ReportService);	

		ReportService.$inject = ['$http', '$mdDialog', '$mdToast'];

		function ReportService($http, $mdDialog, $mdToast){
			var service = this;

			service.getAllReports = function(){
				var response = $http.get('/reports');
				return response;
			}	

			service.updateReport = function(report){
				var response = $http.post('/reports', report);
				return response;
			};

			service.approveReport = function(report, event){
				return showStaffPrompt(report, event);
			};

			service.rejectReport = function(report, event){
				service.updateReport(report);
			};

			function DialogController($scope, $mdDialog) {
		    $scope.hide = function() {
		      $mdDialog.hide();
		    };

		    $scope.cancel = function() {
		      $mdDialog.cancel();
		    };

		    $scope.answer = function(answer) {
		      $mdDialog.hide(answer);
		    };
		  }

			function showStaffPrompt(report, event){
				var confirm = $mdDialog.prompt()
		      .title('Assign a Staff')
		      .placeholder('Staff Name')
		      .ariaLabel('Staff Name')
		      .initialValue(report.sentBy)
		      .targetEvent(event)
		      .ok('Send Notification')
		      .cancel('Cancel');

		    $mdDialog.show(confirm).then(function(result) {
		      report.status = "approved";
		      report.staffAssigned = result;
		      service.updateReport(report);
		    }, function() {
		      showToast("Action Cancelled");
		    });
			}

			function showToast(message){
				$mdToast.show(
					$mdToast.simple()
						.content(message)
						.position('top, right')
						.hideDelay(3000)
				);
			}
		}
})();