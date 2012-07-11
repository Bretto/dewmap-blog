'use strict';


// Demonstrate how to register services
// In this case it is a simple constant service.
var services = angular.module('myApp.services', ['ngResource']);


//https://api.mongolab.com/api/1/databases/dewmapdb/collections?apiKey=4fd02554e4b03c95aa78700a
//services.factory('PostRes', function($resource) {
//    var PostRes = $resource('https://api.mongolab.com/api/1/databases/dewmapdb/collections/post/:id',
//        { apiKey: '4fd02554e4b03c95aa78700a' }, {
//            update: { method: 'PUT' }
//        }
//    );
//
//    PostRes.prototype.update = function(cb) {
//            return PostRes.update({id: this._id.$oid},
//                angular.extend({}, this, {_id:undefined}), cb);
//        };
//
//    PostRes.prototype.destroy = function(cb) {
//            return PostRes.remove({id: this._id.$oid}, cb);
//        };
//
//        return PostRes;
//    });


services.factory('PostRes', function($resource, $location) {

    var urlPrefix,
        PostRes;

    if($location.host() === 'localhost'){
        urlPrefix = $location.protocol() + '://' + $location.host() + '::PORT/api/post/:id';
        PostRes = $resource(urlPrefix,
            { id: '@_id', PORT:'5000' }, {
                update: { method: 'PUT' }
            }
        );
    }else{
        urlPrefix = 'http://cold-dusk-1881.herokuapp.com/api/post/:id';
        PostRes = $resource(urlPrefix,
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



services.factory('PostSrv', function( $routeParams, PostRes, $location ) {

    var PostSrv = {

        isAdmin: false,

        isAdminClass : function(){
            if(!PostSrv.isAdmin) return 'is-not-admin';
        },

        onAdmin: function(){
            PostSrv.isAdmin = (PostSrv.isAdmin) ? false : true;
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
            $location.path("post/");
        },

        onNew: function(){
            $location.path("post/new");
        },

        onDestroy: function(post){
            post.destroy(function() {
                $location.path('post/');
            });
        },

        onSave: function(post){
            if(post._id == undefined){

                PostRes.save(post, function(post) {
                    $location.path('post/' + post._id + '/edit');
                });
            }else{
                post.update(function() {
                    $location.path('post/');
                });
            }
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