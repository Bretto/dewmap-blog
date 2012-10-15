'use strict';
/* http://docs-next.angularjs.org/api/angular.module.ng.$compileProvider.directive */

var directives = angular.module('myApp.directives', []);

directives.directive('dpMarkdown', function () {
    var converter = new Showdown.converter();
    var template = '<div></div>';

    return {
        restrict:'E',
        template:'<div></div>',
        replace:true,
        scope:{
            localName:'=myAttr'
        },
        link:function (scope, iElement, iAttrs) {
            console.log('link');
            scope.$watch(function () {
                return scope.localName
            }, function (value) {
                if (value) {
                    console.log('link watch');
                    var makeHtml = converter.makeHtml(scope.localName);
                    iElement.html(makeHtml);
                    $('pre').addClass("prettyprint linenums");
                    prettyPrint();
                }
            });
        }
    }
});

// TODO put in Utils
function isEmpty(value) {
    return angular.isUndefined(value) || value === '' || value === null || value !== value;
}


directives.directive('contenteditable', function ($parse) {
    return {
        require:'ngModel',
        link:function (scope, elm, attr, ctrl) {

            var ngModelGet = $parse(attr.ngModel),
                ngModelSet = ngModelGet.assign;

            var listener = function () {
                if (attr.exportHtml) {
                    var value = elm.text().replace(/>\s+</g, '><');

                    if (ctrl.$viewValue !== value) {
                        scope.$apply(function () {
                            ctrl.$setViewValue(value);
                        });
                    }
                }
                else {
                    scope.$apply(function () {
                        ctrl.$setViewValue(elm.html());
                    });
                }

            };


            // view -> model
            //elm.bind('blur keydown input change', listener);
            elm.bind('input', listener);


            //TODO(Brett) Placeholder
            //if(ctrl.$setViewValue == '')elm.html(attr.placeholder);

            // model -> view
            scope.$watch(ngModelGet, function (value) {
                if (ctrl.$viewValue !== value) {
                    ctrl.$viewValue = value;
                    ctrl.$render();
                }
            });


            ctrl.$render = function () {
                if (attr.exportHtml) {
                    elm.text(ctrl.$viewValue);
                }
                else {
                    elm.html(ctrl.$viewValue);
                }
            };

            var validator = function (value) {
                value = (value === "<br>") ? '' : value;
                if (attr.required && (isEmpty(value) || value === false)) {
                    ctrl.$setValidity('required', false);
                    return undefined;
                }
                else {
                    ctrl.$setValidity('required', true);
                    return value;
                }
            };
            ctrl.$parsers.unshift(validator);

            // load init value from DOM
//            ngModel.$setViewValue(elm.html());

        }
    }

});
