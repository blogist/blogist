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
					this.local.resolve(fakeData);
				}
			});
			var fakeModel = new FakeModel("kong","get@liansun");
			BlogDetailView.prototype.model = fakeModel;
			fakeModel.local.promise.should.be.fulfilled.then(function(){
				nunjucks.render.called.should.be.true;
				nunjucks.render.getCall(0).args[0].should.be.equal("src/templates/article.html");
				nunjucks.render.getCall(0).args[1].should.be.deep.equal({data:fakeData});
			}).should.notify(done);
			var blogdetailView = new BlogDetailView();
			blogdetailView.render();
		});
	});

	xdescribe('blog list view',function(){
		fakeData = {results:"wang dachui"};
		it('render sucessfully', function(done){
			var FakeModel = Model.extend({
				fetch:function(){
					this.local.resolve(fakeData);
				}
			});
			var fakeModel = new FakeModel("kong","get@liansun");
			BloglistView.prototype.model = fakeModel;
			
			fakeModel.local.promise.should.be.fulfilled.then(function(){
				nunjucks.render.called.should.be.true;
				nunjucks.render.getCall(0).args[0].should.be.equal("src/templates/gistlist.html");
			}).should.notify(done);
			var bloglistView = new BloglistView();
			bloglistView.render();
		});
	});
	
});










