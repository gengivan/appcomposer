// Generated by CoffeeScript 1.6.3
(function() {
  window.ut.tools.hypothesis.HypothesisApp.directive("freeinput", function() {
    return {
      restrict: "A",
      template: "<div\n  ng-model=\"dummy\"\n  class='ut_tools_hypothesis_template ut_tools_hypothesis_free'\n  jqyoui-draggable=\"{placeholder:true,animate:false}\"\n  data-jqyoui-options=\"{cursor: 'move', helper: 'clone', zIndex: '5000'}\"\n  data-drag=\"true\"\n  >\n  <div name=\"content\">Type your own!</div>\n  <textarea name=\"edit\" style=\"display: none\">dummy</textarea>\n</div>",
      link: function(scope, element, attrs) {
        var blurred;
        blurred = function() {
          element.find("[name='edit']").hide();
          element.find("[name='content']").text(element.find("[name='edit']").val());
          return element.find("[name='content']").show();
        };
        element.find("[name='edit']").keypress(function(event) {
          if (event.keyCode === 13) {
            return blurred();
          }
        });
        element.find("[name='edit']").blur(blurred);
        return element.find("[name='content']").click(function(event) {
          element.find("[name='edit']").val(element.find("[name='content']").text());
          element.find("[name='edit']").show();
          element.find("[name='content']").hide();
          return element.find("[name='edit']").focus();
        });
      }
    };
  });

  /*
      $(element).draggable {
        helper: "clone"
        #containment: "#ut_tools_questioning_table"
        cursor: "move"
        zIndex: "5000"
        start: (event, ui) ->
          $(ui.helper).css("margin-left", event.clientX - $(event.target).offset().left)
          $(ui.helper).css("margin-top", event.clientY - $(event.target).offset().top)
      }
  */


}).call(this);

/*
//@ sourceMappingURL=FreeInputView.map
*/
