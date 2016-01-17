export default angular
  .module('services.dialogs', [
    'ui.bootstrap.modal',
    'template/modal/backdrop.html',
    'template/modal/window.html'
  ])
  .factory('dialogs', function ($uibModal) {
    var me = {
      open: function (config) {
        config = _.assign({
          templateUrl: 'services/dialogs/dialog.tpl.html',
          controller: 'DialogCtrl',
          windowClass: 'dialogs'
        }, config);
        return $uibModal.open(config);
      },

      confirm: function (message, title) {
        return me.open({
          resolve: {
            params: function() {
              return {
                message: message,
                title: title ? title : 'Подтверждение',
                btnOk: true,
                btnCancel: true
              };
            }
          },
          windowClass: 'dialogs dialog-confirm'
        });
      },

      wait: function (message, title) {
        return me.open({
          templateUrl: 'services/dialogs/wait.tpl.html',
          controller: 'WaitDialogCtrl',
          keyboard: false,
          backdrop: 'static',
          resolve: {
            params: function() {
              return {
                title: title ? title : 'Пожалуйста ждите',
                message: message
              };
            }
          },
          windowClass: 'dialogs dialog-confirm'
        });
      }
    };
    return me;
  })

  .controller('DialogCtrl', function ($scope, $uibModalInstance, params) {
    $scope.btnOk = params.btnOk;
    $scope.btnCancel = params.btnCancel;
    $scope.isButtons = $scope.btnOk || $scope.btnCancel;
    $scope.title = params.title;
    $scope.message = params.message;
    $scope.ok = function () {
      $uibModalInstance.close(true);
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss(false);
    };
  })

  .controller('WaitDialogCtrl', function ($scope, $uibModalInstance, $interval, params) {
    $scope.title = params.title;
    $scope.message = params.message;
    $scope.progress = 20;
    var task = $interval(function() {
      $scope.progress = ($scope.progress + 20);
      if ($scope.progress > 100) {
        $scope.progress = $scope.progress % 100;
      }
    }, 1000);

    $uibModalInstance.result['catch'](function() {
      $interval.cancel(task);
    });
  })
;
