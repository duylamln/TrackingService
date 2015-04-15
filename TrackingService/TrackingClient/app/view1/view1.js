'use strict';

angular.module('myApp.view1', ['ui.router'])

.config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('home.view1', {
        url: '/view1',
        templateUrl: 'view1/view1.html',
        controller: 'View1Ctrl'
    })
}])

.controller('View1Ctrl', [function() {

}]);