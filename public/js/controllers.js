'use strict';
/* App Controllers */

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
    $scope.PostSrv = PostSrv;
}
NavCtrl.$inject = ['$scope', '$location', 'PostSrv'];



function MainCtrl($scope, $location, $rootScope){
    console.log('MainCtrl');
}
MainCtrl.$inject = ['$scope', 'PostSrv', '$location'];























