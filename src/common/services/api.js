angular.module('services.api', [
  'app.config',
  'services.cache'
])
  .factory('api', ['$http', '$q', 'config', 'sessionStorage', '$injector', function($http, $q, config, sessionStorage, $injector) {
    var cache = sessionStorage;
    var buffers = {};

    var extend_promise = function(promise) {
      promise.wait = function(message, title) {
        var modalInstance = $injector.get('dialogs').wait(message, title);
        promise.then(modalInstance.dismiss, modalInstance.dismiss);
        return promise;
      };
      return promise;
    };

    var me = {

    };
    return me;
  }])
;
