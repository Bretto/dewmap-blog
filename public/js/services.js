'use strict';





var services = angular.module('myApp.services', ['ngResource']);

services.constant('endPointPrefix', '/api/post');


services.factory('HttpCache',function($cacheFactory)
{
    //To get the Resource to cache response
    return $cacheFactory('HttpCacheName');
});


services.factory('PostRes', function($resource, $location, HttpCache, endPointPrefix) {

    var url,
        PostRes;

    if($location.host() === 'localhost'){
        url = $location.protocol() + '://' + $location.host() + '::PORT' + endPointPrefix + '/:id';
        PostRes = $resource(url,
            { id: '@_id', PORT:'5000' }, {
                get: {
                    method:"GET",
                    cache:HttpCache  /*using our injected cache-factory */
                },
                query: {
                    method:"GET",
                    isArray:true,
                    cache:HttpCache  /*using our injected cache-factory */
                },
                update: { method: 'PUT' }
            }
        );
    }else{
        url = 'http://cold-dusk-1881.herokuapp.com' + endPointPrefix + '/:id';
        PostRes = $resource(url,
            { id: '@_id'}, {
                update: { method: 'PUT' }
            }
        );
    }

    PostRes.prototype.update = function(cb) {
            return PostRes.update({id: this._id},
                angular.extend({}, this, {_id:undefined}), cb);
        };

    PostRes.prototype.destroy = function(cb) {
            return PostRes.remove({id: this._id}, cb);
        };

    return PostRes;
});



services.factory('PostSrv', function( $routeParams, PostRes, $location, HttpCache, endPointPrefix ) {

    function deleteCachedPost(id){
        var cacheKey = getCacheKey(id);
        if(HttpCache.get(cacheKey)){
            PostSrv.cache.remove(cacheKey);
        }
    }

    function getCacheKey(id){
        var PORT = ( $location.port() === null )? '' : ':' + $location.port() ;
        var KEY = $location.protocol() + '://' + $location.host() + PORT + endPointPrefix;

        if(id !== undefined){
            KEY += '/' + id;
        }
        return KEY;
    }


    var PostSrv = {

        originalPost: null,
        cache: HttpCache,
        endPointPrefix: endPointPrefix,

        isAdmin: false,

        onAdmin: function(){
            PostSrv.isAdmin = (PostSrv.isAdmin) ? false : true;
        },

        isSaved: true,

        isSavedClass: function(){
          if(PostSrv.isSaved) return 'is-saved';
        },

        onQuery: function(){
            $location.path("post/");
        },

        onRead: function(id){
            $location.path("post/"+ id);
        },

        onEdit: function(id){
            $location.path("post/"+ id +"/edit");
        },

        onCancel: function(id){
            $location.path("post/"+ id);
        },

        onNew: function(){
            $location.path("post/new");
        },

        onDestroy: function(post){
            deleteCachedPost();
            post.destroy(function() {
                $location.path('post/');
            });
        },

        onSave: function(post){
            if(post._id == undefined){
                deleteCachedPost();
                PostRes.save(post, function(post) {
                    PostSrv.originalPost = new PostRes(post);
                    $location.path('post/' + post._id + '/edit');
                });
            }else{
                deleteCachedPost();
                deleteCachedPost(post._id);
                post.update(function(post) {
                    PostSrv.originalPost = new PostRes(post);
                });
            }
        },

        getPost: function(id){
            return PostRes.get({id: id}, function(post) {
                PostSrv.originalPost = new PostRes(post);
            });
        },

        getPosts: function(){
            return PostRes.query();
        }

    }

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