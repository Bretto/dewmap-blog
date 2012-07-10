//'use strict';
/* App Controllers */

//
//function AppCtrl($scope, $http, $routeParams, scroll, SlidesSrv) {
//
//    $scope.SlidesSrv = SlidesSrv;
//    console.log('AppCtrl');
//
//    //$("body").on("touchmove", false);
//
//    var hammer = new Hammer($("#main-content").get(0));
//
//// ondrag we preview the next/prev slide
//    hammer.ondrag = function(ev) {
//        if(ev.direction == 'left') {
//            console.log('LEFT');
//        } else if(ev.direction == 'right') {
//            console.log('RIGHT');
//        }
//    };
//
//    hammer.ondragend = function(ev) {
//        if(Math.abs(ev.distance) > 100) {
//            if(ev.direction == 'right') {
//                console.log('END RIGHT');
//                SlidesSrv.prev();
//            } else if(ev.direction == 'left') {
//                console.log('END LEFT');
//                SlidesSrv.next();
//            }
//            $scope.$apply();
//        }
//    };
//
//
//    $scope.openNav = function(){
//        $('#main-footer').toggleClass('open-nav');
//    }
//
//
//
//    $scope.$watch('SlidesSrv.selectedIdx', function(newVal, oldVal) {
//        console.log('new:' + newVal + ' | ' + 'old:' + oldVal)
//        if (newVal !== null) scroll.toCurrent();
//    });
//
//
//}
//AppCtrl.$inject = ["$scope", "$http", "$routeParams", "scroll", "SlidesSrv"];
//
//
//function SlideCtrl($scope, $routeParams, $location, SlidesSrv) {
//
//    console.log('SlideCtrl');
//
//
//    function init() {
//        //location change ( ei: history or deeplink )
//        SlidesSrv.selectItem($routeParams.slideIdx);
//    }
//
//    if (SlidesSrv.all.length === 0) {
//        $scope.$watch(function () {
//            return SlidesSrv.all
//        }, function (value) {
//            if (value.length > 0) {
//                init();
//            }
//        });
//    } else {
//        init();
//    }
//
//    $scope.$on('$includeContentLoaded', function (event) {
//        prettyPrint();
//    });
//
//
//}
//SlideCtrl.$inject = ["$scope", "$routeParams", "$location", "SlidesSrv"];
//
//
//function BindingExCtrl($scope) {
//    var items = $scope.items = [{name: "IPhone", price: 900},
//                                {name: "IPad", price: 1300},
//                                {name: "IPod", price: 300},
//                                {name: "ITV", price: 1900}];
//
//    var card = $scope.card = [];
//
//    $scope.addItemToCard = function(item){
//        card.push(item);
//    };
//
//    $scope.removeItemFromCard = function(item){
//        var idx = card.indexOf(item);
//        card.splice(idx, 1);
//    };
//
//    $scope.totalPrice = function(){
//        var price = 0;
//        angular.forEach(card, function(item) {
//            price += item.price;
//        });
//        return price;
//    };
//}
//BindingExCtrl.$inject = ["$scope"];



function SQDCtrl($scope, $rootScope, $http, $log) {

     var factory  = createCRUDBuilder($scope, $http, $log);
     var PostSrv  = factory.buildService("post");


    $scope.Save = function(){

        console.log(PostSrv.scope.post._id);
        console.log(PostSrv.scope.post.title);
        PostSrv.save(PostSrv.scope.post)
            .then(function (data) {
                //PostSrv.scope.post = data;
        });

    }

    $scope.Query = function(){
        PostSrv.get()
            .then(function (data) {
                PostSrv.scope.posts = data;
            });

    }

    $scope.Delete = function(){
        PostSrv.delete(PostSrv.scope.post._id)
            .then(function (data) {
                //response = data;
            });
    }

    $scope.selectPost = function($index){
        PostSrv.scope.post = PostSrv.scope.posts[$index];
    }

}
SQDCtrl.$inject = ['$scope', '$rootScope', '$http', '$log'];




//function PostCtrl($scope , $http, $log){
//
//    var factory  = createCRUDBuilder($scope, $http, $log);
//    var PostSrv  = factory.buildService("post");
//
//    PostSrv.get()
//        .then(function (data) {
//            PostSrv.scope.post = data[0];
//        });
//
//
//}
//PostCtrl.$inject = ['$scope','$http', '$log'];

function createCRUDBuilder($scope, $http, $log) {

    function buildCRUD( className ) {

        // **********************************************************
        // Async Response Handlers
        // ************************************************************

        var onSuccess = function( callback, logMsg ) {

                return function (response) {
                    $log.log( logMsg || "" );
                    //callback(null, response);
                    return response.data;
                };

            },
            onError = function( callback, defaultErrMsg ) {
                return function (response) {
                    //callback(response.error || defaultErrMsg );
                    return response.error;
                };
            },

        // **********************************************************
        // Utility methods
        // ************************************************************

            buildRequestURL = function(objectId) {
                var url = "https://api.mongolab.com/api/1/databases/dewmapdb/collections/"+className;
                url = !objectId ? url : (url + "/" + objectId);
                console.log(url);
                return url + '?apiKey=4fd02554e4b03c95aa78700a';
            },

        // **********************************************************
        // CRUD Operations
        // ************************************************************

            saveFn = function( data, callback) {
                return data._id ? updateFn(data, callback) : createFn(data, callback);
            },

            createFn = function( data, callback) {
                return $http.post(
                    buildRequestURL(),
                    data,
                    { headers: angular.parseHeaders }
                )
                    .then(
                    onSuccess(callback),
                    onError(callback,"Cannot submit data!")
                );
            },

            updateFn = function( data, callback) {
                return $http.put(
                    buildRequestURL(data._id.$oid),
                    angular.extend({}, data, {_id:undefined}),
                    { headers: angular.parseHeaders }
                )
                    .then(
                    onSuccess(callback),
                    onError(callback,"Cannot submit data!")
                );
            },
            getFn = function( objectId, callback) {
                return $http.get(
                    buildRequestURL(objectId),
                    { headers: angular.parseHeaders }
                )
                    .then(
                    onSuccess(callback),
                    onError(callback, "Cannot get object "+className+"/"+objectId+"!" )
                );
            },
            deleteFn = function( objectId, callback) {
                return $http.delete(
                    buildRequestURL(objectId),
                    { headers: angular.parseHeaders }
                )
                    .then(
                    onSuccess(callback),
                    onError(callback, "Cannot delete object "+className+"\/"+objectId+"!" )
                );
            },
            queryFn = function( query,    callback) {
                var config = { headers: angular.parseHeaders };
                if (query) {
                    config.params = { where: query };
                }

                return $http.get(
                    buildRequestURL(),
                    config
                )
                    .then(
                    onSuccess(callback),
                    onError(callback, "Could not query "+className+"!" )
                );
            };

        return {
            scope   : $scope,
            save    : saveFn,
            create  : createFn,
            update  : updateFn,
            get     : getFn,
            query   : queryFn,
            delete  : deleteFn
        };

    }

    return {
        buildService : buildCRUD
    };

}



function PostsCtrl($scope , $location, PostRes, PostSrv){
    console.log('PostsCtrl');
    $scope.PostSrv = PostSrv;
    $scope.posts = PostRes.query();
}
PostsCtrl.$inject = ['$scope', '$location', 'PostRes', 'PostSrv'];



function PostCtrl($scope , $log, $location, $routeParams, PostSrv, PostRes){
    $log.info('PostCtrl');
    $scope.PostSrv = PostSrv;
    $scope.post = PostRes.get({id: $routeParams.postId});

//    if(PostSrv.post._id){
//        $scope.post = PostSrv.post;
//    }
//    else{
//        PostRes.get({id: $routeParams.postId}, function( post ){
//            PostSrv.savedPost = post;
//            PostSrv.post = new PostRes(post);
//            $scope.post = PostSrv.post;
//        });
//    }

}
PostCtrl.$inject = ['$scope', '$log', '$location', '$routeParams', 'PostSrv', 'PostRes'];


function EditPostCtrl($scope , $log, $location, $routeParams, PostSrv, PostRes){
    $log.info('EditPostCtrl');
    $scope.PostSrv = PostSrv;
    $scope.post = PostRes.get({id: $routeParams.postId});

//    var date = moment(new Date());
//    date = date.format('MMM D');
//
//    if(PostSrv.post._id){
//        $scope.post = PostSrv.post;
//    }
//    else{
//        PostRes.get({id: $routeParams.postId}, function( post ){
//            PostSrv.savedPost = post;
//            PostSrv.post = new PostRes(post);
//            $scope.post = PostSrv.post;
//            $scope.post.date = date;
//            $scope.post.year = moment().year();
//        });
//    }
//
//
//    $scope.destroy = function() {
//        PostSrv.savedPost.destroy(function() {
//            $location.path('/post');
//        });
//    };
//
//    $scope.save = function() {
//        var newPost = PostSrv.post;
//        newPost.update(function() {
//            $location.path('/post');
//        });
//    };

}
EditPostCtrl.$inject = ['$scope', '$log', '$location', '$routeParams', 'PostSrv', 'PostRes'];


function CreatePostCtrl($scope , $location, PostRes, PostSrv){
    $scope.PostSrv = PostSrv;
    $scope.post = new PostVO();

//    $scope.save = function() {
//        PostRes.save($scope.post, function(post) {
//            $location.path('/post/' + post._id + '/edit');
//        });
//    }

}
CreatePostCtrl.$inject = ['$scope','$location', 'PostRes', 'PostSrv'];


function NavCtrl($scope, $location, PostSrv){

    $scope.isAdmin = PostSrv.isAdmin;

    $scope.onPosts = function(){
       // $location.path("post");
    }

    $scope.onAdmin = function(){

        PostSrv.isAdmin = (PostSrv.isAdmin) ? false : true;
        $scope.isAdmin = PostSrv.isAdmin;
    }

}
NavCtrl.$inject = ['$scope', '$location', 'PostSrv'];



function MainCtrl($scope, $location, $rootScope){
    console.log('MainCtrl');
}
MainCtrl.$inject = ['$scope', 'PostSrv', '$location'];























