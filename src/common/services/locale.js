export default angular
  .module('services.locale', [])
  .factory('localeService', function($q, $cookies, api, amMoment, locale, config, flux) {
    return {
      getLocale() {
        return config.clientLocale;
      },
      setLocale(value) {
        config.clientLocale = value;
        this.locale = value;
        $cookies.put('locale', value);
        api.locale = value;
        amMoment.changeLocale({
          'en_Us': 'en_gb',
          'pt_Br': 'pt_br',
          'ru_Ru': 'ru',
          'de_De': 'de',
          'lv_Lv': 'lv'
        }[value]);

        let lang = value.split('_');
        locale.setLocale(lang[0].toLocaleLowerCase() + '-' + lang[1].toUpperCase());

        flux.dispatch('locale.changed');

        return $q.all(locale.ready('common'), locale.ready('feedback'));
      }
    };
  });
