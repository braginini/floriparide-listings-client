System.registerModule("src/common/directives/feedback/feedback.js", [], function() {
  "use strict";
  var __moduleName = "src/common/directives/feedback/feedback.js";
  var $__default = angular.module('directives.feedback', []).directive('feedback', function() {
    return {
      restrict: 'EA',
      templateUrl: 'directives/feedback/feedback.tpl.html',
      replace: true,
      scope: true,
      link: function($scope, $element) {
        $element.removeClass('hidden');
        $scope.rootClassName = $element[0].className;
        $element.removeClass();
      },
      controller: ["$scope", "api", function($scope, api) {
        $scope.isFormVisible = false;
        $scope.showSuccessPanel = false;
        $scope.clear = function() {
          $scope.model = {
            rating: 0,
            name: null,
            email: null,
            body: null
          };
        };
        $scope.clear();
        $scope.toggleForm = function() {
          $scope.isFormVisible = !$scope.isFormVisible;
        };
        $scope.onSubmit = function() {
          api.postFeedback($scope.model).then(function() {
            $scope.isFormVisible = false;
            $scope.showSuccessPanel = true;
            $scope.clear();
          });
        };
        $scope.closeSuccessPanel = function() {
          $scope.showSuccessPanel = false;
        };
      }]
    };
  });
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=src/common/directives/feedback/feedback.js
