'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives']).
    config(['$routeProvider', function ($routeProvider, $locationProvider) {
    $routeProvider.
        when('/post', {controller:PostsCtrl, templateUrl:'partials/posts2.html'}).
        when('/post/new', {controller:CreatePostCtrl, templateUrl:'partials/edit-post.html'}).
        when('/post/:postId', {controller:PostCtrl, templateUrl:'partials/post2.html'}).
        when('/post/:postId/edit', {controller:EditPostCtrl, templateUrl:'partials/edit-post2.html'}).
        otherwise({redirectTo:'/post'});
}]);


