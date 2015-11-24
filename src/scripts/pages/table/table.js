app.controller("TableController", ["$scope", "$http", "$routeParams", "tracker", "$timeout",  function($scope, $http, $routeParams, tracker, $timeout) {

  var doubleClickCheck = false;

  var apiUrl;
  apiUrl = $routeParams.path;
  if ($routeParams.id) {
    apiUrl += "/" + $routeParams.id;
  }

  $scope.json = $scope.json || {};
  $scope.order = "-votes_pct";
  $scope.reverse = false;

  $scope.changeOrder = function(order) {
    if(!doubleClickCheck) {
      doubleClickCheck = true;

      if ($scope.order === order) {
        $scope.reverse = !$scope.reverse;
      } else {
        $scope.order = order;
        $scope.reverse = false;
      }
      $timeout(function(){
        doubleClickCheck = false;
      },500);
    }
  };

  $scope.convertDate = function(datetime){
    return new Date(datetime);
  };

  $http.get(apiIp + "/" + apiUrl).success(function(data) {
      return $scope.json.table = data;
    }
  ).error(function(data, status, headers, config) {
      return alert("Der var et problem med at skabe kontakt til vores server, prøv igen senere.");
    }
  );

  tracker.track();

}]);
