
app.directive('electionThemer', function(){

    return {
      restrict: 'A',
      link: function(scope, element, attrs){
        var themename = '';

        var themeItUp = function(){
          var stylesheet = document.getElementById('themecss');
          stylesheet.setAttribute("href", 'themes/' + themename + '.css')

        };

        if(window.location != window.parent.location){
          window.addEventListener("message", function(event) {
              themename = event.data;
              return themeItUp();
            }
          );
        }else{
            themename = attrs.electionThemer;
        }
        if (themename !== '') {
          return themeItUp();
        }

      }
    };
  });


