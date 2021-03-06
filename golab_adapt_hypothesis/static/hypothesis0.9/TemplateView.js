// Generated by CoffeeScript 1.6.3
(function() {
  window.ut.tools.hypothesis.HypothesisApp.directive("template", function() {
    return {
      restrict: "A",
      template: "<div\n  class='ut_tools_hypothesis_template'\n  ng-model=\"element\"\n  ng-class='{ut_tools_hypothesis_conditional: element.type==\"conditional\",\n  ut_tools_hypothesis_output: element.type==\"output\",\n  ut_tools_hypothesis_input: element.type==\"input\",\n  ut_tools_hypothesis_free: element.type==\"free\"}'\n  jqyoui-draggable=\"{placeholder:true,animate:false}\"\n  data-jqyoui-options=\"{cursor: 'move', helper: 'clone', zIndex: '5000'}\"\n  data-drag=\"true\"\n  >{{element.text}}\n</div>",
      link: function(scope, element, attrs) {}
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
//@ sourceMappingURL=TemplateView.map
*/
