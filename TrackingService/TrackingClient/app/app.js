'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ui.router',
  'myApp.version',
  'myApp.tracker'
]).
config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/home");

    $stateProvider
        .state('home', { url: '/home', templateUrl: 'shared/layout.html' })
        .state('/notfound', {url: '/notfound', templateUrl:'not-found.html'})
        //.otherwise({ redirectTo: '/view1' });
}]);
