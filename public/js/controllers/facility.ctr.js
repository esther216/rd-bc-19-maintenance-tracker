// CONTROLLER FOR FACILITIES

(function(){
	angular
		.module('MaintenanceTracker')
		.controller('FacilityCtrl', FacilityCtrl);

		function FacilityCtrl($scope, $http, $mdSidenav, $mdToast){
			// $http.get('/users')
			// 	.then(function(data){
			// 		console.log(data);
			// 	});

			$scope.allFacilities = [
				{
					"name": "generator",
					"location": "east wing",
					"date": "12/12/2016"
				},
				{
					"name": "printer",
					"location": "main office",
					"date": "12/12/2015"
				},
				{
					"name": "laptop",
					"location": "general office",
					"date": "02/12/2016"
				}
			];
			$scope.facility = {};
			

			$scope.openSideNav = function(){
				$mdSidenav('left').open();
			};
			$scope.closeSideNav = function(){
				$mdSidenav('left').close();
			};

			$scope.addNewFacility = function(){
				if ( $scope.facility.name !== undefined && $scope.facility.location !== undefined){
					showToast("Facility Saved!");
					$scope.closeSideNav();
				}
				else{
					console.log("empty fields");
				}
			};

			function showToast(message){
				$mdToast.show(
					$mdToast.simple()
						.content(message)
						.position('top, right')
						.hideDelay(1000)
				);
			}
			// $scope.editFacility = function (facility){
			// 	console.log(facility);
			// };
		}
})();