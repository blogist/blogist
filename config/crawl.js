var Browser = require('zombie'),
    url     = require('url'),
    fs      = require('fs'),
    saveDir = __dirname;
var https = require('https');
var scriptTagRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;

var stripScriptTags = function(html) {
  return html.replace(scriptTagRegex, '');
}

var browserOpts = {
  waitFor: 2000,
  loadCSS: false,
  runScripts: true
}

var saveSnapshot = function(uri, body) {
  var lastIdx = uri.lastIndexOf('#/');

  if (lastIdx < 0) {
    // If we're using html5mode
    path = url.parse(uri).pathname;
  } else {
    // If we're using hashbang mode
    path = 
      uri.substring(lastIdx + 1, uri.length);
  }

  if (path === '/') path = "/index.html";

  if (path.indexOf('.html') == -1)
    path += ".html";

  var filename = saveDir + path;
	console.log("save",filename);
  fs.open(filename, 'w', function(e, fd) {
    if (e) return;
    fs.write(fd, body);
  });
};

var crawlPage = function(idx, arr) {
  // location = window.location
	console.log("lenght ",arr.length);
  if (idx < arr.length) {
		// console.log(arr);
    var uri = "http://{{homepage}}/#/" + arr[idx].id;
		console.log(uri);
    var browser = new Browser(browserOpts);
    var promise = browser.visit(uri)
    .then(function() {
      saveSnapshot(uri, browser.html());
			crawlPage(idx+1, arr);
    });
  }
};

console.log("start snapping");

https.get({host:"api.github.com",path:"/users/{{github_name}}/gists","headers": {'User-Agent':"Mozilla/5.0","Content-Type":	"application/json"}}, function(res) {
	res.setEncoding('utf8');
	var data = "";
  res.on('data', function (chunk) {
		data +=chunk;
  });

	res.on('end',function(){
		crawlPage(0, JSON.parse(data)); 
	});
}).on('error', function(e) {
  console.error(e);
});
												

