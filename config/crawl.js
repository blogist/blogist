var Browser = require('zombie'),
    url     = require('url'),
    fs      = require('fs'),
    saveDir = __dirname,
		p = require("path"),
		RSS = require('rss'),
		mkdirp = require("mkdirp");
var https = require('https');

var feed = new RSS({
  title: "Jichao Ouyang's Blogist",
  description: "{{description}}",
  feed_url: '{{homepage}}/rss.xml',
  site_url: '{{homepage}}',
  image_url:'{{homepage}}/favicon.png',
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
var browser = new Browser(browserOpts);
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
  var uri = "{{homepage}}/#/gist/" +  gist.id + "/" + gist.description;
	console.log(uri);
	browser.open();
  browser.visit(uri)
		.then(function() {
			// console.log(html);
			var url= "{{homepage}}/gist/" + gist.id + "/" + postfix; // link to the item
			
			feed.item({
				title: title,
				description: browser.html("article"),
				url: url, // link to the item
				author: gist.owner, // optional - defaults to feed author property
				date: gist.created_at // any format that js Date can parse.
			});
			saveSnapshot(url, browser.html());
			browser.close();
			if(idx+1 === arr.length){
				var xml = feed.xml();
				fs.writeFileSync("rss.xml",xml);
				console.log("DONE");
			}else{
				console.log("crawl",idx);
				crawlPage(idx+1, arr);							
			}
		});
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


