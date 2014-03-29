var should = chai.should();
var stub = sinon.stub;

describe('unit test', function(){
	beforeEach(function(){
   sinon.stub(nunjucks,"render");
  });
	afterEach(function(){
		nunjucks.render.restore();
	});
	describe('header',function(){
		it('header when login', function(done){
			var user = {
				login:"wang nima"
			};
			var userData = Q(user);
			getUser = stub().returns(userData);
			renderHeader();
			userData.should.be.fulfilled.then(function(){
				nunjucks.render.calledOnce.should.be.true;
				nunjucks.render.getCall(0).args[0].should.be.equal("src/templates/header.html");
				nunjucks.render.getCall(0).args[1].should.be.equal(user);
			}).should.notify(done);
		});
	});

	describe('article',function(){
		it('show all gist', function(done){
			var gists = [{
				html_url:"https://gist.github.com/2171fd506edc072ca80e"
			}];
			var gistsData = Q(gists);
			getGists = stub().returns(gistsData);
			renderGist();
			gistsData.should.be.fulfilled.then(function(){
				nunjucks.render.calledOnce.should.be.true;
				nunjucks.render.getCall(0).args[0].should.be.equal("src/templates/gistlist.html");
				nunjucks.render.getCall(0).args[1].should.be.deep.equal({gists:gists});
			}).should.notify(done);
		});
	});
	
});
	



