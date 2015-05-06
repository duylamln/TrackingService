'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ui.router',
  'myApp.version',
  'myApp.tracker',
  'ngAnimate'
])
    .run(['$rootScope', '$state', '$stateParams', function ($rootScope, $state, $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
    }])
.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");

    $stateProvider
        .state('master', {
            url: '',
            templateUrl: 'shared/layout.html',
        })
        .state('master.home', {
            url: '/',
            template: '<p>This is Home page</p>'

        })
        .state('/notfound', { url: '/notfound', templateUrl: 'not-found.html' })
    //.otherwise({ redirectTo: '/view1' });
}])
.constant('appSettings', {
    workingHourPerDay: 8,
    workingHourPerWeek: 40,
    lunchHour: 1
});
