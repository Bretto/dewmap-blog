'use strict';
/* App Controllers */

function PostsCtrl($scope, $log, $location, PostService) {
    $log.info('PostsCtrl');
    $scope.postService = PostService;
}


function PostCtrl($scope, $log, $location, $routeParams, PostService) {
    $log.info('PostCtrl');
    $scope.postService = PostService;


    if(typeof DISQUS !== 'undefined'){
        DISQUS.reset();
    }


    var disqus_shortname = 'dewmap';
    var disqus_identifier = $routeParams.postId;
//    var disqus_url = document.URL;

    /* * * DON'T EDIT BELOW THIS LINE * * */
    (function() {
        var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
        dsq.src = 'http://' + disqus_shortname + '.disqus.com/embed.js';
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
    })();

}


function EditPostCtrl($scope, $log, $routeParams, PostService, $timeout) {

    $log.info('EditPostCtrl');
    $scope.postService = PostService;

    $scope.isClean = function () {
        return angular.equals(PostService.originalPost, $scope.post) ? true : false;
    }

    $scope.onBack = function(){
        window.history.back();
    }
}


function NewPostCtrl($scope, $log, $location, PostService) {
    $log.info('CreatePostCtrl');
    $scope.postService = PostService;
    $scope.post = new PostVO();
}


function NavCtrl($scope, $log, $location, PostService) {
    $log.info('NavCtrl');
    $scope.postService = PostService;

    $scope.$watch(function(){return PostService.isAdmin }, function(newValue) {

        $scope.loginStatus = (PostService.isAdmin)? 'Logout':'Login';

    }, true); // init

}


function MainCtrl($scope, $log, $location, $rootScope, $http, PostService) {
    $log.info('MainCtrl');

    $scope.$on('error', function(event, obj){
        $log.info('Broadcasting');
        if(obj.status === 401){
            $location.path('login');
        }
    });

    $scope.message = '';

    $scope.onSubmit = function(user){
        $http.post('/login', user).
            success(function (data) {
                $log.info('Login Success');
                $('#notifications').prepend(data.message);
                PostService.isLoggedIn = true;
            }).
            error(function (data, status, headers, config) {
                $log.info('Login Error');
                $('#notifications').prepend(headers().message);
                PostService.isLoggedIn = false;
            });
    }

}
