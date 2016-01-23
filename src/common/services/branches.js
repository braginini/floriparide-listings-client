var mapBranch = b => {
  b.fullname = b.name;
  if (b.headline) {
    b.fullname += ', ' + b.headline.toLowerCase();
  }
  return b;
};

export default
  angular.module('services.branches', [
    'services.api'
  ])
  .store('MarkerStore', function () {
    return {
      initialize() {
        this.state = this.immutable({
          markers: []
        });
      },
      handlers: {
        'branches.load.success': 'onBranchesLoadSuccess',
        'branches.clear': 'onBranchesClear'
      },
      onBranchesLoadSuccess(res) {
        if (res.markers) {
          this.state.set('markers', res.markers);
        }
      },
      onBranchesClear() {
        this.state.set('markers', []);
      },
      exports: {
        get markers() {
          return this.state.get('markers');
        }
      }
    };
  })

  .store('TopAttributesStore', function () {
    var process_attr_group = function(groups) {
      _.forEach(groups, g => {
        _.forEach(g.attributes, a => {
          if (a.suffix) {
            if (a.suffix.substr(0, 1) === '^') {
              a.prefix = a.suffix.substr(1) + '&nbsp';
              a.suffix = null;
            } else {
              a.suffix = '&nbsp' + a.suffix;
            }
          }
        });
      });
    };
    return {
      initialize() {
        this.state = this.immutable({
          attributes: []
        });
      },
      handlers: {
        'branches.load.success': 'onBranchesLoadSuccess'
        //'branches.clear': 'onBranchesClear'
      },
      onBranchesLoadSuccess(res) {
        if (res.top_attributes) {
          process_attr_group(res.top_attributes);
          this.state.set('attributes', res.top_attributes);
        }
      },
      onBranchesClear() {
        this.state.set('attributes', []);
      },
      exports: {
        get topAttributes() {
          return this.state.get('attributes');
        }
      }
    };
  })

  .store('AvailableAttributesStore', function () {
    return {
      initialize() {
        this.state = this.immutable({
          attributes: null
        });
      },
      handlers: {
        'branches.load.success': 'onBranchesLoadSuccess',
        'branches.clear': 'onBranchesClear'
      },
      onBranchesLoadSuccess(res) {
        if (res.has_attributes) {
          this.state.set('attributes', res.has_attributes);
        }
      },
      onBranchesClear() {
        this.state.set('attributes', null);
      },
      exports: {
        get attributes() {
          return this.state.get('attributes');
        }
      }
    };
  })

  .store('BranchStore', function (config) {
    return {
      initialize() {
        this.state = this.immutable({
          branches: [],
          totalCount: 0,
          eof: false,
          params: {}
        });
      },

      handlers: {
        'branches.load': 'onBranchesLoad',
        'branches.load.success': 'onBranchesLoadSuccess',
        'branches.clear': 'onBranchesClear',
        'locale.changed': 'onLocaleChanged'
      },
      onBranchesLoad(params) {
        this.state.set('params',_.assign({
          locale: config.clientLocale
        }, params));
      },
      onBranchesLoadSuccess(res) {
        this.state.set('totalCount', res.total);
        this.state.concat('branches', _.map(res.items, mapBranch));
        if (this.state.get('branches').length >= res.total || !res.items.length) {
          this.state.set('eof', true);
        }
      },
      onBranchesClear() {
        this.state.merge({
          branches: [],
          totalCount: 0,
          eof: false
        });
        //this.params = {};
      },
      onLocaleChanged() {
        this.onBranchesClear();
        this.state.set('params', {});
      },
      exports: {
        get branches() {
          return this.state.get('branches');
        },
        get count() {
          return this.state.get('totalCount');
        },
        get params() {
          return _.clone(this.state.get('params'));
        },
        get isEof() {
          return this.state.get('eof');
        }
      }
    };
  })

  .store('BranchLoadingStore', function () {
    return {
      initialize() {
        this.state = this.immutable({
          isLoading: false,
          lastError: null
        });
      },

      handlers: {
        'branches.load': 'onBranchesLoad',
        'branches.load.success': 'onBranchesLoadSuccess',
        'branches.load.failed': 'onBranchesLoadFailed'
      },
      onBranchesLoad() {
        this.state.set('isLoading', true);
        this.state.set('lastError', null);
      },
      onBranchesLoadSuccess() {
        this.state.set('isLoading', false);
        this.state.set('lastError', null);
      },
      onBranchesLoadFailed(error) {
        this.state.set('isLoading', false);
        this.state.set('lastError', error);
      },
      exports: {
        get isLoading() {
          return this.state.get('isLoading');
        },
        get lastError() {
          return this.state.get('lastError');
        }
      }
    };
  })

  .store('SelectedBranchStore', function ($q) {
    var listeners = [];
    return {
      initialize() {
        this.state = this.immutable({
          selected: null
        });
      },

      handlers: {
        'branches.select.success': 'onBranchesSelectSuccess',
        'locale.changed': 'onLocaleChanged'
      },
      onBranchesSelectSuccess(branch) {
        this.state.set('selected', branch);
        if (listeners.length) {
          _.forEach(listeners, l=> l.resolve(branch));
          listeners = [];
        }
      },
      onLocaleChanged() {
        this.state.set('selected', null);
      },
      exports: {
        get selected() {
          return this.state.get('selected');
        },
        get selectedId() {
          var selected = this.state.get('selected');
          return selected ? selected.id : null;
        },
        wait() {
          var d = $q.defer();
          listeners.push(d);
          return d.promise;
        }
      }
    };
  })

  .factory('BranchActions', function (api, flux, $q, BranchStore/*, BranchLoadingStore*/) {
    return {
      clear() {
        flux.dispatch('branches.clear');
      },
      search(params, clear=false) {
        //if (BranchLoadingStore.isLoading()) {
        //  return;
        //}
        var oldParams = BranchStore.params;
        // we need full_response to get attributes
        delete params.send_attrs;
        var method = 'branchSearch';
        if (params.rubric_id >= 0) {
          method = 'branchList';
          delete params.q;
          if (params.rubric_id !== oldParams.rubric_id) {
            params.send_attrs = true;
          }
        } else {
          if (params.q !== oldParams.q) {
            params.send_attrs = true;
          }
        }

        flux.dispatch('branches.load', params);
        api[method](params).then(res => {
          if (clear) {
            this.clear();
          }
          flux.dispatch('branches.load.success', res);
          return res;
        }, err => {
          flux.dispatch('branches.load.failed', err);
          return err;
        });
      },

      select(id) {
        if (id === null) {
          flux.dispatch('branches.select.success', null);
          return;
        }
        id = parseInt(id);
        var b = _.find(BranchStore.branches, {id: id});
        if (b) {
          flux.dispatch('branches.select.success', b);
        } else {
          api.branchGet(id).then(function (b) {
            flux.dispatch('branches.select.success', b);
            return mapBranch(b);
          }, function (err) {
            flux.dispatch('branches.select.failed', err);
            return err;
          });
        }
      },

      filter(new_filters, update = true) {
        var params = update ? BranchStore.params : {};
        params.start = 0;
        var old = params.filters ? params.filters : {};
        var filters = _.clone(old);
        _.forEach(new_filters, (value, key) => {
          if (value === false) {
            delete filters[key];
          } else {
            filters[key] = value;
          }
        });

        if (!_.isEqual(filters, old)) {
          params.filters = filters;
          _.forEach(params, (value, key) => {
            if (!_.isNumber(value) && _.isEmpty(value)) {
              delete params[key];
            }
          });
          this.search(params, true);
        }
      },

      sort(field, order) {
        var params = BranchStore.params;
        var sortParam = {};
        if (order !== false) {
          sortParam[field] = order;
        }
        if (!_.isEqual(sortParam, params.sort || {})) {
          if (order === false) {
            delete params.sort;
          } else {
            params.sort = sortParam;
          }
          this.search(params, true);
        }
      }
    };
  })
;
