var nunjucks = require('nunjucks'),
url     = require('url'),
    fs      = require('fs'),
    saveDir = __dirname,
		p = require("path"),
		RSS = require('rss'),
		mkdirp = require("mkdirp"),
_ = require("underscore");
var https = require('https');

var feed = new RSS({
  title: "Jichao Ouyang's Blogist",
  description: "<img src=https://travis-ci.org/jcouyang/blogist.svg> or failed",
  feed_url: 'http://oyanglul.us/atom.xml',
  site_url: 'http://oyanglul.us',
  image_url:'http://oyanglul.us/favicon.png',
  author: 'Jichao Ouyang',
  language: 'en',
  ttl: '60'
});

var browserOpts = {
  waitFor: 5000,
  loadCSS: true,
  runScripts: true
};
var saveSnapshot = function(uri, body) {
	
  var path = url.parse(uri).pathname;

  var filename = saveDir + path;
	mkdirp.sync(p.dirname(filename));
	console.log("mkdir",filename);
	fs.writeFileSync(p.resolve(filename), body);
	console.log("save",filename);
};

var settings = fs.readFileSync("./config/settings.json");
var crawlPage = function(idx, arr) {
	var gist = arr[idx];
	var postfix,title;
	if (gist.description){
		postfix = gist.description.replace(/ +/g,'-') + "/index.html";
		title=gist.description;
	}
	else{
		postfix= "index.html";
		for (var f in gist.files){
			title=f;
			break;
		}
	}
  var uri = "http://oyanglul.us/#/gist/" +  gist.id + "/" + gist.description;
	console.log(uri);
		https.get({host:"gist.github.com",path:"/jcouyang/"+gist.id+".json"}, function(res) {
		res.setEncoding('utf8');
		var data = "";
		res.on('data', function (chunk) {
			data +=chunk;
		});

		res.on('end',function(){

			var url= "http://oyanglul.us/gist/" + gist.id + "/" + postfix; // link to the item
			var gistjson = _(JSON.parse(data)).extend(JSON.parse(settings.toString()));
			var html = nunjucks.render("src/templates/crawl.html", {data:gistjson});
			feed.item({
				title: title,
				description: gistjson.div,
				url: url, // link to the item
				author: gistjson.owner, // optional - defaults to feed author property
				date: gistjson.created_at // any format that js Date can parse.
			});
			saveSnapshot(url, html);
			if(idx+1 === arr.length){
				var xml = feed.xml();
				fs.writeFileSync("atom.xml",xml);
				console.log("DONE");
			}else{
				console.log("crawl",idx);
				crawlPage(idx+1, arr);							
			}

		});
	}).on('error', function(e) {
		console.error(e);
	});

};

console.log("start snapping");

https.get({host:"api.github.com",path:"/users/jcouyang/gists","headers": {'User-Agent':"Mozilla/5.0","Content-Type":	"application/json"}}, function(res) {
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


