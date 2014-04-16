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

var bloglist = new BloglistView();

var router = new Router();
router.get("/", function(){
	bloglist.render();
});

var blogDetailOf = function(gistid){
	return new BlogDetailView({model:new blogdetailModel(gistid,'get@https://gist.github.com/'+username+'/'+ gistid +".json")}).render({disqus_name:$('meta[name=disqus_name]').attr('content')});
};

router.get("/gist/:gistid/?",function(params,data){
	blogDetailOf(params.gistid);
});

router.get("/gist/:gistid/.+",function(params,data){
	blogDetailOf(params.gistid);
});
