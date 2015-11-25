app.directive('electionMap', ["$filter", "$location", "$rootScope", "$sce", function($filter, $location, $rootScope, $sce) {
  return {
    restrict: "A",
    templateUrl: $sce.trustAsResourceUrl("http://bem-hosting-valg.s3-website-eu-west-1.amazonaws.com/retsforbeholdet_2015/election-map.html"),
    link: function(scope, element, attrs){
      var svg = d3.select("#dk_valgkredse");
      var tip = d3.tip()
        .attr("class", "map-tip")
        .html(function(data){
          var red = $filter('number')(data.results.JA.votes_pct, 1);
          var blue = $filter('number')(data.results.NEJ.votes_pct, 1);
          var counted = $filter('number')(data.votes_pct, 1);

          var html = "<h2 class=\"map-tip-header\">";
          if(data.status_code === 12){
            html+= "<div class=\"map-tip-counted\">Alle stemmer optalt</div>";
          }else if(data.status_code != 0){
            html+= "<div class=\"map-tip-counted\">Afventer fintælling</div>";
          }
          html += data.name + "</h2>";
          if (data.status_code === 0) {
            html += "<p>Afventer optælling fra kredsen.</p>";
          }
          if (data.blue_block_votes_pct !== 0 && data.status_code !== 0) {
            html += "<div class=\"map-tip-block\">";
            html += "<div class=\"map-tip-red\">" + red + "%</div>";
            html += "<div class=\"map-tip-blue\" style=\"width:" + data.results.NEJ.votes_pct + "%\">" + blue + "%</div>";
            html += "</div>";
          }

          return html;
        });

      // function for setting map color-classes depending on poll results
      // todo: setup correct color mapping classes for map view (not red/blue)
      var classes = function (block, statuscode){
        if(block === "JA"){
          if(statuscode === 12) {
            return "red";
          }else if(statuscode != 0){
            return "light-red";
          }else{
            return "neutral";
          }

        }else if(block === "NEJ"){

          if(statuscode === 12) {
            return "blue";
          }else if(statuscode != 0){
            return "light-blue";
          }else{
            return "neutral";
          }
        }else{
          return "neutral";
        }
      };

      var render = function(data){

        angular.forEach(data, function(constituency){
          // match constituency.ident to map id eg. op-kreds- + XX
          var mapId = "op-kreds-"+constituency.ident;
          //var mapId = constituency.ident.replace("K", "op-kreds-");

          svg.select("#" + mapId).data([constituency])
            .attr("class", function(d) {
              return "map " + (classes(d.winner, d.status_code));
            })
            .on("mouseover", function(d) {
              var parentRect, targetRect, tipDirection;
              d3.select(this).attr("class", "map selected");
              tipDirection = '';
              targetRect = this.getBBox();
              parentRect = svg[0][0].getBBox();
              if (targetRect.y > parentRect.height / 2) {
                tipDirection = 'n';
              } else {
                tipDirection = 's';
              }
              if (targetRect.x > parentRect.width / 2) {
                tipDirection += 'w';
              } else {
                tipDirection += 'e';
              }
              return tip.direction(tipDirection).show(d);
            })
            .on("mouseout", function(d) {
              d3.select(this).attr("class", "map " + (classes(d.winner, d.status_code)));
              return tip.hide();
            })
            .on("click", function(d) {
              tip.destroy();
              return scope.$apply(function() {
                  return $location.path("resultater" + d.path);
                });
            });

        });

      };

      svg.call(tip);

      scope.$watchCollection("json.map.constituencies", function(data){
        if(data)
          render(data)
      });


    }

  }

}]);
