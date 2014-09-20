if(window.location.pathname!="/"){
	window.location = window.location.origin + "#" +window.location.pathname.replace(".html","");
}

var username = $("meta[name=username]").attr("content");


var blogdetailModel = Model.extend({
	dataOptions:{dataType:"jsonp"}
});

var BloglistModel = Model.extend({
	dataOptions:{
		crossDomain: true, data:{base_url:"https://gist.github.com/" + username}}
});

var bloglistModel = new BloglistModel("bloglist",'post@https://sender.blockspring.com/api_v1/blocks/1baa8d4d0b12f88dbde97766afbf73c2?api_key=2a2cf36a672dc1dad01ce6e6a5281987');

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

router.get("/", function(){
	var bloglist = new BloglistView();
	bloglist.render({page:1});
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

$('#overlord').hover(function(){
	$(this).addClass('overlord_active');
},function(){
	$(this).removeClass('overlord_active');
});




















