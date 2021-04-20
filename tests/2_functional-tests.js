/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  *
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        console.log(res.body)
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {

    var myBookID, myBookTitle;


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        
          chai.request(server)
          .post('/api/books')
          .send({
            title: "My Book"
            })
          .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.title, 'My Book');

          myBookId = res.body._id;
          myBookTitle = "My Book";
          done();
          });
      });
      
      test('Test POST /api/books with no title given', function(done) {
          chai.request(server)
          .post('/api/books')
          .send({})
          .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'missing required field title');
          done();
          });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
        .get('/api/books')
        .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(JSON.parse(res.text), 'response should be an array');
        done();
        });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
        .get('/api/books/1234567890')
        .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.text, "no book exists");
        done();
        });
        //done();
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
        .get('/api/books/'+myBookId)
        .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body._id, myBookId);
        assert.equal(res.body.title, myBookTitle);
        assert.isArray(res.body.comments);


        done();
        });
        //done();
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
        .post('/api/books/'+myBookId)
        .send({comment: "The best book"})
        .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body._id, myBookId);
        assert.equal(res.body.title, myBookTitle);
        assert.isArray(res.body.comments);


        done();
        });
        //done();
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai.request(server)
        .post('/api/books/'+myBookId)
        .send({})
        .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.text, "missing required field comment");

        done();
        });
        //done();
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai.request(server)
        .post('/api/books/098765432')
        .send({comment: "The better book"})
        .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.text, "no book exists");

        done();
        });
        //done();
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai.request(server)
        .delete('/api/books/'+myBookId)
        .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.text, "delete successful");

        done();
        });
        //done();
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai.request(server)
        .delete('/api/books/000000999998888')
        .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.text, "no book exists");

        done();
        });
        //done();
      });

    });

  });

});
