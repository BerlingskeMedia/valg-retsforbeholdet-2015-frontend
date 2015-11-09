
app.directive('electionThemer', function(){

    return {
      restrict: 'A',
      link: function(scope, element, attrs){
        var themename = '';

        var themeItUp = function(){
          var stylesheet = document.getElementById('themecss');
          stylesheet.setAttribute("href", 'themes/' + themename + '.css')

        };

        // todo: setup electionThemer functionality when the directive becomes relevant
        if(window.location != window.parent.location){
          // the page is in an iframe
          /*
           window.addEveneListener "message", (event) ->
           themename = evnet.data
           themeItUp()
          */
        }else{
          // the page is not in an iframe

          /*
          themename = attrs.electionThemer

            if (themename != '') {
              themeItUp()
            }*/
        }


      }
    };
  });


