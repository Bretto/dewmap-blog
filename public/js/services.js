'use strict';


var services = angular.module('myApp.services', []);

services.constant('endPointPrefix', '/api/post');


services.factory('HttpCache', function ($cacheFactory) {
    //To get the Resource to cache response
    return $cacheFactory('HttpCacheName');
});


services.factory('PostSrv', function ($http, $log, $rootScope, $routeParams, $location, HttpCache, endPointPrefix) {

    function deleteCachedPost(id) {
        var cacheKey = getCacheKey(id);
        if (HttpCache.get(cacheKey)) {
            PostSrv.cache.remove(cacheKey);
        }
    }

    function getCacheKey(id) {
        var PORT = ( $location.port() === null ) ? '' : ':' + $location.port();
        var KEY = $location.protocol() + '://' + $location.host() + PORT + endPointPrefix;

        if (id !== undefined) {
            KEY += '/' + id;
        }
        return KEY;
    }


    var PostSrv = {

        origPost:null,
        editPost:null,
        cache:HttpCache,
        isAdmin:false,

        onAdmin:function () {

            if(PostSrv.isAdmin){
                $http.get('/logout').
                    success(function (data) {
                        $log.info('Logged out !');
                    });
                PostSrv.isAdmin = false;
            }else{
                $location.path("login");
            }
        },

        isSaved:true,

        isSavedClass:function () {
            if (PostSrv.isSaved) return 'is-saved';
        },

        onQuery:function () {
            $location.path("post");
        },

        onRead:function (id) {
            $location.path("post/" + id);
        },

        onPreview:function (post) {
            PostSrv.editPost = post;
            $location.path("post/preview");
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
            deleteCachedPost();

            $http.delete('/api/post/' + post._id).
                success(function (data) {
                    $location.path('post/');
                }).
                error(function (data, status, headers, config) {
                    $log.info('Delete Error');
                    $rootScope.$broadcast('error',{status:status, data:data});
                });
        },

        onSave:function (post) {

            // delete the cached post listing as a
            // post was updated or created
            deleteCachedPost(); // the 'post' is implied

            if (post._id == undefined) {

                $http.post('/api/post', post).
                    success(function (data) {
                        $log.info('Create Success');
                        PostSrv.originalPost = data;
                        $location.path('post/' + data._id + '/edit');
                    }).
                    error(function (data, status, headers, config) {
                        $log.info('Create Error');
                        $rootScope.$broadcast('error',{status:status, data:data});
                    });

            } else {
                deleteCachedPost(post._id);

                $http.put('/api/post/' + post._id, angular.extend({}, post, {_id:undefined})).
                    success(function (data) {
                        $log.info('Save Success');
                        PostSrv.originalPost = data;
                    }).
                    error(function (data, status, headers, config) {
                        $log.info('Save Error');
                        $rootScope.$broadcast('error',{status:status, data:data});
                    });
            }
        },

        getPost:function (id, $scope) {

            $http.get('/api/post/' + id).
                success(function (data) {
                    PostSrv.originalPost = data;
                    $scope.post = data;
                });
        },

        getPosts:function ($scope) {
            $http.get('/api/post').
                success(function (data, status, headers, config) {
                    $scope.posts = data;
                });
        }

    }

    $http.get('/api/isLoggedId').
        success(function (data) {
            if(data === 'admin'){
                $log.info('you are logged-in');
                PostSrv.isAdmin = true;
            }else{
                $log.info('you are not logged-in');
                PostSrv.isAdmin = false;
            }
        });

    return PostSrv;
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