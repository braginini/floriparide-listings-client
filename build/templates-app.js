angular.module('templates-app', ['main.tpl.html', 'search/filter.tpl.html', 'search/firm.tpl.html', 'search/rubrics.tpl.html', 'search/search.tpl.html']);

angular.module("main.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("main.tpl.html",
    "<leaflet layers=\"layers\" center=\"initPoint\" maxbounds=\"maxbounds\" defaults=\"defaults\"\n" +
    "         resizable ng-style=\"{ width: windowWidth, height: windowHeight}\">\n" +
    "</leaflet>\n" +
    "\n" +
    "<div class=\"side_west\">\n" +
    "    <form class=\"form-inline\" ng-submit=\"search(query)\">\n" +
    "        <div class=\"input-group push-down-10 search\">\n" +
    "            <input type=\"text\" class=\"form-control\" placeholder=\"search name, address or route...\" ng-model=\"query\">\n" +
    "            <div class=\"input-group-btn\">\n" +
    "                <button class=\"btn btn-primary\" type=\"submit\"><span class=\"icon-search\"></span></button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </form>\n" +
    "    <div data-dashboard ng-show=\"showDashboard\"></div>\n" +
    "    <div ui-view class=\"data-view\"></div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"footer-items\">\n" +
    "    <button class=\"footer-item btn btn-primary\" ng-show=\"showDashboardButton\" ng-click=\"goHome()\">\n" +
    "        <i class=\"fa fa-building-o\"></i>  Florianópolis\n" +
    "    </button>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"footer-items-right\">\n" +
    "    <div feedback class=\"footer-item-small\"></div>\n" +
    "</div>");
}]);

angular.module("search/filter.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("search/filter.tpl.html",
    "<div class=\"frame frame-2 panel panel-success panel-hidden-controls frame-filled frame-right active\">\n" +
    "    <div class=\"panel-heading\">\n" +
    "        <ul class=\"panel-controls\">\n" +
    "            <li class=\"pc-collapse\"><a class=\"panel-collapse\" href=\"#\"><span class=\"icon-minus-1\"></span></a></li>\n" +
    "            <li class=\"pc-close\"><a class=\"panel-remove\" href=\"#\" ng-click=\"$event.preventDefault();goParent()\">\n" +
    "                <span class=\"icon-times\"></span>\n" +
    "            </a></li>\n" +
    "        </ul>\n" +
    "        <h3 class=\"panel-title\">{{'common.extendedSearch' | i18n}}</h3>\n" +
    "    </div>\n" +
    "    <div class=\"panel-body padding-0\" scrollbar>\n" +
    "        <div><!-- to work :last-child-->\n" +
    "            <!--<div class=\"attribute-group-filter-wrapper\">-->\n" +
    "                <!--<div general-attribute-group-filters></div>-->\n" +
    "            <!--</div>-->\n" +
    "            <div class=\"attribute-group-filter-wrapper\" ng-repeat=\"g in attributeGroups track by g.id\">\n" +
    "                <div attribute-group-filters=\"g\" show-header=\"true\"></div>\n" +
    "                <div class=\"hr\" ng-if=\"!$last\"></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("search/firm.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("search/firm.tpl.html",
    "<div class=\"frame panel panel-success panel-hidden-controls frame-filled frame-right active\"\n" +
    "     ng-class=\"{'frame-right': isRight, 'frame-1': isRoot, 'frame-2': !isRoot}\"\n" +
    "     ng-class=\"frameClass\"\n" +
    "     frame-right>\n" +
    "    <div class=\"panel-heading\">\n" +
    "        <ul class=\"panel-controls\">\n" +
    "            <li class=\"pc-collapse\" ng-if=\"!isRoot\">\n" +
    "                <a class=\"panel-collapse\" href=\"#\"><span class=\"icon-minus-1\"></span></a>\n" +
    "            </li>\n" +
    "            <li class=\"pc-close\"><a class=\"panel-remove\" href=\"#\" ng-click=\"$event.preventDefault();goParent()\">\n" +
    "                <span class=\"icon-times\"></span>\n" +
    "            </a></li>\n" +
    "        </ul>\n" +
    "        <h3 class=\"panel-title\">\n" +
    "            {{::b.fullname}}\n" +
    "        </h3>\n" +
    "    </div>\n" +
    "    <div class=\"panel-body\" scrollbar>\n" +
    "        <div branch-card=\"b\"></div>\n" +
    "    </div>\n" +
    "    <div class=\"pc-flow\" ng-click=\"toggleFlow()\" ng-if=\"!isRoot\">\n" +
    "        <span ng-class=\"{'icon-left-open': isRight, 'icon-right-open': !isRight}\"></span>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("search/rubrics.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("search/rubrics.tpl.html",
    "<div class=\"frames\">\n" +
    "    <button class=\"btn btn-primary pc-expand\" ng-click=\"$scope.$broadcast('frameExpand')\" ng-show=\"self.count\">\n" +
    "        <i class=\"icon-briefcase\"></i>\n" +
    "        <div class=\"count\" ng-show=\"self.count\">{{self.count}}</div>\n" +
    "    </button>\n" +
    "    <div class=\"frame frame-1 panel panel-primary panel-hidden-controls\">\n" +
    "        <div class=\"spinner-wrapper\" ng-if=\"self.isLoading || self.isFirstTimeSpinnerShow\">\n" +
    "            <div class=\"spinner spinner7-2em-warning\"></div>\n" +
    "        </div>\n" +
    "        <div class=\"panel-heading\">\n" +
    "            <ul class=\"panel-controls\">\n" +
    "                <li class=\"pc-collapse\"><a class=\"panel-collapse\" href=\"#\"><span class=\"icon-minus-1\"></span></a></li>\n" +
    "                <li class=\"pc-close\"><a class=\"panel-remove\" href=\"#!/\"><span class=\"icon-times\"></span></a></li>\n" +
    "            </ul>\n" +
    "            <h3 class=\"panel-title\">\n" +
    "                Рубрики <span class=\"count\" ng-show=\"self.items.length\">{{self.items.length}}</span>\n" +
    "            </h3>\n" +
    "        </div>\n" +
    "        <div id=\"branches_container\" class=\"panel-body\" scrollbar>\n" +
    "            <div class=\"list-group list-group-cards\">\n" +
    "                <a ng-repeat=\"r in self.items track by r.id\"\n" +
    "                   class=\"list-group-item card rubric-card\"\n" +
    "                   href=\"#\"\n" +
    "                   ng-click=\"self.openRubric(r.id, r.name, $event)\">\n" +
    "                    <div class=\"has-photo\">\n" +
    "                        <i class=\"no-photos\"></i>\n" +
    "                    </div>\n" +
    "                    <header>{{r.name}}</header>\n" +
    "                    <footer>{{r.childs.join(' , ')}}</footer>\n" +
    "                </a>\n" +
    "            </div>\n" +
    "            <div class=\"alert alert-danger\" ng-if=\"self.error\">\n" +
    "                <strong>Произошла ошибка!</strong>\n" +
    "                Мы уже принимаем меры по ее устранению.\n" +
    "                Попробуйте немного позже.\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div ui-view=\"child_frame\"></div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("search/search.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("search/search.tpl.html",
    "<div class=\"frames\">\n" +
    "    <button class=\"btn btn-primary pc-expand\" ng-click=\"$scope.$broadcast('frameExpand')\" ng-show=\"self.count\">\n" +
    "        <i class=\"icon-briefcase\"></i>\n" +
    "        <div class=\"count\" ng-show=\"self.count\">{{self.count}}</div>\n" +
    "    </button>\n" +
    "    <div class=\"frame frame-1 panel panel-primary panel-hidden-controls\">\n" +
    "        <!--<div class=\"cg-busy-default-wrapper\"-->\n" +
    "             <!--cg-busy=\"{promise:self.isLoading, backdrop: true, templateUrl: 'search/loader.tpl.html'}\">-->\n" +
    "        <!--</div>-->\n" +
    "        <div class=\"spinner-wrapper\" ng-if=\"self.isLoading || self.isFirstTimeSpinnerShow\">\n" +
    "            <div class=\"spinner spinner7-2em-warning\"></div>\n" +
    "        </div>\n" +
    "        <div class=\"panel-heading\">\n" +
    "            <ul class=\"panel-controls\">\n" +
    "                <li class=\"pc-collapse\"><a class=\"panel-collapse\" href=\"#\"><span class=\"icon-minus-1\"></span></a></li>\n" +
    "                <li class=\"pc-close\"><a class=\"panel-remove\" href=\"#!/\"><span class=\"icon-times\"></span></a></li>\n" +
    "            </ul>\n" +
    "            <h3 class=\"panel-title\">\n" +
    "                {{'common.organizations' | i18n}} <span class=\"count\" ng-show=\"self.count\">{{self.count}}</span>\n" +
    "                <button class=\"btn btn-link btn-filter\" ng-click=\"self.openFilter();\">{{'common.extendedSearch' | i18n}}</button>\n" +
    "            </h3>\n" +
    "            <div general-attribute-group-filters></div>\n" +
    "            <div attribute-group-filters=\"self.attributeGroups[0]\"\n" +
    "                 show-header=\"false\"\n" +
    "                 ng-if=\"self.attributeGroups.length\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div id=\"branches_container\" class=\"panel-body\" scrollbar>\n" +
    "            <div class=\"list-group list-group-cards\"\n" +
    "                 infinite-scroll='self.nextPage()'\n" +
    "                 infinite-scroll-distance=\"0\"\n" +
    "                 infinite-scroll-disabled='self.isLoading || self.eof || self.error'\n" +
    "                 infinite-scroll-container=\"'#branches_container'\"\n" +
    "                 infinite-scroll-parent >\n" +
    "                <a ng-repeat=\"b in self.branches track by b.id\"\n" +
    "                   class=\"list-group-item card\"\n" +
    "                   branch=\"b\"\n" +
    "                   href=\"#\"\n" +
    "                   ng-class=\"{active: b.id == self.selectedId}\"\n" +
    "                   ng-click=\"self.openBranch(b.id)\">\n" +
    "                </a>\n" +
    "            </div>\n" +
    "            <div class=\"alert alert-danger\" ng-if=\"self.error\">\n" +
    "                <strong>{{'common.errorHeader' | i18n}}</strong>\n" +
    "                {{'common.unknownErrorMessage' | i18n}}\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div ui-view=\"child_frame\"></div>\n" +
    "    </div>\n" +
    "</div>");
}]);
