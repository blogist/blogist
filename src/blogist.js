// if(window.location.pathname!="/"){
// 	window.location = window.location.origin + "#" +window.location.pathname.replace(".html","");
// }

var username = $("meta[name=username]").attr("content");


var blogdetailModel = Model.extend({
	dataOptions:{dataType:"jsonp"}
});

var GIST_DIGEST_URL = 'post@https://sender.blockspring.com/api_v1/blocks/1baa8d4d0b12f88dbde97766afbf73c2?api_key=2a2cf36a672dc1dad01ce6e6a5281987';

var bloglistModelFor = function(name){
	return Model.extend({
		dataOptions:{
			crossDomain: true, data:{base_url:"https://gist.github.com/" + name}}
	});
};

var BloglistModel = bloglistModelFor(username);

var bloglistModel = new BloglistModel("bloglist",GIST_DIGEST_URL);

var BlogDetailView = View.extend({
	el:$("#blogist"),
	template:"src/templates/article.html"
});

var BloglistView = View.extend({
	model:bloglistModel,
	el: $("#blogist"),
	template:"src/templates/gistlist.html",
	preProcessData:function(data){
		return {results: JSON.parse(data.results)};
	}
});

var router = new Router();
var bloglist;
router.get("/", function(){
	loading()
	bloglist = new BloglistView();
	bloglist.render({page:1});
	$('#disqus_thread').remove();
});

router.get("/page/:number", function(params){
	loading();
	bloglist.render({page:params.number});
});

var loadDisqus = function(){
	if(!$('#disqus_thread').length)
		$("#blogist").append($("<div id='disqus_thread'></div>"));
	disqus_identifier = window.location.hash.replace('#','');
	disqus_url = window.location.href.replace('/#','');
	disqus_title = "{{data.description}}"|| $('.gist-meta a').eq(1).text() || document.title;
	DISQUS.reset({reload:true});
};

var blogDetailOf = function(gistid){
	var model = new blogdetailModel(gistid,'get@https://gist.github.com/'+username+'/'+ gistid +".json");
	var view = new BlogDetailView({model:model});
	view.render({disqus_name:$('meta[name=disqus_name]').attr('content')});
	loadDisqus();
};

router.get("/gist/:gistid/?",function(params,data){
	loading();
	blogDetailOf(params.gistid);
});

router.get("/gist/:gistid/.+",function(params,data){
	loading();
	blogDetailOf(params.gistid);
});

$('#overlord').hover(function(){
	$(this).addClass('overlord_active');
},function(){
	$(this).removeClass('overlord_active');
});

var loading = function(){
	$('#blogist').html('<img src="stylesheets/img/loading-cubes.svg" class="center-block">');
};

// for trail user
router.get('/user/:name', function(params){
	loading();
	var BloglistModel = bloglistModelFor(params.name);

	var bloglistModel = new BloglistModel("bloglist",GIST_DIGEST_URL);

	var TrailBloglistView = BloglistView.extend({
		model:bloglistModel
	});

	bloglist = new TrailBloglistView();
	bloglist.render({page:1});

});
