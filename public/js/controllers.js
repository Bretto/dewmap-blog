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
}
PostCtrl.$inject = ['$scope', '$log', '$location', '$routeParams', 'PostSrv', 'PostRes'];


function EditPostCtrl($scope , $log, $routeParams, PostSrv, PostRes){
    $log.info('EditPostCtrl');
    $scope.PostSrv = PostSrv;
    $scope.post = PostRes.get({id: $routeParams.postId});
}
EditPostCtrl.$inject = ['$scope', '$log', '$routeParams', 'PostSrv', 'PostRes'];


function CreatePostCtrl($scope , $location, PostRes, PostSrv){
    $scope.PostSrv = PostSrv;
    $scope.post = new PostVO();
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























