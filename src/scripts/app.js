'use strict';

var app = angular.module ("ng-app", [
  "ngTouch",
  "ngRoute",
  "templates"
])
  .config(['$httpProvider', '$compileProvider', '$routeProvider', function($httpProvider, $compileProvider, $routeProvider) {
    $routeProvider
      .when("/",{
        templateUrl: "map.html",
        controller: "MapController"
      })
      .when("/teaser/:url",{
        templateUrl: "teaser.html",
        controller: "TeaserController"
      })
      .when("/resultater/:path/:id?",{
        templateUrl: "table.html",
        controller: "TableController"
      })
      .otherwise({ redirectTo: '/' });

  }]);
