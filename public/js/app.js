'use strict';

angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives']).
    config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider.
        when('/login', {templateUrl:'/partials/login'}).
        when('/about', {templateUrl:'/partials/about'}).
        when('/post', {templateUrl:'/partials/posts',

            controller:function ($scope, posts, PostService)
            {
                $scope.posts = posts;
            },
            resolve:{
                posts:function ($q, $route, PostService)
                {
                    var deferred = $q.defer();

                    var successCb = function (result)
                    {
                        if (angular.equals(result,[]))
                        {
                            deferred.reject("No Posts found !");
                        }
                        else
                        {
                            deferred.resolve(result);
                        }
                    };

                    PostService.getPosts(successCb);

                    return deferred.promise;
                }
            }
        }).
        when('/post/new', {controller:NewPostCtrl, templateUrl:'/partials/edit-post'}).
        when('/post/:postId', {templateUrl:'/partials/post',
            controller:function ($scope, $routeParams, post, PostService)
            {
                $scope.post = post;
            },
            resolve:{
                post:function ($q, $route, $timeout, PostService)
                {
                    var deferred = $q.defer();

                    var successCb = function (result)
                    {
                        if (angular.equals(result,[]))
                        {
                            deferred.reject("No Posts found !");
                        }
                        else
                        {
                            deferred.resolve(result);
                        }
                    };

                    PostService.getPost($route.current.params.postId, successCb);

                    return deferred.promise;
                }
            }
        }).
        when('/post/:postId/edit', {templateUrl:'/partials/edit-post',
            controller:function ($scope, $timeout, post, PostService)
            {
                $scope.post = post;

                //textArea resize hack for lack of a better way
                $('#post-editor').autoresize();
                $timeout(function() {
                    $('#post-editor').trigger('textAreaResizeEvent');
                }, 0, false);
            },
            resolve:{
                post:function ($q, $route, $timeout, PostService)
                {
                    var deferred = $q.defer();

                    var successCb = function (result)
                    {
                        if (angular.equals(result,[]))
                        {
                            deferred.reject("No Posts found !");
                        }
                        else
                        {
                            deferred.resolve(result);
                        }
                    };

                    PostService.getPost($route.current.params.postId, successCb);

                    return deferred.promise;
                }
            }
        }).
        otherwise({redirectTo:'/post'});
    $locationProvider.html5Mode(true);
}]);


//textarea resize to height based on text
(function($){
    $.fn.extend({
        autoresize: function() {
            return this.each(function() {
                var hiddenDiv = $(document.createElement('div'));
                var content = null;
                $(this).addClass('txtstuff');
                hiddenDiv.addClass('hiddendiv common');
                $('body').append(hiddenDiv);
                $(this).live('input textAreaResizeEvent', function() {
                    console.log('live');
                    content = $(this).val();
                    content = content.replace(/\n/g, '<br>');
                    hiddenDiv.html(content + "<br class='lbr'>");
                    $(this).css('height', hiddenDiv.height());
                });
            });
        }
    });
})(jQuery);


