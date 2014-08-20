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
      getUrl: function(action) {
        return config.endpoints.api + action;
      },

      get: function(action, params, opts) {
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

        var d = $q.defer();
        $http(_.assign(opts, {
          url: me.getUrl(action),
          params: params
        })).success(function(res) {
          if (res.success) {
            d.resolve(res.result);
          } else {
            d.reject(res.error);
          }
        }).error(function(data) {
          if (data.error) {
            d.reject(data.error);
          } else {
            d.reject();
          }
        });
        return extend_promise(d.promise);
      },

      post: function(action, params, opts) {
        opts = opts || {};
        opts.method = 'POST';
        return me.get(action, params, opts);
      },

      del: function(action, params, opts) {
        opts = opts || {};
        opts.method = 'DELETE';
        return me.get(action, params, opts);
      },

      getCached: function(action, params, opts) {
        var url = action;
        if (params) {
          url += '?' + $.param(params);
        }

        var d = $q.defer();
        if (cache.exists(url) && !(opts && opts.nocache)) {
          d.resolve(cache.get(url));
        } else {
          if (!buffers[url]) {
            buffers[url] = [];

            me.get(action, params, opts).then(function(result) {
              cache.put(url, result);

              var defers = buffers[url];
              for (var i = 0; i < defers.length; i++) {
                defers[i].resolve(result);
              }
              delete buffers[url];
              return result;
            }, function(reason) {
              var defers = buffers[url];
              for (var i = 0; i < defers.length; i++) {
                defers[i].reject(reason);
              }
              delete buffers[url];
              return reason;
            });
          }
          buffers[url].push(d);
        }
        return extend_promise(d.promise);
      },

      branchSearch: function(params) {
        params.project_id = 1;
        params.start = 0;
        return me.get('/branch/search', params);
      }
    };
    return me;
  }])
;
