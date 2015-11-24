app.directive('blockPoll', ["$window", "$filter", function($window, $filter) {
  return {
    restrict: "A",
    link: function(scope, element, attrs){
      var firstRun = true;
      var yesBlockLabel = null;
      var noBlockLabel = null;
      var yesBlockValue = null;
      var noBlockValue = null;
      var svgWidth = null;
      var xScale = null;
      var xTotal= null;

      var svg = d3.select(element[0]).append("svg")
        .attr("width", "100%")
        .attr("height", "100%");


      var render = function(data){

        var noBlockRect, yesBlockRect, svgHeight;
        if (data.results.JA.votes_pct === null  || data.results.NEJ.votes_pct === null ) {
          return;
        }
        svgWidth = d3.select(element[0])[0][0].offsetWidth;
        svgHeight = d3.select(element[0])[0][0].offsetHeight;
        xTotal = data.results.JA.votes_pct + data.results.NEJ.votes_pct;
        if (xTotal === 0) {
          xTotal = 2;
        }
        xScale = d3.scale.linear().domain([0, xTotal]).range([0, svgWidth]);
        yesBlockRect = svg.selectAll(".red.block-rect").data([data.results.JA]);
        yesBlockRect.enter().append("rect").attr("class", "red block-rect").attr("height", svgHeight).attr("width", 0).attr("y", 0).attr("x", 0);
        yesBlockRect.transition().duration(1000).attr("width", function(d) {
            if (d.votes_pct === 0 && xTotal === 2) {
              return xScale(1);
            } else {
              return xScale(d.votes_pct);
            }
          }
        );
        yesBlockLabel = svg.selectAll(".red.block-value").data([data.results.JA]);
        yesBlockLabel.enter().append("text").attr("class", "red block-value").attr("x", 10).attr("y", 38).attr("text-anchor", "start");
        yesBlockLabel.text(function(d) {
            return "JA";
          }
        );
        yesBlockValue = svg.selectAll(".red.block-letters").data([data.results.JA]);
        yesBlockValue.enter().append("text").attr("class", "red block-letters").attr("y", 38).attr("text-anchor", "end");
        yesBlockValue.text(function(d) {
            return ($filter('number')(d.votes_pct)) + " %";
          }
        ).transition().duration(1000).attr("x", function(d) {
            return xScale(d.votes_pct) - 25;
          }
        );
        noBlockRect = svg.selectAll(".blue.block-rect").data([data.results.NEJ]);
        noBlockRect.enter().append("rect").attr("class", "blue block-rect").attr("height", svgHeight).attr("width", 0).attr("y", 0).attr("x", svgWidth);
        noBlockRect.transition().duration(1000).attr("x", function(d) {
            if (d.votes_pct === 0 && xTotal === 2) {
              return svgWidth - xScale(1);
            } else {
              return svgWidth - xScale(d.votes_pct);
            }
          }
        ).attr("width", function(d) {
            if (d.votes_pct === 0 && xTotal === 2) {
              return xScale(1);
            } else {
              return xScale(d.votes_pct);
            }
          }
        );
        noBlockLabel = svg.selectAll(".blue.block-value").data([data.results.NEJ]);
        noBlockLabel.enter().append("text").attr("class", "blue block-value").attr("x", svgWidth - 10).attr("y", 38).attr("text-anchor", "end");
        noBlockLabel.text(function(d) {
            return "NEJ";
          }
        );
        noBlockValue = svg.selectAll(".blue.block-letters").data([data.results.NEJ]);
        noBlockValue.enter().append("text").attr("class", "blue block-letters").attr("y", 38).attr("text-anchor", "start");
        noBlockValue.text(function(d) {
            return ($filter('number')(d.votes_pct)) + " %";
          }
        ).transition().duration(1000).attr("x", function(d) {
            return svgWidth - xScale(d.votes_pct) + 25;
          }
        );
        if(xScale(data.results.JA.votes_pct) <= 105 || xScale(data.results.NEJ.votes_pct) <= 105){
          noBlockValue.attr("display", "none");
          yesBlockValue.attr("display", "none");
          noBlockLabel.style({"font-size": "20px"}).attr("y", 32);
          yesBlockLabel.style({"font-size": "20px"}).attr("y", 32);
        }else if(xScale(data.results.JA.votes_pct) <= 150 || xScale(data.results.NEJ.votes_pct) <= 150) {
          noBlockValue.style({"font-size": "14px"}).attr("y", 30);
          yesBlockValue.style({"font-size": "14px"}).attr("y", 30);
          noBlockLabel.style({"font-size": "14px"}).attr("y", 30);
          yesBlockLabel.style({"font-size": "14px"}).attr("y", 30);
        } else if(xScale(data.results.JA.votes_pct) <= 200 || xScale(data.results.NEJ.votes_pct) <= 200) {
          noBlockValue.style({"font-size": "20px"}).attr("y", 32);
          yesBlockValue.style({"font-size": "20px"}).attr("y", 32);
          noBlockLabel.style({"font-size": "20px"}).attr("y", 32);
          yesBlockLabel.style({"font-size": "20px"}).attr("y", 32);
        } else if (xScale(data.results.JA.votes_pct) <= 240 || xScale(data.results.NEJ.votes_pct) <= 240) {
          noBlockValue.style({"font-size": "30px"}).attr("y", 35);
          yesBlockValue.style({"font-size": "30px"}).attr("y", 35);
          noBlockLabel.style({"font-size": "30px"}).attr("y", 35);
          yesBlockLabel.style({"font-size": "30px"}).attr("y", 35);
          yesBlockLabel.text(function(d) {
              return "JA";
            }
          );
          return noBlockLabel.text(function(d) {
              return "NEJ";
            }
          );
        }
      };

      $window.onresize = function(){
        scope.$apply();
      };

      scope.$watch(function(){
          return angular.element($window)[0].innerWidth;
        },function(){
          if(firstRun){
            return
          }
          svg.selectAll("*").remove();
          render(scope.json.map);
        }
      );

      scope.$watchCollection("json.map.results", function(data) {
        if(data){
          firstRun = false;
          render(scope.json.map);
        }
      });

      scope.$watch("showPer", function(data){
        if(data === false && xScale(scope.json.map.results.JA.votes_pct) >= 280 && xScale(scope.json.map.results.NEJ.votes_pct) >= 280) {
          yesBlockValue.text(function(d){
            return ($filter('number')(d.votes))+" stemmer";
          }).style({"font-size": "20px", "text-transform":"none" }).attr("y", 32);
          noBlockValue.text(function(d) {
            return ($filter('number')(d.votes))+" stemmer";
          }).style({"font-size": "20px", "text-transform":"none" }).attr("y", 32);

        }else if(data === true) {

          yesBlockValue.text(function (d) {
            return ($filter('number')(d.votes_pct)) + " %";
          });
          noBlockValue.text(function (d) {
            return ($filter('number')(d.votes_pct)) + " %";
          });


          if (xScale(scope.json.map.results.JA.votes_pct) <= 150 || xScale(scope.json.map.results.NEJ.votes_pct) <= 150) {
            noBlockValue.style({"font-size": "14px"}).attr("y", 30);
            yesBlockValue.style({"font-size": "14px"}).attr("y", 30);
          } else if (xScale(scope.json.map.results.JA.votes_pct) <= 200 || xScale(scope.json.map.results.NEJ.votes_pct) <= 200) {
            noBlockValue.style({"font-size": "20px"}).attr("y", 32);
            yesBlockValue.style({"font-size": "20px"}).attr("y", 32);
          } else if (xScale(scope.json.map.results.JA.votes_pct) <= 240 || xScale(scope.json.map.results.NEJ.votes_pct) <= 240) {
            noBlockValue.style({"font-size": "30px"}).attr("y", 35);
            yesBlockValue.style({"font-size": "30px"}).attr("y", 35);
          } else{
            noBlockValue.style({"font-size": "40px"}).attr("y", 38);
            yesBlockValue.style({"font-size": "40px"}).attr("y", 38);

          }
        }
      });

    }
  }

}]);
