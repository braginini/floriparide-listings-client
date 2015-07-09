System.registerModule("src/common/directives/delegate.js", [], function() {
  "use strict";
  var __moduleName = "src/common/directives/delegate.js";
  var dgEventDirectives = {};
  angular.forEach('Click Dblclick Mousedown Mouseup Mouseover Mouseout Mousemove Mouseenter Mouseleave'.split(' '), function(name) {
    var directiveName = 'dg' + name;
    dgEventDirectives[directiveName] = ['$parse', function($parse) {
      return function(scope, element, attrs) {
        var fn = $parse(attrs[directiveName]);
        element.bind(name.toLowerCase(), function(evt) {
          scope.$apply(function() {
            fn(angular.element(evt.target).scope(), {$event: evt});
          });
        });
      };
    }];
  });
  var $__default = angular.module('directives.delegate', []).directive(dgEventDirectives);
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=src/common/directives/delegate.js
