// This is the main angular app file

var app = angular.module('myApp', []);

// controller for post list
app.controller('PostsController', ['$scope', 'tumblogService', 'tumblrAgService', function($scope, tumblogService, tumblrAgService) {
	// tumblogService returns the blog list, then in the success function
	// tumblrAgService makes an http request for each blog
	// using blog_url and pushes each post into a postList array
	$scope.blogs = [];
	$scope.agPosts = [];
	tumblogService.blogs()
		.success(function(data, status) {
			$scope.blogs = data.blogs;
			$scope.agPosts = tumblrAgService.posts(tumblrKey, $scope.blogs);
		});	

}]);

// controller for blogname input form
app.controller('BlogsController', ['$scope', 'blogInputService', function($scope, blogInputService) {
	// slice up the url before saving to json file
	$scope.input = {}; // get input as object
	
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

// check for title
// check post type to look for body or caption
// unescape html for body/caption...figure out how $sce works
app.factory('tumblrAgService', ['$http', function($http) {
	var doRequest = function(tumblrKey, blogs) {

		var postsList = [];

		for (var i = 0; i < blogs.length; i++) {
			$http({
				method: 'JSONP',
				url: tumblrUrl + blogs[i].blog_url + '/posts?api_key=' + tumblrKey + '&limit=10&callback=JSON_CALLBACK'
			})
			.success(function(data, status) {
				if (data) {
					console.log(data.response.posts);
					for (var j = 0; j < data.response.posts.length; j++) {
						postsList.push(data.response.posts[j]);
						postsList.sort(compareTimestamp);
					}
				}
			});
		}


		return postsList;
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

app.factory('blogInputService', ['$http', function($http) {
	// process blog input
	var blog = {
		input: function(data) {
			// remove beginning "http://" and trailing "/" if they exist
			var post_data = strip_url(data.blog_url);

			$http({
				method: 'POST',
				url: 'data/blogs.json',
				data: post_data
			});
		}
	}
	
	return blog;
	
}]);

// comparison utility for sorting aggregated posts by timestamp
function compareTimestamp(a,b) {
	var a_timestamp = parseInt(a.timestamp);
	var b_timestamp = parseInt(b.timestamp);
	console.log("A: " + a_timestamp);

	if (a_timestamp < b_timestamp) {
		return 1;
	}
		
	if (a_timestamp > b_timestamp) {
		return -1;
	}
		
	return 0;
}

// utility to strip url of unnecessary parts
function strip_url(data) {
	var data = data;
	var str = data.blog_url;
	// if data starts with "http://www."
	if (str.slice(0,10) === "http://www") {
		// strip it
		str = str.slice(10, str.length);
	}
	// if data starts with "http://"
	if (str.slice(0,7) === "http://") {
		// strip it
		str = str.slice(7, str.length);
	}
	// if data ends with "/"
	if (str.slice(str.length - 1) === "/") {
		// strip it
		str = str.slice(0, string.length - 1);
	}
	data.blog_url = str;

	return data;
}


























