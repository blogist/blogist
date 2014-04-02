var should = chai.should();
var stub = sinon.stub;
var spy = sinon.spy;

describe('view test', function(){
	var fakeData = {description:"wang dachui"};
	beforeEach(function(){
		sinon.stub(nunjucks,"render");
  });
	afterEach(function(){
		nunjucks.render.restore();
	});
	describe('blog detail view',function(){
		it('render sucessfully', function(done){
			var FakeModel = Model.extend({
				fetch:function(){
					this.data.resolve(fakeData);
				}
			});
			var fakeModel = new FakeModel("kong","get@liansun");
			new BlogDetailView({model:fakeModel}).render();
			fakeModel.data.promise.should.be.fulfilled.then(function(){
				nunjucks.render.called.should.be.true;
				nunjucks.render.getCall(0).args[0].should.be.equal("src/templates/article.html");
				nunjucks.render.getCall(0).args[1].should.be.deep.equal({data:fakeData});
			}).should.notify(done);
		});
		it('render empty page', function(done){
			var FakeModel = Model.extend({
				fetch:function(){
					this.data.reject();
				}
			});
			var fakeModel = new FakeModel("kong","get@liansun");
			new BlogDetailView({model:fakeModel}).render();
			fakeModel.data.promise.should.be.rejected.then(function(){
				nunjucks.render.called.should.be.true;
				nunjucks.render.getCall(0).args[0].should.be.equal("src/templates/article.html");
				should.not.exist(nunjucks.render.getCall(0).args[1]);
			}).should.notify(done);
		});
	});

	describe('blog list view',function(){
		it('render sucessfully', function(done){
			var FakeModel = Model.extend({
				fetch:function(){
					this.data.resolve(fakeData);
				}
			});
			var fakeModel = new FakeModel("kong","get@liansun");
			new BloglistView({model:fakeModel}).render();
			fakeModel.data.promise.should.be.fulfilled.then(function(){
				nunjucks.render.called.should.be.true;
				nunjucks.render.getCall(0).args[0].should.be.equal("src/templates/gistlist.html");
				nunjucks.render.getCall(0).args[1].should.be.deep.equal({data:fakeData});
			}).should.notify(done);
		});
	});

	describe("router get gist id", function(done){
		it("render detail view", function(){
			blogDetailOf = done;
			window.location.hash = "/gist/111222";
		});
		it("render list view", function(){
			bloglist = done;
			window.location.hash = "/";
		});
	});

	
});




