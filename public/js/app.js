angular.module('MaintenanceTracker', ['ngMaterial'])
	.config(function($mdThemingProvider){
		$mdThemingProvider.theme('default')
			.primaryPalette('teal')
			.accentPalette('cyan');
	});
	

//angular colors: red, pink, purple, 
// deep-purple, indigo, blue, light-blue, 
// cyan, teal, green, light-green, lime, yellow, 
// amber, orange, deep-orange, brown, grey, blue-grey