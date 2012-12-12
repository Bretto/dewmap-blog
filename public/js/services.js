'use strict';


var services = angular.module('myApp.services', []);

services.constant('endPointPrefix', '/api/post');

services.factory('PostService', function ($http, $log, $rootScope, $routeParams, $location, endPointPrefix) {


    var PostService = {

        //clean
        //dirty

        origPost:null,
        editPost:null,
        isLoggedIn:false,

        onLogout:function () {
            $http.get('/logout').
                success(function (data) {
                    $log.info('Logged out !');
                });
            PostService.isLoggedIn = false;
        },

        onQuery:function () {
            $location.path("post");
        },

        onRead:function (id) {
            $location.path("post/" + id);
        },

        onEdit:function (id) {
            $location.path("post/" + id + "/edit");
        },

        onCancel:function (id) {
            $location.path("post/" + id);
        },

        onNew:function () {
            $location.path("post/new");
        },

        onDestroy:function (post) {
            $http.delete('/api/post/' + post._id).
                success(function (data) {
                    $location.path('post/');
                }).
                error(function (data, status, headers, config) {
                    $log.info('Delete Error');
                    $rootScope.$broadcast('error',{status:status, data:data, headers:headers});
                });
        },

        onSave:function (post) {

            if (post._id == undefined) {

                $http.post('/api/post', post).
                    success(function (data) {
                        $log.info('Create Success');
                        PostService.originalPost = data;
                        $location.path('post/' + data._id + '/edit');
                    }).
                    error(function (data, status, headers, config) {
                        $log.info('Create Error');
                        $rootScope.$broadcast('error',{status:status, data:data, headers:headers});
                    });

            } else {

                $http.put('/api/post/' + post._id, angular.extend({}, post, {_id:undefined})).
                    success(function (data) {
                        $log.info('Save Success');
                        PostService.originalPost = data;
                    }).
                    error(function (data, status, headers, config) {
                        $log.info('Save Error');
                        $rootScope.$broadcast('error',{status:status, data:data, headers:headers});
                    });
            }
        },

        getPost:function (id, cb) {
            $http.get('/api/post/' + id).
                success(function (data) {
                    //post.date = new Date(parseInt(post._id.slice(0,8), 16)*1000);
                    PostService.originalPost = angular.copy(data);
                    cb(data);
                });
        },

        getPosts:function (cb) {
            $http.get('/api/post').
                success(function (data, status, headers, config) {
                    cb(data);
                });
        }

    }

    $http.get('/api/isLoggedId').
        success(function (data) {
            if(data === 'admin'){
                $log.info('you are logged-in');
                PostService.isLoggedIn = true;
            }else{
                $log.info('you are not logged-in');
                PostService.isLoggedIn = false;
            }
        });

    return PostService;
});


//
//services.value('version', '0.1');
//
//
//services.factory('SlidesSrv', ['$http', '$location', '$timeout', '$rootScope', function ($http, $location, $timeout, $rootScope) {
//    var SlidesSrv = {
//        all: [],
//        selected: null,
//        selectedIdx: null,
//
//        move: 'NEXT',
//        isChangeOver: false,
//
//
//        getSlides: function () {
//            var feedURL = 'assets/json/slides-routes.json';
//
//            var successCallback = function (data, status, headers, config) {
//                SlidesSrv.all = data;
//                console.log('Entries loaded from server:', SlidesSrv.all.length);
//            };
//
//            var errorCallback = function (data, status, headers, config) {
//                SlidesSrv.all = data;
//                console.log('Loading ERROR:', status);
//            };
//
//            $http.get(feedURL).success(successCallback).error(errorCallback);
//        },
//
//
//        prev: function () {
//            if (SlidesSrv.hasPrev()) {
//                SlidesSrv.selectItem(SlidesSrv.selected ? SlidesSrv.selectedIdx - 1 : 0);
//            }
//        },
//
//
//        next: function () {
//            if (SlidesSrv.hasNext()) {
//                SlidesSrv.selectItem(SlidesSrv.selected ? SlidesSrv.selectedIdx + 1 : 0);
//            }
//        },
//
//
//        hasPrev: function () {
//            if (!SlidesSrv.selected) {
//                return true;
//            }
//            return SlidesSrv.selectedIdx > 0;
//        },
//
//
//        hasNext: function () {
//            if (!SlidesSrv.selected) {
//                return true;
//            }
//            return SlidesSrv.selectedIdx < SlidesSrv.all.length - 1;
//        },
//
//        getPrevClass: function () {
//            if (!SlidesSrv.hasPrev()) {
//                return 'animated fadeOutLeftBig';
//            }else{
//                return 'animated fadeInLeftBig';
//            }
//        },
//
//        getNextClass: function () {
//            if (!SlidesSrv.hasNext()) {
//                return 'animated fadeOutRightBig';
//            }else{
//                return 'animated fadeInRightBig';
//            }
//        },
//
//
//        selectItem: function (idx) {
//            var idx = parseInt(idx);
//
//            function loadSlide() {
//                SlidesSrv.selected = SlidesSrv.all[idx];
//                SlidesSrv.selected.isSelected = true;
//                SlidesSrv.selectedIdx = idx;
//                SlidesSrv.slidePath = SlidesSrv.getSlidePath(SlidesSrv.selected.name);
//                $location.path("/slides/" + idx);
//            }
//
//            // Unselect previous selection.
//            if (SlidesSrv.selected && SlidesSrv.selectedIdx !== idx) {
//
//                if (SlidesSrv.selectedIdx > idx) {
//                    SlidesSrv.move = "PREV";
//                } else {
//                    SlidesSrv.move = "NEXT";
//                }
//                SlidesSrv.selected.isSelected = false;
//
//                $timeout(function () {
//                    loadSlide();
//                }, 1000);
//            } else {
//                loadSlide();
//            }
//        },
//
//        getSlideClass: function () {
//
//            if(SlidesSrv.selected){
//                if (SlidesSrv.move === 'PREV') {
//                    return SlidesSrv.selected.isSelected ? 'animated fadeInLeftBig' : 'animated fadeOutRightBig';
//                } else {
//                    return SlidesSrv.selected.isSelected ? 'animated fadeInRightBig' : 'animated fadeOutLeftBig';
//                }
//            }
//        },
//
//        getSlidePath: function (name) {
//            return "partials/slides/" + name + ".html";
//        },
//
//
//        allCount: function () {
//            return SlidesSrv.all.length;
//        }
//    };
//
//    SlidesSrv.getSlides();
//    return SlidesSrv;
//}]);
//
//
//services.value('scroll', {
////    pageDown: function() {
////        var itemHeight = $('.entry.active').height() + 60;
////        var winHeight = $(window).height();
////        var curScroll = $('.entries').scrollTop();
////        var scroll = curScroll + winHeight;
////
////        if (scroll < itemHeight) {
////            $('.entries').scrollTop(scroll);
////            return true;
////        }
////
////        // already at the bottom
////        return false;
////    },
//
//    toCurrent: function() {
//        // Need the setTimeout to prevent race condition with item being selected.
//        window.setTimeout(function() {
//            var curScrollPos = $('nav > ul').scrollLeft();
//            var navWidth = $('nav ul').width();
//            var itemLeft = $('.slideSelected').offset().left;
//            var itemWidth = $('.slideSelected').width();
//            var itemX = curScrollPos + itemLeft;
//
//            console.log('slideX:' + (curScrollPos + itemLeft));
//            if(itemLeft + itemWidth > navWidth) {
//                $('nav > ul').animate({'scrollLeft': ((itemX + itemWidth + 80) - navWidth)}, 200);
//                //console.log('SCROLL:' + ((itemX + itemWidth + 20) - navWidth));
//            }else if(itemLeft < 0) {
//                $('nav > ul').animate({'scrollLeft': curScrollPos + itemLeft - 20}, 200);
//            }
//
//            console.log('curScrollPos:' + curScrollPos);
//            console.log('navWidth:' + navWidth);
//            console.log('itemLeft:' + itemLeft);
//        }, 0);
//
//        //console.log($('slide.isSelected').offset().left);
//        //'nav li:hover'
//    }
//});

