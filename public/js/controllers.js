'use strict';
/* App Controllers */

function PostsCtrl($scope , $location, PostRes, PostSrv){
    console.log('PostsCtrl');
    $scope.PostSrv = PostSrv;
    $scope.posts = PostSrv.getPosts();
}
PostsCtrl.$inject = ['$scope', '$location', 'PostRes', 'PostSrv'];


function PostCtrl($scope , $log, $location, $routeParams, PostSrv, PostRes){
    $log.info('PostCtrl');
    $scope.PostSrv = PostSrv;

    if($routeParams.postId === "preview"){
        $scope.post = PostSrv.editPost;
    }
    else{
        $scope.post = PostSrv.getPost($routeParams.postId);
    }
}


PostCtrl.$inject = ['$scope', '$log', '$location', '$routeParams', 'PostSrv', 'PostRes'];


function EditPostCtrl($scope , $log, $routeParams, PostSrv, PostRes){
    $log.info('EditPostCtrl');
    $scope.PostSrv = PostSrv;

    // if there is an edited post &
    // the editPost is the post we are interested in or
    // it is a new post that we are previewing

    if(PostSrv.editPost && ( PostSrv.editPost._id === $routeParams.postId || PostSrv.editPost._id === undefined ))
    {
        $scope.post = PostSrv.editPost;
    }else{
        $scope.post = PostSrv.getPost($routeParams.postId);
    }

    $scope.isClean = function() {
        if(angular.equals(PostSrv.originalPost, $scope.post)){
            PostSrv.isSaved = true;
        }else{
            PostSrv.isSaved = false;
        }
    }

//       $scope.$watch(function(){return $scope.post }, function(newValue) {
//       //console.log(newValue);
//       //console.log(oldValue);
//        if(angular.equals(original, $scope.post){
//           console.log('true');
//       }else{
//           console.log('false');
//       }
//
//    }, true); // init

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























