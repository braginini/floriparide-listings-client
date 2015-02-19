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

    .store('SelectedBranchStore', function () {
      return {
        selected: null,

        handlers: {
          'branches.select.success': 'onBranchesSelectSuccess'
        },
        onBranchesSelectSuccess: function (branch) {
          this.selected = branch;
          this.emitChange();
        },
        exports: {
          getSelected: function () {
            return this.selected;
          },
          getSelectedId: function () {
            return this.selected ? this.selected.id : null;
          }
        }
      };
    })

    .factory('BranchActions', function (api, flux, $q, BranchStore) {
      return {
        clear: function () {
          flux.dispatch('branches.clear');
        },
        load: function (params) {
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
        },

        select: function (id) {
          var d = $q.defer();
          if (id === null) {
            flux.dispatch('branches.select.success', null);
            d.resolve(null);
            return;
          }
          id = parseInt(id);
          var b = _.find(BranchStore.getBranches(), {id: id});
          if (b) {
            flux.dispatch('branches.select.success', b);
            d.resolve(b);
          } else {
            api.branchGet(id).then(function (b) {
              d.resolve(b);
              flux.dispatch('branches.select.success', b);
              return b;
            }, function (err) {
              d.reject(err);
              flux.dispatch('branches.select.failed', err);
              return err;
            });
          }
          return d.promise;
        }
      };
    });
})();
