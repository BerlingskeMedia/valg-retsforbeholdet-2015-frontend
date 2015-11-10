
app.controller("TeaserController", ["$scope", "$http", "$timeout", "$routeParams", function($scope, $http, $timeout, $routeParams) {

  var doubleClickCheck = false;
  var enableMouseover = false;

  $scope.json = $scope.json || {};
  $scope.json.map = {};
  $scope.appUrl = "http://" + ($routeParams.url.replace('-', '/'));

  $scope.toggleshowPer = function(value) {
    if (enableMouseover === false) {
      return;
    }
    if (value === true || value === false) {
      $scope.showPer = value;

    } else if (!doubleClickCheck) {
      doubleClickCheck = true;
      $scope.showPer = !$scope.showPer;

      $timeout(function() {
          doubleClickCheck = false;
        }, 500);
    }
  };

  $http.get(apiIp + "/map").then(function(data) {
      if(data.data) {
        $scope.json.map = data.data;
        if (data.data.results && data.data.results.JA.votes_pct + data.data.results.NEJ.votes_pct >= 95) {
          $scope.showPer = true;
          enableMouseover = true;
        }
      }
    }, function(data, status, headers, config) {}
  );

}]);
