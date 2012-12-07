'use strict';
/* App Controllers */


function LoginCtrl($scope, $log, $http, $location, $routeParams, PostSrv) {
    $log.info('LoginCtrl');

    $scope.message = '';

    $scope.onSubmit = function(user){
        $http.post('/users', user).
            success(function (data) {
                $log.info('LoginCtrl Success');
                $scope.message = data.message;
                PostSrv.isAdmin = true;
            }).
            error(function (data, status, headers, config) {
                $log.info('LoginCtrl Error');
                $scope.message = headers().message;
                PostSrv.isAdmin = false;
            });
    }
}
LoginCtrl.$inject = ['$scope', '$log', '$http', '$location', '$routeParams', 'PostSrv'];


function PostsCtrl($scope, $log, $location, PostSrv) {
    $log.info('PostsCtrl');
    $scope.PostSrv = PostSrv;

    var response = function(posts){
        $scope.posts = posts
    }

    PostSrv.getPosts(response);
}
PostsCtrl.$inject = ['$scope', '$log', '$location', 'PostSrv'];


function PostCtrl($scope, $log, $location, $routeParams, PostSrv) {
    $log.info('PostCtrl');
    $scope.PostSrv = PostSrv;

    var response = function(post){
        $scope.post = post;
    }

    if ($routeParams.postId === "preview") {
        $scope.post = PostSrv.editPost;
    }
    else {
        PostSrv.getPost($routeParams.postId, response);
    }


}
PostCtrl.$inject = ['$scope', '$log', '$location', '$routeParams', 'PostSrv'];


function EditPostCtrl($scope, $log, $routeParams, PostSrv, $timeout) {



    $log.info('EditPostCtrl');

    $('#post-editor').autoresize();

    $scope.PostSrv = PostSrv;


    var response = function(post){
        $scope.post = post;
        // hack for lack of a better way
        $timeout(function() {
            $('#post-editor').trigger('myEvent');
        }, 0, false);

    }

    // if there is an edited post &
    // the editPost is the post we are interested in or
    // it is a new post that we are previewing

    if (PostSrv.editPost && ( PostSrv.editPost._id === $routeParams.postId || PostSrv.editPost._id === undefined )) {
        response(PostSrv.editPost);
    } else {
        PostSrv.getPost($routeParams.postId, response);
    }

    $scope.isClean = function () {
        if (angular.equals(PostSrv.originalPost, $scope.post)) {
            PostSrv.isSaved = true;
        } else {
            PostSrv.isSaved = false;
        }
    }




}
EditPostCtrl.$inject = ['$scope', '$log', '$routeParams', 'PostSrv', '$timeout'];


function CreatePostCtrl($scope, $log, $location, PostSrv) {
    $log.info('CreatePostCtrl');
    $scope.PostSrv = PostSrv;
    $scope.post = new PostVO();
}
CreatePostCtrl.$inject = ['$scope', '$log', '$location', 'PostSrv'];


function NavCtrl($scope, $log, $location, PostSrv) {
    $log.info('NavCtrl');
    $scope.PostSrv = PostSrv;



    $scope.$watch(function(){return $scope.PostSrv.isAdmin }, function(newValue) {

        $scope.loginStatus = ($scope.PostSrv.isAdmin)? 'Logout':'Login';

    }, true); // init

}
NavCtrl.$inject = ['$scope', '$log', '$location', 'PostSrv'];


function MainCtrl($scope, $log, $location, $rootScope) {
    $log.info('MainCtrl');

    $scope.$on('error', function(event, obj){
        $log.info('Broadcasting');
        if(obj.status === 401){
            $location.path('login');
        }
    });



}
MainCtrl.$inject = ['$scope', '$log', '$location', '$rootScope'];























