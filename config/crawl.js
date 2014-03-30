var Browser = require('zombie'),
    url     = require('url'),
    fs      = require('fs'),
    saveDir = __dirname,
		p = require("path"),
		RSS = require('rss'),
		mkdirp = require("mkdirp");
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

var feed = new RSS({
    title: "{{blog_title}}",
    description: "{{description}}",
    feed_url: '{{homepage}}/rss.xml',
    site_url: '{{homepage}}',
    image_url: '{{homepage}}/favicon.png',
    author: '{{github_name}}',
    language: 'en',
    ttl: '60'
});

/* loop over data and add to feed */


// cache the xml to send to clients
var xml = feed.xml();
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
    path += "index.html";

  var filename = saveDir + path;
	mkdirp.sync(p.dirname(filename));
	console.log("mkdir",filename);
	fs.writeFileSync(p.resolve(filename), body);
	console.log("save",filename);
};

var crawlPage = function(idx, arr) {
  // location = window.location
  if (idx < arr.length) {
		// console.log(arr);
		var gist = arr[idx];
		var postfix,title;
		console.log(gist.files);
		if (gist.description){
			postfix = gist.description + ".html";
			title=gist.description;
			}
		else{
			postfix= "index.html";
			for (var f in gist.files){
				title=f;
				break;
				}
			}
    var uri = "{{homepage}}/#/gist/" + arr[idx].id + "/" + arr[idx].description;
		console.log(uri);
		feed.item({
			title: title,
			description: gist.description,
			url: "{{homepage}}/gist/" + arr[idx].id + "/" + postfix, // link to the item
			author: gist.owner, // optional - defaults to feed author property
			date: gist.created_at // any format that js Date can parse.
		});
    var browser = new Browser(browserOpts);
    var promise = browser.visit(uri)
    .then(function() {
      saveSnapshot(uri, browser.html());
			crawlPage(idx+1, arr);
    });
  }else{
		var xml = feed.xml();
		fs.writeFileSync("rss.xml",xml);
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
												

