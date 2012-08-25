'use strict';
/* App Controllers */


function LoginCtrl($scope, $log, $http, $location, $routeParams, PostSrv, PostRes) {
    $log.info('LoginCtrl');
//    $http.get('/login').
//        success(function (data) {
//            $log.info('LoginCtrl Success');
//        }).
//        error(function () {
//            $log.info('LoginCtrl Success');
//        });

    $scope.message = '<p>hello</p>';


    $scope.onSubmit = function(user){
        $http.post('/login', user).
            success(function (data) {
                $log.info('LoginCtrl Success');
                $scope.message = data.message;
            }).
            error(function () {
                $log.info('LoginCtrl Error');
            });
    }
}
LoginCtrl.$inject = ['$scope', '$log', '$http', '$location', '$routeParams', 'PostSrv', 'PostRes'];


function PostsCtrl($scope, $log, $location, PostRes, PostSrv) {
    $log.info('PostsCtrl');
    $scope.PostSrv = PostSrv;
    $scope.posts = PostSrv.getPosts();
}
PostsCtrl.$inject = ['$scope', '$log', '$location', 'PostRes', 'PostSrv'];


function PostCtrl($scope, $log, $location, $routeParams, PostSrv, PostRes) {
    $log.info('PostCtrl');
    $scope.PostSrv = PostSrv;

    if ($routeParams.postId === "preview") {
        $scope.post = PostSrv.editPost;
    }
    else {
        $scope.post = PostSrv.getPost($routeParams.postId);
    }
}
PostCtrl.$inject = ['$scope', '$log', '$location', '$routeParams', 'PostSrv', 'PostRes'];


function EditPostCtrl($scope, $log, $routeParams, PostSrv, PostRes) {
    $log.info('EditPostCtrl');
    $scope.PostSrv = PostSrv;

    // if there is an edited post &
    // the editPost is the post we are interested in or
    // it is a new post that we are previewing

    if (PostSrv.editPost && ( PostSrv.editPost._id === $routeParams.postId || PostSrv.editPost._id === undefined )) {
        $scope.post = PostSrv.editPost;
    } else {
        $scope.post = PostSrv.getPost($routeParams.postId);
    }

    $scope.isClean = function () {
        if (angular.equals(PostSrv.originalPost, $scope.post)) {
            PostSrv.isSaved = true;
        } else {
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


function CreatePostCtrl($scope, $log, $location, PostRes, PostSrv) {
    $log.info('CreatePostCtrl');
    $scope.PostSrv = PostSrv;
    $scope.post = new PostVO();
}
CreatePostCtrl.$inject = ['$scope', '$log', '$location', 'PostRes', 'PostSrv'];


function NavCtrl($scope, $log, $location, PostSrv) {
    $log.info('NavCtrl');
    $scope.PostSrv = PostSrv;
}
NavCtrl.$inject = ['$scope', '$log', '$location', 'PostSrv'];


function MainCtrl($scope, $log, $location, $rootScope) {
    $log.info('MainCtrl');
}
MainCtrl.$inject = ['$scope', '$log', '$location', '$rootScope'];























