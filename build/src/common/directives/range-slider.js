System.registerModule("src/common/directives/range-slider.js", [], function() {
  "use strict";
  var __moduleName = "src/common/directives/range-slider.js";
  var $__default = angular.module('directives.rangeSlider', []).directive('rangeSlider', ["$parse", function($parse) {
    return {
      restrict: 'EA',
      template: '<input type="number">',
      replace: true,
      link: function($scope, element, attrs) {
        var el = angular.element(element);
        var options = angular.extend({}, attrs);
        var onChange = attrs.rgChange ? $parse(attrs.rgChange) : function() {};
        options.onFinish = function(state) {
          onChange($scope, {$state: state});
        };
        el.ionRangeSlider(options);
      }
    };
  }]);
  ;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=src/common/directives/range-slider.js
