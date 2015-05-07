'use strict';

angular.module('myApp.tracker', ['ui.router'])

.config(['$stateProvider', function ($stateProvider) {
    $stateProvider
        .state('master.tracker',
        {
            url: '/tracker',
            templateUrl: 'tracker/tracker.html',
            controller: 'TrackerController',
            controllerAs: 'trackerCtrl'
        })
    .state('master.tracker.detail', {


    })
}])

.controller('TrackerController', TrackerController);

TrackerController.$inject = ['$scope', '$timeout', 'trackerService', 'appSettings'];
function TrackerController($scope, $timeout, trackerService, appSettings) {
    var self = this;
    self.toDay = new Date();

    var trackingServiceStartStr = "Tracking Service start !";
    var sessionLogOffStr = "Session Log off";
    var lunchTimeHour = appSettings.lunchHour;
    self.appSettings = appSettings;

    self.trackers = [];

    $scope.$watch(function () {
        return self.toDay;
    }, function () {
        console.log(self.toDay);
        self.monday = getMonday(self.toDay);
        self.friday = new Date(self.monday.getFullYear(), self.monday.getMonth(), self.monday.getDate() + 4, 23, 59, 59);
        if (self.monday === undefined || self.friday === undefined) {
            return;
        }
        self.promise = trackerService.getTrackerByDate(self.monday, self.friday).then(function (response) {
            var trackersUnderlaying = [];
            var allShortDate = [];

            response = convertToJson(response);
            trackersUnderlaying = getTimeByDate(response)
            calculateHoursPerDay(trackersUnderlaying);

            $timeout(function () {
                self.trackers = angular.copy(trackersUnderlaying);
                /*sum working hours of week*/
                self.weekHours = sumWeekHours();
                self.weekHoursInPercent = Math.round(self.weekHours / appSettings.workingHourPerWeek * 100);
                self.weekHoursInFormat = formatHour(self.weekHours);
                /*lack of working hours of week*/
                self.lackOfHours = appSettings.workingHourPerWeek - self.weekHours;
                self.lackOfHoursInFormat = formatHour(self.lackOfHours);
                self.lackOfHoursInPercent = 100 - self.weekHoursInPercent;
            });
        });
    }, true);

    self.prevWeek = prevWeek;
    self.nextWeek = nextWeek;

    function getMonday(toDay) {
        var toDayCopy = new Date(toDay);
        var day = toDayCopy.getDay(),
            diff = toDayCopy.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
        var monday = new Date(toDayCopy.setDate(diff));
        return new Date(monday.getFullYear(), monday.getMonth(), monday.getDate(), 0, 0, 0);
    }

    function convertToJson(response) {
        var results = [];
        angular.forEach(response, function (item) {
            results.push({
                Action: item.get('Action'),
                Date: item.get('Date'),
                Description: item.get('Description'),
                Name: item.get('Name')
            })
        });
        return results;
    }
    function getTimeByDate(response) {
        var trackersUnderlaying = [];
        angular.forEach(response, function (tracker) {
            //var date = new Date(tracker.Date.iso);
            var date = new Date(tracker.Date);
            var shortDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 7, 0, 0, 0);
            var updatedItem = _.find(trackersUnderlaying, function (item) {
                return item.shortDate.toString() === shortDate.toString();
            });
            if (updatedItem) {
                if (tracker.Action === trackingServiceStartStr) {
                    updatedItem.checkin = updatedItem.checkin === undefined ? date : updatedItem.checkin;
                }
                if (tracker.Action === sessionLogOffStr) {
                    updatedItem.checkout = date;
                }
            }
            else {
                updatedItem = {};
                updatedItem.shortDate = shortDate;
                if (tracker.Action === trackingServiceStartStr) {
                    updatedItem.checkin = updatedItem.checkin === undefined ? date : updatedItem.checkin;
                }
                if (tracker.Action === sessionLogOffStr) {
                    updatedItem.checkout = date;
                }
                trackersUnderlaying.push(updatedItem);
            }
        });
        return trackersUnderlaying;
    }

    function calculateHoursPerDay(trackersUnderlaying) {
        angular.forEach(trackersUnderlaying, function (tracker) {
            if (!tracker.checkin || !tracker.checkout) {
                return;
            }
            var timeDiff = Math.abs(tracker.checkout.getTime() - tracker.checkin.getTime());
            tracker.duration = (timeDiff / (1000 * 3600)) - lunchTimeHour;
            tracker.durationInFormat = formatHour(tracker.duration);
        });

    }

    function formatHour(floatHour) {
        var hours = Math.floor(floatHour);
        var minutes = Math.round((floatHour - hours) * 60);
        return ("00" + (hours)).slice(-2) + ":" + ("00" + minutes).slice(-2);
    }

    function sumWeekHours() {
        return _.reduce(self.trackers, function (sum, item) {
            var duration = item.duration ? item.duration : 0;
            return sum + duration;
        }, 0);
    }

    function prevWeek() {
        self.toDay.addDates(-7);
    }

    function nextWeek() {
        self.toDay.addDates(7);
    }
}


angular.module('myApp.tracker').service('trackerService', trackingService);

trackingService.$inject = ["$q", "$timeout"]
function trackingService($q, $timeout) {
    this.init = function () {
        Parse.initialize("u4XKvtb4gCU0P7smzWI09ORk2Ytg933Elt4kxa6J", "l0KaCpkeUgCfwudDHaxrqPwem1IVuil0AwoL3Mun");
    }
    this.init();

    this.getTrackerByDate = function (dateFrom, dateTo) {
        var Tracker = Parse.Object.extend("Tracker");
        var query = new Parse.Query(Tracker);
        query.containedIn("Action", ["Tracking Service start !", "Session Log off"]);
        var dateFromCopy = new Date(dateFrom);
        var dateToCopy = new Date(dateTo);
        dateFromCopy.addHours(7);
        dateToCopy.addHours(7);
        query.greaterThan("Date", dateFromCopy);
        query.lessThan("Date", dateToCopy);
        query.ascending("Date");
        return query.find();


        //var deferred = $q.defer();

        //var results = [
        //    { "Action": "Tracking Service start !", "Date": { "__type": "Date", "iso": "2015-04-20T08:59:00.814Z" }, "Description": "Tracking Service start !", "Name": "orientsoftware\\lndlam", "createdAt": "2015-04-20T01:59:57.158Z", "objectId": "o4olpzVW8s", "updatedAt": "2015-04-20T01:59:57.158Z" },
        //     { "Action": "Session Log off", "Date": { "__type": "Date", "iso": "2015-04-20T18:23:39.314Z" }, "Description": "Session Log off", "Name": "orientsoftware\\lndlam", "createdAt": "2015-04-20T11:23:40.500Z", "objectId": "voo1lc3aG4", "updatedAt": "2015-04-20T11:23:40.500Z" },
        //     { "Action": "Tracking Service start !", "Date": { "__type": "Date", "iso": "2015-04-21T09:11:41.146Z" }, "Description": "Tracking Service start !", "Name": "orientsoftware\\lndlam", "createdAt": "2015-04-21T02:11:51.054Z", "objectId": "ANc4IMFHF2", "updatedAt": "2015-04-21T02:11:51.054Z" },
        //     { "Action": "Session Log off", "Date": { "__type": "Date", "iso": "2015-04-21T18:07:27.740Z" }, "Description": "Session Log off", "Name": "orientsoftware\\lndlam", "createdAt": "2015-04-21T11:07:29.229Z", "objectId": "ELnytb7wz6", "updatedAt": "2015-04-21T11:07:29.229Z" },
        //     { "Action": "Tracking Service start !", "Date": { "__type": "Date", "iso": "2015-04-22T09:18:37.461Z" }, "Description": "Tracking Service start !", "Name": "orientsoftware\\lndlam", "createdAt": "2015-04-22T02:18:48.511Z", "objectId": "3xlPJBpDSz", "updatedAt": "2015-04-22T02:18:48.511Z" },
        //     { "Action": "Session Log off", "Date": { "__type": "Date", "iso": "2015-04-22T18:29:13.497Z" }, "Description": "Session Log off", "Name": "orientsoftware\\lndlam", "createdAt": "2015-04-22T11:29:37.023Z", "objectId": "il7DboBivT", "updatedAt": "2015-04-22T11:29:37.023Z" },
        //     { "Action": "Tracking Service start !", "Date": { "__type": "Date", "iso": "2015-04-23T08:56:57.615Z" }, "Description": "Tracking Service start !", "Name": "orientsoftware\\lndlam", "createdAt": "2015-04-23T01:57:42.402Z", "objectId": "b08LLym66o", "updatedAt": "2015-04-23T01:57:42.402Z" },
        //     { "Action": "Session Log off", "Date": { "__type": "Date", "iso": "2015-04-23T18:20:10.273Z" }, "Description": "Session Log off", "Name": "orientsoftware\\lndlam", "createdAt": "2015-04-23T11:20:13.046Z", "objectId": "ikGC5wuIaY", "updatedAt": "2015-04-23T11:20:13.046Z" },
        //     { "Action": "Tracking Service start !", "Date": { "__type": "Date", "iso": "2015-04-24T08:58:27.389Z" }, "Description": "Tracking Service start !", "Name": "orientsoftware\\lndlam", "createdAt": "2015-04-24T01:58:45.797Z", "objectId": "e2ufUPaM3X", "updatedAt": "2015-04-24T01:58:45.797Z" }];

        //$timeout(function () {
        //    deferred.resolve(results);
        //}, 1000);

        //return deferred.promise;
    }

}