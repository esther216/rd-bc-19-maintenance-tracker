(function(){
	angular
		.module('MaintenanceTracker')
		.controller('UserCtrl', UserCtrl);	
		
		UserCtrl.inject = ['UserService', 'FacilityService',
		 'ControlService', 'ReportService', '$mdSidenav', 
		 '$mdToast', '$mdBottomSheet', '$mdDialog'];

		function UserCtrl(UserService, FacilityService, ReportService, 
			ControlService, $mdSidenav, $mdToast, $mdBottomSheet, 
			$mdDialog){
			var user = this;
			user.data = UserService.getUserCookie("currentUser");
			user.fullName = user.data[1] + " " + user.data[2];

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

// Report Functions
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

			user.approveReport = function(report, event){
				ReportService.approveReport(report, event);
				showToast(report.description+" approved!");
			};

			user.rejectReport = function(report, event){
				report.status = "rejected";
				ReportService.rejectReport(report, event);
			};

// Notification functions
			user.showNotifications = function(){
				$mdBottomSheet.show({
		      templateUrl: '../directives/notifications.html'
		    });
			};

// Admin functions
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

			user.setStaffAsAdmin = function(user, event){
				confirmAdmin(user, event);
			};
			
			user.deleteFacility = function(facility, $event){

				var body = {
					title: "Delete Facility",
					messages: {
						message1: "Are you sure you want to delete this facility: " 
						+ facility.name + " ?"
					}
				};
				
				ControlService.openDeleteDialog(body, $event)
					.then(function(){
						user.allFacilities.pop(facility);
						FacilityService.deleteFacility(facility);
						showToast("Facility Deleted!");
					});
			};

			user.deleteReport = function(report, $event){

				var body = {
					title: "Confirm Delete",
					messages: {
						message1: "Description: "+report.description,
						message2: "SentBy: "+report.sentBy
					}
				};
				
				ControlService.openDeleteDialog(body, $event)
					.then(function(){
						user.allReports.pop(report);
						ReportService.deleteReport(report);
						showToast("Report Deleted!");
					});
			};

			user.deleteStaff = function(staff, $event){

				var body = {
					title: "Confirm Delete",
					messages: {
						message: "Are you sure you want to delete this user: "
								+staff.name
					}
				};
				
				ControlService.openDeleteDialog(body, $event)
					.then(function(){
						console.log(staff);
						UserService.deleteStaff(staff);
					});
			};


// Load all data from seerver
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
						.hideDelay(1500)
						.parent(angular.element(document.querySelector('md-toolbar')))
				);
			}

			function confirmAdmin(user, event){
				var confirm = $mdDialog.confirm()
          .title('Confirm Admin')
          .textContent('Are you sure you want to set '+user.name+' as an Admin?')
          .ariaLabel('Confirm Admin')
          .targetEvent(event)
          .ok('Yes')
          .cancel('Mistake');

		    $mdDialog.show(confirm).then(function(answer) {
		      user.role = "admin";
		      showToast("Updated!");
		      UserService.updateUserRole(user);
		    }, function(answer) {
		      showToast("Cancelled");
		    });
			}
		}
		
})();