import config from '../../../config.js';

export default angular
  .module('services.api', [
    'services.cache'
  ])
  .factory('api', function($http, $q, $injector) {
    var extend_promise = function(promise) {
      promise.wait = function(message, title) {
        var modalInstance = $injector.get('dialogs').wait(message, title);
        promise.then(modalInstance.dismiss, modalInstance.dismiss);
        return promise;
      };
      return promise;
    };

    let $rootScope = $injector.get('$rootScope');

    var me = {
      getUrl: function(action) {
        return config.endpoints.api + action;
      },

      doRequest: function(action, params, opts) {
        opts = _.assign({
          auth: true,
          refresh: false,
          method: 'GET'
        }, opts);

        params = _.transform(params || {}, function(res, v, k) {
          if (v !== null && v !== undefined) {
            res[k] = v;
          }
        });

        $rootScope.$broadcast('api.request_start', action, params);
        var d = $q.defer();
        $http(_.assign(opts, {
          url: me.getUrl(action),
          params: params
        })).success(function(res) {
          if (res.success) {
            d.resolve(res.result);
            $rootScope.$broadcast('api.request_success', action, res);
          } else {
            d.reject(res.error);
            $rootScope.$broadcast('api.request_failed', action, res);
          }
        }).error(function(data) {
          if (data && data.error) {
            d.reject(data.error);
          } else {
            d.reject();
          }
          $rootScope.$broadcast('api.request_failed', action, data);
        });
        return extend_promise(d.promise);
      },

      doGet: function() {
        return me.doRequest.apply(this, arguments);
      },

      doPost: function(action, params, opts) {
        opts = opts || {};
        opts.method = 'POST';
        return me.doRequest(action, params, opts);
      },

      doDelete: function(action, params, opts) {
        opts = opts || {};
        opts.method = 'DELETE';
        return me.doGet(action, params, opts);
      },

      branchSearch: function(params) {
        params.project_id = config.project.id;
        return me.doGet('/branch/search', params);
      },

      branchList: function(params) {
        params.project_id = config.project.id;
        return me.doGet('/branch/list', params);
      },

      branchGet: function(id) {
        var params = {
          id: id,
          project_id: config.project.id
        };
        return me.doGet('/branch', params).then(function (res) {
          return res.items[0];
        });
      },

      projectList: function(params) {
        return me.doGet('/project/list', params);
      },

      rubricList: function() {
        var params = {
          project_id: config.project.id
        };
        return me.doGet('/rubric/list', params);
      },

      postFeedback: function(feedback) {
        var params = {
          project_id: config.project.id
        };
        return me.doPost('/auth/feedback', params, {
          data: $.param(feedback),
          headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
      }
    };
    return me;
  })
;
