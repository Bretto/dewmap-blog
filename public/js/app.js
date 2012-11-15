'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives']).
    config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider.
        when('/login', {controller:LoginCtrl, templateUrl:'/partials/login'}).
        when('/post', {templateUrl:'/partials/posts'}).
        when('/post/new', {controller:CreatePostCtrl, templateUrl:'/partials/edit-post'}).
        when('/post/:postId', {controller:PostCtrl, templateUrl:'/partials/post'}).
        when('/post/preview', {controller:PostCtrl, templateUrl:'/partials/post'}).
        when('/post/:postId/edit', {controller:EditPostCtrl, templateUrl:'/partials/edit-post'}).
        otherwise({redirectTo:'/post'});
    $locationProvider.html5Mode(true);
}]);


(function($){
    $.fn.extend({
        autoresize: function() {
            return this.each(function() {
                var hiddenDiv = $(document.createElement('div'));
                var content = null;
                $(this).addClass('txtstuff');
                hiddenDiv.addClass('hiddendiv common');
                $('body').append(hiddenDiv);
                $(this).live('input myEvent', function() {
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