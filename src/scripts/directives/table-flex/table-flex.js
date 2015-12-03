app.directive('tableFlex', [ '$timeout', '$rootScope', function($timeout, $rootScope) {
  return {
    restrict : 'A',
    link : function(scope, element, attrs) {

      if(window.self === window.top) {
        // hot fix for mediaquery issue when implemented without iframe
        $rootScope.$watch(function () {
          return window.innerWidth;
        }, function () {
          if(element[0].clientWidth < 800){
            $timeout(function(){
              $rootScope.forceMobileView = true;
            });
          }else{
            $timeout(function(){
              $rootScope.forceMobileView = false;
            });
          }
        });
      }
    }
  };
}]);
