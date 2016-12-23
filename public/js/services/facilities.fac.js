(function(){
	angular
		.module('MaintenanceTracker')
		.service('FacilityService', FacilityService);	

		FacilityService.$inject = ['$http', '$mdSidenav', '$mdToast'];

		function FacilityService($http, $mdSidenav, $mdToast){
			var service = this;
			service.openSideBar = function(){
				 $mdSidenav('left').open();
			};

			service.closeSideBar = function(){
				$mdSidenav('left').close();
			};

			service.getAllFacilities = function(){
				var response = $http.get('/facilities');
				return response;
			};

			service.saveFacility = function(newFacility){
				var response = $http.post('/facilities', newFacility);
				return response;
			};
		}
})();