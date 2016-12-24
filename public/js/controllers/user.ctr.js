(function(){
	angular
		.module('MaintenanceTracker')
		.controller('UserCtrl', UserCtrl);	
		
		UserCtrl.inject = ['UserService', 'FacilityService' , 'ReportService', '$mdSidenav', '$mdToast', '$mdBottomSheet'];

		function UserCtrl(UserService, FacilityService, ReportService, $mdSidenav, $mdToast, $mdBottomSheet){
			var user = this;
			user.data = UserService.getUserCookie("currentUser");
			user.newReport = {
				status: "awaiting",
				sentBy: user.data[1]+" "+user.data[2],
				staffAssigned: "none"
			};

			user.newFacility = {};
			user.allUsers = [];
			user.allFacilities = [];
			user.allReports = [];

			loadAllData();

			user.signOut = function(){
				UserService.signOut()
					.then(function(response){
						window.location = response.data.redirect;
					})
					.catch(function(response){

					});
			};

			user.openReportSideBar = function(){
				$mdSidenav('left').open();
			};

			user.closeReportSideBar = function(){
				$mdSidenav('left').close();
			};

			user.sendReport = function(newReport){
				if ( newReport.hasOwnProperty("facility") && newReport.hasOwnProperty("description") ){
					ReportService.updateReport(newReport);
					user.closeReportSideBar();
					showToast("Report Sent!");
				}
				else{
					showToast("Blank Fields!");
				}
			};

			user.showNotifications = function(){
				$mdBottomSheet.show({
		      templateUrl: '../directives/notifications.html'
		    });
			};

			user.openFacilitySideBar = function(){
				FacilityService.openSideBar();
			};

			user.closeFacilitySideBar = function(){
				FacilityService.closeSideBar();
			};

			user.saveNewFacility = function(newFacility){
				var promise = FacilityService.saveFacility(newFacility);
				promise.then(function(){
					user.allFacilities.push(newFacility);
					user.closeFacilitySideBar();	
					showToast("Facility Saved!");
				})
				.catch(function(error){
					console.log(error);
				});
			};

			user.approveReport = function(report, event){
				ReportService.approveReport(report, event);
				showToast(report.description+" approved!");
			};
			user.rejectReport = function(report, event){
				report.status = "rejected";
				ReportService.rejectReport(report, event);
			};

			function loadAllData(){
				UserService.getAllUsers()
					.then(function(response){
						var data = response.data;
						for ( var key in data ){
							user.allUsers.push(data[key]);
						}
					})
					.catch(function(response){
						console.log("An error occured. Check: "+response);
					});

				FacilityService.getAllFacilities()
				.then(function(response){
					var data = response.data;
					for ( var key in data ){
						user.allFacilities.push(data[key]);
					}
				})
				.catch(function(response){
					console.log("An error occured. Check: "+response);
				});

				ReportService.getAllReports()
					.then(function(response){
						var data = response.data;
						for ( var key in data ){
							user.allReports.push(data[key]);
						}
					})
					.catch(function(response){
						console.log("An error occured. Check: "+response);
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