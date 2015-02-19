(function () {
  angular.module('services.branches', [
    'app.config',
    'services.api'
  ])
    .store('MarkerStore', function () {
      return {
        markers: [],
        handlers: {
          'branches.load.success': 'onBranchesLoadSuccess',
          'branches.clear': 'onBranchesClear'
        },
        onBranchesLoadSuccess: function (res) {
          if (res.markers) {
            this.markers = res.markers;
            this.emitChange();
          }
        },
        onBranchesClear: function () {
          this.markers = [];
          this.emitChange();
        },
        exports: {
          getMarkers: function () {
            return this.markers;
          }
        }
      };
    })

    .store('BranchStore', function () {
      return {
        branches: [],
        totalCount: 0,
        eof: false,

        handlers: {
          'branches.load.success': 'onBranchesLoadSuccess',
          'branches.clear': 'onBranchesClear'
        },
        onBranchesLoadSuccess: function (res) {
          this.totalCount = res.total;
          this.branches = this.branches.concat(res.items);
          if (this.branches.length >= this.totalCount || !res.items.length) {
            this.eof = true;
          }
          this.emitChange();
        },
        onBranchesClear: function () {
          this.state = null;
          this.branches = [];
          this.totalCount = 0;
          this.eof = false;
          this.emitChange();
        },
        exports: {
          getBranches: function () {
            return this.branches;
          },
          getCount: function () {
            return this.totalCount;
          },
          isEof: function () {
            return this.eof;
          }
        }
      };
    })

    .factory('BranchActions', function (api, flux, $q) {
      var loadData = function (params) {
        flux.dispatch('branches.load', params);
        var d = $q.defer();
        api.branchSearch(params).then(function (res) {
          flux.dispatch('branches.load.success', res);
          d.resolve(res);
          return res;
        }, function (err) {
          flux.dispatch('branches.load.failed', err);
          d.reject(err);
          return err;
        });
        return d.promise;
      };

      return {
        load: loadData
      };
    });
})();
