'use strict';

angular.module('myApp.tracker', ['ui.router'])

.config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('home.tracker', {
        url: '/tracker',
        templateUrl: 'tracker/tracker.html',
        controller: 'TrackerController',
        controllerAs: 'trackerCtr'
    })
}])

.controller('TrackerController', TrackerController);


TrackerController.$inject = ['$scope', '$timeout', 'trackerService'];
function TrackerController($scope, $timeout, trackerService) {
    var self = this;
    self.toDay = new Date();

    self.monday = getMonday(new Date());
    self.friday = new Date(self.monday.getFullYear(), self.monday.getMonth(), self.monday.getDate() + 4, 23, 59, 59);
    self.trackers = [];
    trackerService.getTrackerByDate(self.monday, self.friday).then(function (response) {
        var trackersUnderlaying = [];
        angular.forEach(response, function (tracker) {
            trackersUnderlaying.push({
                Action: tracker.get("Action"),
                Date: tracker.get("Date")
            });
        });
       
        $timeout(function () {
            self.trackers = angular.copy(trackersUnderlaying);
        });
    });


    function getMonday(toDay) {
        var day = toDay.getDay(),
            diff = toDay.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
        var monday = new Date(toDay.setDate(diff));
        return new Date(monday.getFullYear(), monday.getMonth(), monday.getDate(), 0, 0, 0);
    }

}


angular.module('myApp.tracker').service('trackerService', trackingService);


function trackingService() {
    this.init = function () {
        Parse.initialize("u4XKvtb4gCU0P7smzWI09ORk2Ytg933Elt4kxa6J", "l0KaCpkeUgCfwudDHaxrqPwem1IVuil0AwoL3Mun");
    }
    this.init();

    this.getTrackerByDate = function (dateFrom, dateTo) {
        var Tracker = Parse.Object.extend("Tracker");
        var query = new Parse.Query(Tracker);
        query.containedIn("Action", ["Tracking Service start !", "Session Log off"]);
        query.greaterThan("Date", dateFrom);
        query.lessThan("Date", dateTo);
        query.ascending("Date");
        return query.find();
    }

}