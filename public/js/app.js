angular.module('MaintenanceTracker', ['ngMaterial','ui.router'])
	.config(function($mdThemingProvider, $stateProvider){
		$mdThemingProvider.theme('default')
			.primaryPalette('teal')
			.accentPalette('cyan');
		$stateProvider
			.state('allusers', {
				url: '/users',
				templateUrl: '../directives/users.html',
				controller: 'UserCtrl as admin'
			})
			.state('allfacilities', {
				url: '/facilities',
				templateUrl: '../directives/facilities.html',
				controller: 'UserCtrl as admin'
			})
			.state('allreports', {
				url: '/reports',
				templateUrl: '../directives/reports.html',
				controller: 'UserCtrl as admin'
			});
			
	});