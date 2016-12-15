(function(){
	'use strict';
	angular.module('MaintenanceTracker', ['ngMaterial'])
		.controller('MtController', function($scope){
			$scope.greeting = "Track Facility Maintenance Requests With The Maintenance Tracker Application.";
			$scope.currentNavItem = 'page1';
		});
	
})();