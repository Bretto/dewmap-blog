'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives']).
    config(['$routeProvider', function ($routeProvider, $locationProvider) {
    $routeProvider.
        when('/login', {controller:LoginCtrl, templateUrl:'partials/login.html'}).
        when('/post', {controller:PostsCtrl, templateUrl:'partials/posts'}).
        when('/post/new', {controller:CreatePostCtrl, templateUrl:'partials/edit-post'}).
        when('/post/:postId', {controller:PostCtrl, templateUrl:'partials/post'}).
        when('/post/preview', {controller:PostCtrl, templateUrl:'partials/post'}).
        when('/post/:postId/edit', {controller:EditPostCtrl, templateUrl:'partials/edit-post'}).
        otherwise({redirectTo:'/post'});
}]);


