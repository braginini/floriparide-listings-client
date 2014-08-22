(function () {
  angular.module('services.branches', [
    'app.config',
    'services.api'
  ])
    .factory('BranchesFeed', ['api', function (api) {
      var Feed = function (query) {
        this.idx = {};
        this.total_count = 0;
        this.eof = false;
        this.busy = false;
        this.limit = 20;
        this.branches = [];
        this.query = query;
      };

      Feed.prototype.nextPage = function () {
        if (this.busy || this.eof) {
          return;
        }
        this.busy = true;

        var params = {
          q: this.query,
          limit: this.limit,
          start: this.branches.length
        };

        this.read(params);
      };

      Feed.prototype.read = function (params) {
        return api.branchSearch(params).then(function (res) {
          this.loadResult(res, params);
        }.bind(this), function (err) {
          this.busy = false;
          this.eof = true;
          return err;
        }.bind(this));
      };

      Feed.prototype.loadResult = function (res, params) {
        this.total_count = res.total;
        if (!res.items.length || (params.start + params.limit) >= this.total_count) {
          this.eof = true;
        }
        this.branches = this.branches.concat(res.items);
        this.busy = false;
      };

      return Feed;
    }]);
})();
