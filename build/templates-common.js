angular.module('templates-common', ['directives/branch-filter/attribute-group-filters.tpl.html', 'directives/branch-filter/general-attribute-group-filters.tpl.html', 'directives/branch/branch-card.tpl.html', 'directives/branch/branch.tpl.html', 'directives/branch/contact.tpl.html', 'directives/branch/schedule-popup.tpl.html', 'directives/branch/schedule.tpl.html', 'directives/dashboard/dashboard.tpl.html', 'directives/feedback/feedback.tpl.html', 'directives/gallery/gallery.tpl.html', 'services/dialogs/dialog.tpl.html', 'services/dialogs/wait.tpl.html']);

angular.module("directives/branch-filter/attribute-group-filters.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("directives/branch-filter/attribute-group-filters.tpl.html",
    "<div class=\"attribute-group-filter\">\n" +
    "    <div class=\"filter-header\" ng-if=\"bShowHeader\">{{::g.name}}</div>\n" +
    "    <div class=\"filter-checkbox-container\">\n" +
    "        <div class=\"filter-checkbox\" ng-repeat=\"a in groups.checkbox\" >\n" +
    "            <div attribute-checkbox=\"a\"></div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"filter-slider\" ng-repeat=\"a in groups.slider\" ng-if=\"groups.slider.length\">\n" +
    "        <div attribute-slider=\"a\"></div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("directives/branch-filter/general-attribute-group-filters.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("directives/branch-filter/general-attribute-group-filters.tpl.html",
    "<div class=\"attribute-group-filter\">\n" +
    "    <div class=\"filter-checkbox-container\">\n" +
    "        <div class=\"filter-checkbox btn-group\">\n" +
    "            <button class=\"btn btn-default btn-150\" btn-checkbox ng-model=\"filters.visible\">{{'common.visibleOnMap' | i18n}}</button>\n" +
    "            <button class=\"btn btn-default btn-90\" btn-checkbox ng-model=\"sort.raiting\">{{'common.raiting' | i18n}}</button>\n" +
    "        </div>\n" +
    "        <div class=\"filter-checkbox\">\n" +
    "            <button class=\"btn btn-default\" btn-checkbox ng-model=\"filters.open\">{{'common.open' | i18n}}</button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"hr\"></div>\n" +
    "</div>");
}]);

angular.module("directives/branch/branch-card.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("directives/branch/branch-card.tpl.html",
    "<div class=\"branch-card\" itemscope itemtype=\"::b.itemtype\">\n" +
    "    <div class=\"card-rating\">\n" +
    "        <div class=\"rating-value\">{{::b.rating}}</div>\n" +
    "        <rating rate=\"::b.rating\" readonly=\"readonly\" size=\"l\"></rating>\n" +
    "        <!--<div class=\"reviews\">{{::b.comments.total}} отзыва</div>-->\n" +
    "    </div>\n" +
    "    <div class=\"card-description\" ng-if=\"b.description\">\n" +
    "        <div class=\"description-text\" ng-class=\"{show: !collapseDescr}\">{{b.description}}</div>\n" +
    "        <button class=\"btn btn-link\" ng-click=\"collapseDescr=false\" ng-show=\"collapseDescr\">{{'common.readMore' | i18n}}</button>\n" +
    "        <button class=\"btn btn-link\" ng-click=\"collapseDescr=true\" ng-show=\"!collapseDescr\">{{'common.hide' | i18n}}</button>\n" +
    "    </div>\n" +
    "    <div class=\"icon-container branch-address\" ng-if=\"::b.address.street\">\n" +
    "        <i class=\"icon-location left-icon\"></i>\n" +
    "        <address ng-click=\"locateToAddress()\">{{::b.address | formatAddress}}</address>\n" +
    "    </div>\n" +
    "    <div class=\"card-hr\"></div>\n" +
    "    <div branch-schedule=\"b.schedule\" class=\"block-lg\" ng-if=\"::b.schedule | isNonEmpty\"></div>\n" +
    "    <div ng-if=\"b.contacts\" ng-repeat=\"contact in b.contacts track by $index\">\n" +
    "        <div branch-contact=\"contact\" class=\"block-lg\"></div>\n" +
    "    </div>\n" +
    "    <div class=\"card-hr\"></div>\n" +
    "    <div class=\"photos\" ng-class=\"{'more': b.photos.length > 3}\" ng-if=\"::b.photos.length\">\n" +
    "        <a href=\"#\" ng-repeat=\"photo in b.photos\" ng-click=\"$event.preventDefault();showGallery($index);\">\n" +
    "            <img ng-src=\"{{::photo.src}}\">\n" +
    "        </a>\n" +
    "    </div>\n" +
    "    <div class=\"icon-container\" ng-repeat=\"(name, attributes) in ::attrGroups\" ng-if=\"::attrGroups\">\n" +
    "        <i ng-class=\"'icon-' + name + ' left-icon'\"></i>\n" +
    "        <ul class=\"card-list attributes\">\n" +
    "            <li ng-repeat=\"a in attributes track by $index\" itemprop=\"{{::a.itemprop}}\">{{::a.formatted}}</li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "    <div class=\"icon-container\" ng-if=\"::b.rubrics.length\">\n" +
    "        <ul class=\"card-list rubrics\">\n" +
    "            <li ng-repeat=\"r in b.rubrics track by $index\">\n" +
    "                <a ng-href=\"#!/rubric/{{::r.id}}/{{::r.name|query:false}}\">{{::r.name}}</a>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "    <!--<div class=\"card-hr\" ng-if=\"::b.comments.total\"></div>-->\n" +
    "    <!--<h4 ng-if=\"::b.comments.total\">Отзывы</h4>-->\n" +
    "    <!--<div class=\"messages messages-img\" ng-if=\"::b.comments.total\">-->\n" +
    "      <!--<div class=\"item item-visible\" ng-repeat=\"c in b.comments.items\">-->\n" +
    "        <!--<div class=\"image\">-->\n" +
    "          <!--&lt;!&ndash;<img src=\"https://fbcdn-profile-a.akamaihd.net/hprofile-ak-ash2/v/t1.0-1/c85.142.704.704/s100x100/941152_537524936282818_1482258660_n.jpg?oh=7669e08297414a11f3a1e39ad77d770d&oe=560BB497&__gda__=1438688172_97965cf6838aef95f9d8dae23417d735\">&ndash;&gt;-->\n" +
    "          <!--<img ng-src=\"{{::c.user.photo}}\">-->\n" +
    "        <!--</div>-->\n" +
    "        <!--<div class=\"text\">-->\n" +
    "          <!--<div class=\"heading\">-->\n" +
    "            <!--<a>{{::c.user.name}}</a>-->\n" +
    "            <!--<span class=\"date\" am-time-ago=\"c.created\"></span>-->\n" +
    "            <!--<rating rate=\"c.rating\"></rating>-->\n" +
    "          <!--</div>-->\n" +
    "          <!--{{::c.text}}-->\n" +
    "        <!--</div>-->\n" +
    "      <!--</div>-->\n" +
    "    <!--</div>-->\n" +
    "</div>");
}]);

angular.module("directives/branch/branch.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("directives/branch/branch.tpl.html",
    "<div class=\"branch\">\n" +
    "    <div class=\"has-photo\">\n" +
    "        <i ng-class=\"{'icon-camera': b.photos.length, 'no-photos': !b.photos.length}\"></i>\n" +
    "    </div>\n" +
    "    <header>{{b.fullname}}</header>\n" +
    "    <div class=\"branch-body\">\n" +
    "        <div class=\"description\" ng-if=\"b.article\">{{b.article}}</div>\n" +
    "        <address>{{b.address|formatAddress}}</address>\n" +
    "    </div>\n" +
    "    <footer>\n" +
    "        <div class=\"rating-value\">{{b.rating}}</div>\n" +
    "        <rating rate=\"b.rating\" readonly=\"readonly\"></rating>\n" +
    "        <!--<div class=\"reviews\">{{b.comments.total}} отзыва</div>-->\n" +
    "    </footer>\n" +
    "</div>");
}]);

angular.module("directives/branch/contact.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("directives/branch/contact.tpl.html",
    "<div class=\"branch-contact icon-container\">\n" +
    "    <div ng-if=\"c.contact === 'website'\">\n" +
    "        <i class=\"icon-ie left-icon\"></i>\n" +
    "        <a ng-href=\"{{c.url}}\" target=\"_blank\">{{c.url|host}}</a>\n" +
    "    </div>\n" +
    "    <div ng-if=\"c.contact === 'facebook'\">\n" +
    "        <i class=\"icon-facebook left-icon\"></i>\n" +
    "        <a ng-href=\"{{c.url}}\" target=\"_blank\">{{c.url|host}}</a>\n" +
    "    </div>\n" +
    "    <div ng-if=\"c.contact === 'twitter'\">\n" +
    "        <i class=\"icon-twitter left-icon\"></i>\n" +
    "        <a ng-href=\"{{c.url}}\" target=\"_blank\">{{c.url|host}}</a>\n" +
    "    </div>\n" +
    "    <div ng-if=\"c.contact === 'instagram'\">\n" +
    "        <i class=\"icon-instagramm left-icon\"></i>\n" +
    "        <a ng-href=\"{{c.url}}\" target=\"_blank\">{{c.url|host}}</a>\n" +
    "    </div>\n" +
    "    <div ng-if=\"c.contact === 'email'\">\n" +
    "        <i class=\"icon-mail left-icon\"></i>\n" +
    "        <a ng-href=\"mailto:{{c.value}}\" target=\"_blank\">{{c.value}}</a>\n" +
    "    </div>\n" +
    "    <div ng-if=\"c.contact === 'phone'\">\n" +
    "        <i class=\"icon-phone left-icon\"></i>\n" +
    "        {{c.value|phone}}\n" +
    "    </div>\n" +
    "    <div ng-if=\"c.contact === 'fax'\">\n" +
    "        <i class=\"icon-fax left-icon\"></i>\n" +
    "        {{c.value|phone}}\n" +
    "    </div>\n" +
    "    <div ng-if=\"c.contact === 'skype'\">\n" +
    "        <i class=\"icon-skype left-icon\"></i>\n" +
    "        <a ng-href=\"{{c.url}}\" target=\"_blank\">{{c.value}}</a>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("directives/branch/schedule-popup.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("directives/branch/schedule-popup.tpl.html",
    "<div class=\"tooltip schedule-tooltip {{placement}}\" ng-class=\"{ 'in': isOpen(), fade: animation() }\">\n" +
    "  <div class=\"tooltip-arrow\"></div>\n" +
    "  <div class=\"tooltip-inner\">\n" +
    "      <div class=\"schedule-table\" ng-if=\"::schedule.length > 2\">\n" +
    "          <div class=\"schedule-column\" ng-class=\"{active: (item.dayIndex === todayIndex)}\" ng-repeat=\"item in schedule\">\n" +
    "              <div class=\"schedule-th\">{{::item.label}}</div>\n" +
    "              <div class=\"schedule-td\"\n" +
    "                   title={{::sch_item.description}}\n" +
    "                   ng-repeat=\"sch_item in item.items\"\n" +
    "                   ng-if=\"::item.items.length\">\n" +
    "                  <div>{{::sch_item.from}}</div>\n" +
    "                  <div>{{::sch_item.to}}</div>\n" +
    "              </div>\n" +
    "              <div class=\"schedule-td\" ng-if=\"::!item.items.length\">\n" +
    "                  <div> - </div>\n" +
    "              </div>\n" +
    "          </div>\n" +
    "      </div>\n" +
    "      <div class=\"schedule-item\"\n" +
    "           title={{::item.description}}\n" +
    "           ng-repeat=\"item in schedule\"\n" +
    "           ng-if=\"::schedule.length < 3\">\n" +
    "          {{::item.label}}: <span>{{::item|formatSchedule}}</span>\n" +
    "      </div>\n" +
    "  </div>\n" +
    "</div>");
}]);

angular.module("directives/branch/schedule.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("directives/branch/schedule.tpl.html",
    "<div class=\"schedule icon-container\">\n" +
    "    <i class=\"icon-clock left-icon\" ng-class=\"{active: isWorking}\"></i>\n" +
    "    <a class=\"today schedule-tip\"\n" +
    "         href=\"#\"\n" +
    "         ng-click=\"$event.preventDefault();\"\n" +
    "         schedule-tooltip=\"{{schedule}}\"\n" +
    "         tooltip-placement=\"bottom\"\n" +
    "         tooltip-append-to-body=\"true\"\n" +
    "         ng-if=\"schedule.length > 1\">\n" +
    "        <div class=\"today-text\" ng-class=\"{'has-breaks': today.breaks.length}\" ng-bind-html=\"today|formatToday\"></div>\n" +
    "    </a>\n" +
    "    <div class=\"today\" ng-if=\"::schedule.length <= 1\">\n" +
    "        <div class=\"today-text\" ng-class=\"{'has-breaks': today.breaks.length}\" ng-bind-html=\"today|formatToday\"></div>\n" +
    "    </div>\n" +
    "    <div class=\"now\">{{now}} <span ng-if=\"timeLeft\">{{timeLeft}} {{'common.shortMinute' | i18n}}</span></div>\n" +
    "</div>");
}]);

angular.module("directives/dashboard/dashboard.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("directives/dashboard/dashboard.tpl.html",
    "<div class=\"dashboard\">\n" +
    "   <div class=\"city\">\n" +
    "       <div class=\"city_name\">Florianópolis</div>\n" +
    "       <div class=\"city_time\">{{currentTime|amDateFormat:'HH:mm, DD MMMM, dddd'}}</div>\n" +
    "       <button class=\"close\" ng-click=\"close()\"><i class=\"icon-times\"></i></button>\n" +
    "   </div>\n" +
    "   <ul class=\"rubrics\" ng-click=\"search($event)\">\n" +
    "       <li class=\"rubric\">\n" +
    "           <div class=\"rubric-icon\">\n" +
    "               <i class=\"icon fa fa-cutlery\"></i>\n" +
    "           </div>\n" +
    "           <div class=\"caption\">Onde comer</div>\n" +
    "       </li>\n" +
    "       <li class=\"rubric\">\n" +
    "           <div class=\"rubric-icon\">\n" +
    "               <i class=\"icon fa fa-glass\"></i>\n" +
    "           </div>\n" +
    "           <div class=\"caption\">Beber</div>\n" +
    "       </li>\n" +
    "       <li class=\"rubric disabled\" title=\"Em breve\">\n" +
    "           <div class=\"rubric-icon\">\n" +
    "               <i class=\"icon fa fa-bed\"></i>\n" +
    "           </div>\n" +
    "           <div class=\"caption\">Alojamiento</div>\n" +
    "       </li>\n" +
    "       <li class=\"rubric disabled\" title=\"Em breve\">\n" +
    "           <div class=\"rubric-icon\">\n" +
    "               <i class=\"icon fa fa-plus\"></i>\n" +
    "           </div>\n" +
    "           <div class=\"caption\">Farmacias</div>\n" +
    "       </li>\n" +
    "       <li class=\"rubric disabled\" title=\"Em breve\">\n" +
    "           <div class=\"rubric-icon\">\n" +
    "               <i class=\"icon fa fa-building-o\"></i>\n" +
    "           </div>\n" +
    "           <div class=\"caption\">Lançamentos</div>\n" +
    "       </li>\n" +
    "       <li class=\"rubric disabled\" title=\"Em breve\">\n" +
    "           <div class=\"rubric-icon\">\n" +
    "               <i class=\"icon fa fa-wifi\"></i>\n" +
    "           </div>\n" +
    "           <div class=\"caption\">Banda larga</div>\n" +
    "       </li>\n" +
    "       <li class=\"rubric disabled\" title=\"Em breve\">\n" +
    "           <div class=\"rubric-icon\">\n" +
    "               <i class=\"icon fa fa-credit-card\"></i>\n" +
    "           </div>\n" +
    "           <div class=\"caption\">ATM</div>\n" +
    "       </li>\n" +
    "       <li class=\"rubric disabled\" title=\"Em breve\">\n" +
    "           <div class=\"rubric-icon\">\n" +
    "               <i class=\"icon fa fa-bed\"></i>\n" +
    "           </div>\n" +
    "           <div class=\"caption\" data-rubrics>Todas as categorias</div>\n" +
    "       </li>\n" +
    "   </ul>\n" +
    "</div>");
}]);

angular.module("directives/feedback/feedback.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("directives/feedback/feedback.tpl.html",
    "<div>\n" +
    "    <button class=\"btn btn-primary\"\n" +
    "            ng-class=\"rootClassName\"\n" +
    "            ng-click=\"toggleForm()\"\n" +
    "            ng-show=\"!isFormVisible\">\n" +
    "        <i class=\"fa fa-comment\"></i>\n" +
    "    </button>\n" +
    "    <div class=\"panel panel-feedback\" ng-show=\"isFormVisible\">\n" +
    "        <div class=\"panel-heading\">\n" +
    "            <h3 class=\"panel-title\">{{'feedback.keepFeedback' | i18n}}</h3>\n" +
    "            <button class=\"close\" ng-click=\"toggleForm()\"><i class=\"icon-times\"></i></button>\n" +
    "        </div>\n" +
    "        <form class=\"panel-body\" role=\"form\" ng-submit=\"onSubmit()\">\n" +
    "            <ul class=\"feedback-ratings\">\n" +
    "                <li class=\"feedback-rating\" ng-class=\"{'active': model.rating==1}\" ng-click=\"model.rating = 1;\">\n" +
    "                    <div class=\"feedback-rating-icon\">\n" +
    "                        <i class=\"icon icon-emo-unhappy\"></i>\n" +
    "                    </div>\n" +
    "                    <div class=\"caption\">{{'feedback.bad' | i18n}}</div>\n" +
    "                </li>\n" +
    "                <li class=\"feedback-rating\" ng-class=\"{'active': model.rating==2}\" ng-click=\"model.rating = 2;\">\n" +
    "                    <div class=\"feedback-rating-icon\">\n" +
    "                        <i class=\"icon icon-emo-displeased\"></i>\n" +
    "                    </div>\n" +
    "                    <div class=\"caption\">{{'feedback.notGood' | i18n}}</div>\n" +
    "                </li>\n" +
    "                <li class=\"feedback-rating\" ng-class=\"{'active': model.rating==3}\" ng-click=\"model.rating = 3;\">\n" +
    "                    <div class=\"feedback-rating-icon\">\n" +
    "                        <i class=\"icon icon-emo-happy\"></i>\n" +
    "                    </div>\n" +
    "                    <div class=\"caption\">{{'feedback.normal' | i18n}}</div>\n" +
    "                </li>\n" +
    "                <li class=\"feedback-rating\" ng-class=\"{'active': model.rating==4}\" ng-click=\"model.rating = 4;\">\n" +
    "                    <div class=\"feedback-rating-icon\">\n" +
    "                        <i class=\"icon icon-emo-grin\"></i>\n" +
    "                    </div>\n" +
    "                    <div class=\"caption\">{{'feedback.good' | i18n}}</div>\n" +
    "                </li>\n" +
    "                <li class=\"feedback-rating\" ng-class=\"{'active': model.rating==5}\" ng-click=\"model.rating = 5;\">\n" +
    "                    <div class=\"feedback-rating-icon\">\n" +
    "                        <i class=\"icon icon-emo-thumbsup\"></i>\n" +
    "                    </div>\n" +
    "                    <div class=\"caption\">{{'feedback.excellent' | i18n}}</div>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "            <div class=\"form-group\">\n" +
    "                <input type=\"text\" class=\"form-control\" ng-model=\"model.name\" placeholder={{'feedback.name'|i18n}} >\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <input type=\"email\" class=\"form-control\" ng-model=\"model.email\" placeholder=\"Email\">\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <textarea class=\"form-control\" rows=\"5\" ng-model=\"model.body\" placeholder=\"{{'feedback.wishes'|i18n}}\"></textarea>\n" +
    "            </div>\n" +
    "            <button type=\"submit\" class=\"btn btn-info pull-right\" ng-disabled=\"!model.body.length\">{{'feedback.send'|i18n}}</button>\n" +
    "        </form>\n" +
    "    </div>\n" +
    "    <div class=\"panel panel-feedback\" ng-if=\"showSuccessPanel\">\n" +
    "        <div class=\"panel-heading\">\n" +
    "            <h3 class=\"panel-title\">{{'feedback.successTitle'|i18n}}</h3>\n" +
    "            <button class=\"close\" ng-click=\"closeSuccessPanel()\"><i class=\"icon-times\"></i></button>\n" +
    "        </div>\n" +
    "        <div class=\"panel-body\">{{'feedback.successBody'|i18n}}</div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("directives/gallery/gallery.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("directives/gallery/gallery.tpl.html",
    "<div class=\"modal-body gallery modal-content\" fullscreen only-watched-property>\n" +
    "    <div class=\"spinner-wrapper\">\n" +
    "        <div class=\"spinner7-3em\"></div>\n" +
    "    </div>\n" +
    "    <div class=\"modal-media\" ng-show=\"readyUI\">\n" +
    "        <button type=\"button\" class=\"flow-icon close\" data-dismiss=\"modal\" aria-hidden=\"true\"\n" +
    "                ng-click=\"cancel()\">&times;</button>\n" +
    "        <button type=\"button\" class=\"flow-icon btn-fs btn-bg\" data-dismiss=\"modal\" aria-hidden=\"true\"\n" +
    "                ng-click=\"toggleFullScreen()\"><i class=\"icon-resize-full\"></i></button>\n" +
    "        <div class=\"flow-icon gallery-index\" ng-if=\"images.length > 1 && !isLoading\">{{(index + 1) + '/' + images.length}}</div>\n" +
    "        <div class=\"flow-icon gallery-index\" ng-if=\"isLoading\">\n" +
    "            <div class=\"spinner7\"></div>\n" +
    "        </div>\n" +
    "        <div class=\"spinner-wrapper\">\n" +
    "            <div class=\"spinner7-3em\"></div>\n" +
    "        </div>\n" +
    "        <div class=\"media-wrapper\">\n" +
    "            <img ng-src=\"{{current.src}}\"\n" +
    "                 ng-load=\"onImgLoad()\"\n" +
    "                 ng-error=\"onImgLoadError()\"/>\n" +
    "        </div>\n" +
    "        <div class=\"nav-block nav-prev\" ng-if=\"images.length > 1\" ng-click=\"showPrev()\">\n" +
    "            <div class=\"nav-handle\">\n" +
    "                <button type=\"button\" class=\"flow-icon btn-bg\">\n" +
    "                    <i class=\"icon-left-open\"></i>\n" +
    "                </button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"nav-block nav-next\" ng-if=\"images.length > 1\" ng-click=\"showNext()\">\n" +
    "            <div class=\"nav-handle\">\n" +
    "                <button type=\"button\" class=\"flow-icon btn-bg\">\n" +
    "                    <i class=\"icon-right-open\"></i>\n" +
    "                </button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"preload\">\n" +
    "            <img ng-src=\"{{p.src}}\" ng-load=\"onPreloadImgLoad($index, $event)\" ng-repeat=\"p in preloads track by $index\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("services/dialogs/dialog.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("services/dialogs/dialog.tpl.html",
    "<div class=\"modal-header\" ng-if=\"title\">\n" +
    "    <h4 class=\"modal-title\">{{title}}</h4>\n" +
    "</div>\n" +
    "<div class=\"modal-body\" ng-bind-html=\"message\">{{message}}</div>\n" +
    "<div class=\"modal-footer\" ng-if=\"isButtons\">\n" +
    "    <button class=\"btn btn-primary\" ng-click=\"ok()\" style=\"width: 80px\">OK</button>\n" +
    "    <button class=\"btn btn-default\" ng-click=\"cancel()\" style=\"width: 80px\">Отмена</button>\n" +
    "</div>");
}]);

angular.module("services/dialogs/wait.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("services/dialogs/wait.tpl.html",
    "<div class=\"modal-header\" ng-if=\"title\">\n" +
    "    <h4 class=\"modal-title\">{{title}}</h4>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "    <p ng-bind-html=\"message\" ng-if=\"message\"></p>\n" +
    "    <div class=\"progress progress-striped\">\n" +
    "        <div class=\"progress-bar progress-bar-primary\" role=\"progressbar\" aria-valuenow=\"20\" aria-valuemin=\"0\"\n" +
    "             aria-valuemax=\"100\" ng-style=\"{'width': progress + '%'}\">\n" +
    "            <span class=\"sr-only\" ng-bind-html=\"message\"></span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);
