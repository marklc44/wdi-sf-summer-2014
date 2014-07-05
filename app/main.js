// This is the main angular app file

var app = angular.module('myApp', []);

// controller for post list
app.controller('PostsController', ['$scope', 'tumblogService', 'tumblrAgService',function($scope, tumblogService, tumblrAgService) {
	// tumblogService returns the blog list, then in the success function
	// tumblrAgService makes an http request for each blog
	// using blog_url and pushes each post into a postList array
	tumblogService.blogs()
		.success(function(data, status) {
			$scope.blogs = data.blogs;
			tumblrAgService.posts(tumblrKey, data.blogs)
				.then(function(data) {
					$scope.agPosts = data;
					console.log($scope.agPosts);
				});
			
		});	

	// run post processing service next

}]);

// controller for blogname input form
app.controller('BlogsController', ['$scope', function($scope) {
	// slice up the url before saving to json file
}]);

// Directive to display the tumblr list item view
// in this directive and corresponding view, need
// to sort by time/date when displaying - use timestamp.
// In view, limit size of excerpt and add read more button.

// probably also need an if(post-type === photo) view option as well
// check if(title) use title else use caption
// need to strip html out of post content/caption or insert as html

app.directive('tumblrLink', function() {
	return {
		restrict: 'EA',
		require: ['^ngModel'],
		replace: true,
		scope: {
			ngModel: '=',
			play: '&'
		},
		templateUrl: 'views/tumblrListItem.html',
		link: function(scope, ele, attr) {
			// change this to post link
			// scope.duration = scope.ngModel.audio[0].duration.$text;
		}
	}
});

// Services

// sample request: api.tumblr.com/v2/blog/{base-hostname}/posts[/type]?api_key={key}&[optional-params=]
var tumblrKey = 'ttswNEWaJ4bKeVcHVFvchCmRwyEi9YApr7JdWlIIB72xUvGzJU';
var tumblrUrl = 'http://api.tumblr.com/v2/blog/';

// Tumblr Service
// This is the service to get posts for a single request
// not currently used, but kept to be used in refactoring tumblrAgService
app.factory('tumblrService', ['$http', function($http) {
	var doRequest = function(tumblrKey, blogname) {
		return $http({
			method: 'JSONP',
			url: tumblrUrl + blogname + '/posts?api_key=' + tumblrKey + '&limit=10&callback=JSON_CALLBACK'
		});
	};

	return {
		posts: function(tumblrKey, blogname) { return doRequest(tumblrKey, blogname); }
	};
}]);

// takes a list of blog names and returns an aggregate list of posts
// refactor to use tumblrService instead of $http service?

// ammend view to display agPosts instead of posts
// write processing service to order posts by timestamp
// check for title
// check post type to look for body or caption
// unescape html for body/caption...figure out how $sce works
app.factory('tumblrAgService', ['$http', '$q',function($http, $q) {
	var doRequest = function(tumblrKey, blogs) {

		var postsList = [];
		var dfrd = $q.defer();
		dfrd.count = i;
		var promises = [];

		for (var i = 0; i < blogs.length; i++) {
			(function(i) {
				$http({
					method: 'JSONP',
					url: tumblrUrl + blogs[i].blog_url + '/posts?api_key=' + tumblrKey + '&limit=10&callback=JSON_CALLBACK'
				})
				.success(function(data, status) {
					if (data) {
						console.log(data);
						for (var j = 0; j < data.response.posts; j++) {
							postsList.push(data.response.posts[j]);
						}
						dfrd.resolve(postsList);
					}
					promises.push(dfrd.promise);
				});

			})(i);
			
		}
		console.log(postsList);
		return $q.all(promises);
	};

	return {
		posts: function(tumblrKey, blogs) { return doRequest(tumblrKey, blogs); }
	};
}]);

app.factory('tumblogService', ['$http', function($http) {
	var doRequest = function() {
		return $http({
			method: 'GET',
			url: 'data/blogs.json'
		});
	};

	return {
		blogs: function() { return doRequest(); }
	};
}]);



























