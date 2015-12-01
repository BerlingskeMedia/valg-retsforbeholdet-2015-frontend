'use strict';
//var apiIp = "//fv15api.bemit.dk";
//var apiIp = "//10.86.233.41:8081/fake";
//var apiIp = "http://10.86.233.41:8081";
var apiIp = "http://retsforbeholdet2015.bemit.dk";

var app = angular.module ("ng-app", [
  "ngTouch",
  "ngRoute",
  "templates",
  "n3-pie-chart",
  "ngSanitize"

])
  .config(['$httpProvider', '$compileProvider', '$routeProvider', function($httpProvider, $compileProvider, $routeProvider) {

    $compileProvider.debugInfoEnabled(true);

    $routeProvider
      .when("/",{
        templateUrl: "map.html",
        controller: "MapController"
      })
      .when("/teaser",{
        templateUrl: "teaser.html",
        controller: "TeaserController"
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
