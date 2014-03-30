
var username = $("meta[name=username]").attr("content");

var bloglistModel = new Model("bloglist","get@https://api.github.com/users/jcouyang/gists");

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
	console.log("homepage");
	bloglist.render();
});

router.get("/gist/:gistid/?",function(params,data){
	new BlogDetailView({model:new blogdetailModel("blogdetail",'get@https://gist.github.com/'+username+'/'+ params.gistid +".json")}).render();
});

router.get("/gist/:gistid/.+",function(params,data){
	new BlogDetailView({model:new blogdetailModel(params.gistid,'get@https://gist.github.com/'+username+'/'+ params.gistid +".json")}).render();
});
