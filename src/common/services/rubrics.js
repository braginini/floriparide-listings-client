export default angular
  .module('services.rubrics', [
    'services.api'
  ])
  .store('RubricStore', function (sessionStorage) {
    return {
      handlers: {
        'rubrics.load.success': 'onRubricsLoadSuccess'
      },
      onRubricsLoadSuccess: function (res) {
        if (res.items) {
          sessionStorage.put('rubrics', res.items);
          this.emitChange();
        }
      },
      exports: {
        getRubrics: function () {
          var res = sessionStorage.get('rubrics');
          return res ? res : [];
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
