(function(){
	angular
		.module('MaintenanceTracker')
		.service('ReportService', ReportService);	

		ReportService.$inject = ['$http', '$mdDialog'];

		function ReportService($http, $mdDialog){
			var service = this;

			service.getAllReports = function(){
				var response = $http.get('/reports');
				return response;
			}	

			service.updateReport = function(report){
				var response = $http.post('/reports', report);
				return response;
			};

			service.approve = function(report, event){
				return showPrompt(report, event);
			};

			function showPrompt(report, event){
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
		      console.log("no input");
		    });
			}
		}
})();