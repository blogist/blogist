if(window.location.pathname!="/"){
	window.location = window.location.origin + "#" +window.location.pathname.replace(".html","");
}

var username = $("meta[name=username]").attr("content");

var bloglistModel = new Model("bloglist",'get@https://api.github.com/users/'+username+'/gists');

var blogdetailModel = Model.extend({
	dataOptions:{dataType:"jsonp"}
});

var BlogDetailView = View.extend({
	el:$(".container .article"),
	template:"src/templates/article.html"
});

var BloglistView = View.extend({
	model:bloglistModel,
	el: $(".container .article"),
	template:"src/templates/gistlist.html"
});

var router = new Router();

router.get("/", function(){
	var bloglist = new BloglistView();
	bloglist.render();
	$('#disqus_thread').remove();
});

var loadDisqus = function(){
	if(!$('#disqus_thread').length)
		$(".container .blogist").append($("<div id='disqus_thread'></div>"));
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
	blogDetailOf(params.gistid);
});

router.get("/gist/:gistid/.+",function(params,data){
	blogDetailOf(params.gistid);
});
