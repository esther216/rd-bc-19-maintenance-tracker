angular.module('MaintenanceTracker', ['ngMaterial','ui.router'])
	.config(function($mdThemingProvider, $stateProvider){
		$mdThemingProvider.theme('default')
			.primaryPalette('teal')
			.accentPalette('cyan');
		$stateProvider
			.state('allusers', {
				url: '/users',
				templateUrl: '../directives/users.html',
				controller: function($scope, UserService){
					var promise = UserService.getAllUsers();
					$scope.users = [];
					promise.then(function(response){
						var data = response.data;
						for ( var key in data ){
							if ( data[key].role === 'admin' ){
								continue;
							}
							$scope.users.push(data[key]);
						}
					});
				
				}
			})
			.state('allfacilities', {
				url: '/facilities',
				templateUrl: '../directives/facilities.html',
				controller: function($scope, FacilityService){
					$scope.newFacility = {};
					$scope.facilities = [];

					var promise = FacilityService.getAllFacilities();
					
					promise.then(function(response){
						var data = response.data;
						for ( var key in data ){
							$scope.facilities.push(data[key]);
						}
						return $scope.facilities;
					})
					.catch(function(error){
						console.log(error);
					});

					$scope.openSideBar = function(){
						FacilityService.openSideBar();
					};

					$scope.closeSideBar = function(){
						FacilityService.closeSideBar();
					};
					
					$scope.saveFacility = function(){

						var promise = FacilityService.saveFacility($scope.newFacility);
						console.log(promise);
						promise.then(function(){
							$scope.facilities.push($scope.newFacility);	
						})
						.catch(function(error){
							console.log(error);
						});
				 };

				}
			})
			.state('allreports', {
				url: '/reports',
				templateUrl: '../directives/reports.html',
				controller: function($scope, ReportService){
					$scope.reports = [];

					var promise = ReportService.getAllReports();
					promise.then(function(response){
						var data = response.data;
						for ( var key in data ){
							if ( data[key].status === 'resolved' ){
								continue;
							}
							$scope.reports.push(data[key]);
						}
					});
					
					$scope.approve = function(report, event){
						return ReportService.approve(report, event);
					}
				}
			});
	});