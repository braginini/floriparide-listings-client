export default angular
  .module('directives.feedback', [])
  .directive('feedback', function () {
    return {
      restrict: 'EA',
      templateUrl: 'directives/feedback/feedback.tpl.html',
      replace: true,
      scope: true,
      link: ($scope, $element) => {
        $scope.rootClassName = $element[0].className;
        $element.removeClass();
      },
      controller: ($scope, api) => {

        $scope.isFormVisible = false;
        $scope.showSuccessPanel = false;
        $scope.clear = () => {
          $scope.model = {
            rating: 0,
            name: null,
            email: null,
            body: null
          };
        };
        $scope.clear();

        $scope.toggleForm = () => {
          $scope.isFormVisible = !$scope.isFormVisible;
        };

        $scope.onSubmit = () => {
          api.postFeedback($scope.model).then(() => {
            $scope.isFormVisible = false;
            $scope.showSuccessPanel = true;
            $scope.clear();
          });
        };

        $scope.closeSuccessPanel = () => {
          $scope.showSuccessPanel = false;
        };
      }
    };
  });
