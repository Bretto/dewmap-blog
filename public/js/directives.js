'use strict';
/* http://docs-next.angularjs.org/api/angular.module.ng.$compileProvider.directive */

var directives = angular.module('myApp.directives', []);

//directives.directive('jlMarkdown', function () {
//        var converter = new Showdown.converter();
//        var editTemplate = '<textarea ng-show="isEditMode" ng-dblclick="switchToPreview()" rows="10" cols="10" ng-model="markdown"></textarea>';
//        var previewTemplate = '<div ng-hide="isEditMode" ng-dblclick="switchToEdit()">Preview</div>';
//        return{
//            restrict:'E',
//            scope:{},
//            compile:function (tElement, tAttrs, transclude) {
//                var markdown = tElement.text();
//
//                tElement.html(editTemplate);
//                var previewElement = angular.element(previewTemplate);
//                tElement.append(previewElement);
//
//                return function (scope, element, attrs) {
//                    scope.isEditMode = true;
//                    scope.markdown = markdown;
//
//                    scope.switchToPreview = function () {
//                        var makeHtml = converter.makeHtml(scope.markdown);
//                        previewElement.html(makeHtml);
//                        $('pre').addClass("prettyprint linenums");
//                        scope.isEditMode = false;
//                        prettyPrint();
//                    }
//                    scope.switchToEdit = function () {
//                        scope.isEditMode = true;
//                    }
//                }
//            }
//        }
//    });

directives.directive('dpMarkdown', function() {
    var converter = new Showdown.converter();
    var template = '<div></div>';

    return {
        restrict: 'E',
        template: '<div></div>',
        replace: true,
        scope: {
            localName:'=myAttr'
        },
        link: function(scope, iElement, iAttrs) {
            console.log('link');
            scope.$watch(function(){ return scope.localName }, function (value) {
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


//directives.directive('appNav',
//    function () {
//        return{
//            scope:true,
//            controller:function ($scope, $attrs) {
//
//                $scope.$watch($attrs.data, function (value) {
//                    if (value) {
//                        $scope.data = value;
//                    }
//                });
//            },
//            restrict:"E",
//            replace:false,
//            transclude:true,
//            templateUrl:"partials/app-nav.html"
//
//        };
//    });
//
//directives.directive('slide',
//    function () {
//        return{
//            scope:true,
//            restrict:"E",
//            templateUrl:"partials/slide.html"//,
//            //transclude: true
//        };
//    });
//
//
//directives.directive('keyNext', function () {
//    return function (scope, elm, attr) {
//        elm.bind('keydown', function (e) {
//            switch (e.keyCode) {
//                case 34: // PgDn
//                case 39: // right arrow
//                case 40: // down arrow
//                    return scope.$apply(attr.keyNext);
//
//                case 33: // PgUp
//                case 37: // left arrow
//                case 38: // up arrow
//                    return scope.$apply(attr.keyPrev);
//
//
//            }
//        });
//    };
//});
//
//directives.directive('tabs', function() {
//    return {
//        restrict: 'E',
//        transclude: true,
//        scope: {},
//        controller: function($scope, $element) {
//            var panes = $scope.panes = [];
//
//            $scope.select = function(pane) {
//                angular.forEach(panes, function(pane) {
//                    pane.selected = false;
//                });
//                pane.selected = true;
//            }
//
//            this.addPane = function(pane) {
//                if (panes.length == 0) $scope.select(pane);
//                panes.push(pane);
//            }
//        },
//        template:
//            '<div class="tabbable">' +
//                '<ul class="nav nav-tabs">' +
//                '<li ng-repeat="pane in panes" ng-class="{active:pane.selected}">'+
//                '<a href="" ng-click="select(pane)">{{pane.title}}</a>' +
//                '</li>' +
//                '</ul>' +
//                '<div class="tab-content" ng-transclude></div>' +
//                '</div>',
//        replace: true
//    };
//});
//
//directives.directive('pane', function() {
//    return {
//        require: '^tabs',
//        restrict: 'E',
//        transclude: true,
//        scope: { title: 'bind' },
//        link: function(scope, element, attrs, tabsCtrl) {
//            tabsCtrl.addPane(scope);
//        },
//        template:
//            '<div class="tab-pane" ng-class="{active: selected}" ng-transclude>' +
//                '</div>',
//        replace: true
//    };
//});
//
//directives.directive('dpCode',
//    function () {
//        return{
//            scope: {},
//            restrict:"E",
//            compile: function(tElement){
//                var code = tElement.html();
//                var template = '<div class="scrollable">'+
//                    '<button class="btn btn-primary resize-btn" ng-click="onResize()">'+
//                    '<i class="icon-resize-full icon-white"></i>'+
//                    '</button>'+
//                    '<xmp class="prettyprint linenums">' + code + '</xmp>'+
//                    '</div>';
//                tElement.html(template);
//            },
//            controller: function($scope, $element){
//                $scope.onResize = function(){
//                    $($element).children().toggleClass('resize-div');
//                }
//            }
//        };
//    });