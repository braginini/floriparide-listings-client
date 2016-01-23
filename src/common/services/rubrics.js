export default angular
  .module('services.rubrics', [
    'services.api'
  ])
  .store('RubricStore', function (sessionStorage) {
    return {
      initialize() {
        var rubrics = sessionStorage.get('rubrics');
        this.state = this.immutable({
          rubrics: rubrics ? rubrics : []
        });
      },
      handlers: {
        'rubrics.load.success': 'onRubricsLoadSuccess'
      },
      onRubricsLoadSuccess: function (res) {
        if (res.items) {
          sessionStorage.put('rubrics', res.items);
          this.state.set('rubrics');
        }
      },
      exports: {
        get rubrics() {
          return this.state.get('rubrics');
        }
      }
    };
  })

  .factory('RubricActions', function (api, flux) {
    return {
      load: function () {
        flux.dispatch('rubrics.load');
        api.rubricList().then((res) => {
          flux.dispatch('rubrics.load.success', res);
        }, (err) => {
          flux.dispatch('rubrics.load.failed', err);
        });
      }
    };
  });
