export default
  angular.module('services.branches', [
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
        if (res.data.markers) {
          this.markers = res.data.markers;
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

  .store('TopAttributesStore', function () {
    return {
      attributes: [],
      handlers: {
        'branches.load.success': 'onBranchesLoadSuccess',
        'branches.clear': 'onBranchesClear'
      },
      onBranchesLoadSuccess: function (res) {
        if (res.data.top_attributes) {
          this.attributes = res.data.top_attributes;
          this.emitChange();
        }
      },
      onBranchesClear: function () {
        this.markers = [];
        this.emitChange();
      },
      exports: {
        getTopAttributes: function () {
          return this.attributes;
        }
      }
    };
  })

  .store('BranchStore', function () {
    return {
      branches: [],
      totalCount: 0,
      eof: false,
      params: {},

      handlers: {
        'branches.load.success': 'onBranchesLoadSuccess',
        'branches.clear': 'onBranchesClear'
      },
      onBranchesLoadSuccess: function (res) {
        var data = res.data;
        this.params = res.params;
        this.totalCount = data.total;
        this.branches = this.branches.concat(data.items);
        if (this.branches.length >= this.totalCount || !data.items.length) {
          this.eof = true;
        }
        this.emitChange();
      },
      onBranchesClear: function () {
        this.state = null;
        this.branches = [];
        this.totalCount = 0;
        this.eof = false;
        this.params = {};
        this.emitChange();
      },
      exports: {
        getBranches: function () {
          return this.branches;
        },
        getCount: function () {
          return this.totalCount;
        },
        getParams: function () {
          return this.params;
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
      search: function (params) {
        flux.dispatch('branches.load', params);
        var d = $q.defer();
        api.branchSearch(params).then(function (res) {
          flux.dispatch('branches.load.success', {
            params: params,
            data: res
          });
          d.resolve(res);
          return res;
        }, function (err) {
          flux.dispatch('branches.load.failed', err);
          d.reject(err);
          return err;
        });
        return d.promise;
      },

      list: function (params) {
        flux.dispatch('branches.load', params);
        var d = $q.defer();
        api.branchList(params).then(function (res) {
          flux.dispatch('branches.load.success', {
            params: params,
            data: res
          });
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
      },

      filter(filters, update = true) {
        var params = update ? BranchStore.getParams() : {};
        if (!params.filter) {
          params.filter = {};
        }
        _.forEach(filters, (value, key) => {
          if (value === false) {
            delete params.filter[key];
          } else {
            params.filter[key] = value;
          }
        });
        this.clear();
        this.search(params);
      }
    };
  })
;
