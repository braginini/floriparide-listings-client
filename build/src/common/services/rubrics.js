System.registerModule("src/common/services/rubrics.js", [], function() {
  "use strict";
  var __moduleName = "src/common/services/rubrics.js";
  var $__default = angular.module('services.rubrics', ['services.api']).store('RubricStore', ["sessionStorage", function(sessionStorage) {
    return {
      handlers: {'rubrics.load.success': 'onRubricsLoadSuccess'},
      onRubricsLoadSuccess: function(res) {
        if (res.items) {
          sessionStorage.put('rubrics', res.items);
          this.emitChange();
        }
      },
      exports: {getRubrics: function() {
          var res = sessionStorage.get('rubrics');
          return res ? res : [];
        }}
    };
  }]).factory('RubricActions', ["api", "flux", function(api, flux) {
    return {load: function() {
        flux.dispatch('rubrics.load');
        api.rubricList().then(function(res) {
          flux.dispatch('rubrics.load.success', res);
        }, function(err) {
          flux.dispatch('rubrics.load.failed', err);
        });
      }};
  }]);
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=src/common/services/rubrics.js
