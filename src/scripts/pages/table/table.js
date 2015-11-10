app.controller("TableController", ["$scope", "$http", "$routeParams",  function($scope, $http, $routeParams) {

  var apiUrl;
  apiUrl = $routeParams.path;
  if ($routeParams.id) {
    apiUrl += "/" + $routeParams.id;
  }

  $scope.json = $scope.json || {};
  $scope.order = "-votes_pct";
  $scope.reverse = false;

  $scope.changeOrder = function(order) {
    if ($scope.order === order) {
      return $scope.reverse = !$scope.reverse;
    } else {
      $scope.order = order;
      return $scope.reverse = false;
    }

  };

  $http.get(apiIp + "/" + apiUrl).success(function(data) {
      return $scope.json.table = data;
    }
  ).error(function(data, status, headers, config) {
      return alert("Der var et problem med at skabe kontakt til vores server, prøv igen senere.");
    }
  );

}]);
