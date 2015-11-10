
app.controller("MapController", ["$scope", "$http", "$timeout", function($scope, $http, $timeout){

  var doubleClickCheck = false;
  var enableMouseover = false;

  $scope.json = $scope.json || {};
  $scope.json.map = {};

  $scope.detectmobile = function(){
    if(navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
      return true;
    }else {
      return false;
    }
  };

  $scope.toggleshowMan = function(value) {

    if(enableMouseover === false){
      return;
    }

    if(value === true || value === false){
      $scope.showMan = value
    } else if(!doubleClickCheck){
      doubleClickCheck = true;

      $scope.showMan = !$scope.showMan;

      $timeout(function(){
        doubleClickCheck = false
      }, 500);
    }


  };

  $http.get(apiIp+"/map").then(function(data){
    if(data.data) {
      $scope.json.map = data.data;
      if (data.data.votes_counted_pct >= 95 && data.data.blue_block.mandates != 0) {
        $scope.showMan = true;
        enableMouseover = true;
      }
    }
  }, function(data, status, headers, config){
    alert("Der var et problem med at skabe kontakt til vores server, prøv igen senere.");

  })


}]);
