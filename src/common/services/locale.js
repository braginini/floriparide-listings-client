export default angular
  .module('services.locale', [])
  .factory('localeService', function($cookies, api, amMoment, locale, config) {
    return {
      getLocale() {
        return config.clientLocale;
      },
      setLocale(value) {
        config.clientLocale = value;
        this.locale = value;
        $cookies.locale = value;
        api.locale = value;
        amMoment.changeLocale({
          'en_Us': 'en_gb',
          'pt_Br': 'pt_br',
          'ru_Ru': 'ru',
          'de_De': 'de',
          'lv_Lv': 'lv'
        }[locale]);

        let lang = value.split('_');
        locale.setLocale(lang[0].toLocaleLowerCase() + '-' + lang[1].toUpperCase());

        return locale.ready('common');
      }
    };
  });
