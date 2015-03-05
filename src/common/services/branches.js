export default
  angular.module('services.branches', [
    'services.api'
  ])
  .store('MarkerStore', function () {
    return {
      markers: [],
      handlers: {
        'branches.load.success': 'onBranchesLoadSuccess',
        'branches.clear': 'onBranchesClear',
        'branches.data.clear': 'onBranchesClear'
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
        'branches.clear': 'onBranchesClear',
        'branches.data.clear': 'onBranchesClear'
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

  .store('BranchLoadingStore', function () {
    return {
      _isLoading: false,
      _lastError: null,

      handlers: {
        'branches.load': 'onBranchesLoad',
        'branches.load.success': 'onBranchesLoadSuccess',
        'branches.load.failed': 'onBranchesLoadFailed'
      },
      onBranchesLoad: function () {
        this._isLoading = true;
        this._lastError = null;
        this.emitChange();
      },
      onBranchesLoadSuccess: function () {
        this._isLoading = false;
        this._lastError = null;
        this.emitChange();
      },
      onBranchesLoadFailed: function (e) {
        this._isLoading = false;
        this._lastError = e;
        this.emitChange();
      },
      exports: {
        isLoading: function () {
          return this._isLoading;
        },
        getLastError: function () {
          return this._lastError;
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
      clearData: function () {
        flux.dispatch('branches.data.clear');
      },
      search: function (params) {
        flux.dispatch('branches.load', params);
        api.branchSearch(params).then(function (res) {
          flux.dispatch('branches.load.success', {
            params: params,
            data: res
          });
          return res;
        }, function (err) {
          flux.dispatch('branches.load.failed', err);
          return err;
        });
      },

      list: function (params) {
        flux.dispatch('branches.load', params);
        api.branchList(params).then(function (res) {
          flux.dispatch('branches.load.success', {
            params: params,
            data: res
          });
          return res;
        }, function (err) {
          flux.dispatch('branches.load.failed', err);
          return err;
        });
      },

      select: function (id) {
        if (id === null) {
          flux.dispatch('branches.select.success', null);
          return;
        }
        id = parseInt(id);
        var b = _.find(BranchStore.getBranches(), {id: id});
        if (b) {
          flux.dispatch('branches.select.success', b);
        } else {
          api.branchGet(id).then(function (b) {
            flux.dispatch('branches.select.success', b);
            return b;
          }, function (err) {
            flux.dispatch('branches.select.failed', err);
            return err;
          });
        }
      },

      filter(filters, update = true) {
        var params = update ? BranchStore.getParams() : {};
        if (!params.filters) {
          params.filters = {};
        }
        _.forEach(filters, (value, key) => {
          if (value === false) {
            delete params.filters[key];
          } else {
            params.filters[key] = value;
          }
        });
        this.clearData();
        this.search(params);
      }
    };
  })
;
