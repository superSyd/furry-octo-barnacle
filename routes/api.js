/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const mongoose = require('mongoose')
const myDB = process.env['DB']

mongoose.connect(myDB, {
  useNewURLParser: true, 
  useUnifiedTopology: true
});

if(!mongoose.connection.readyState){
  console.log("database error")
}

module.exports = function (app) {

  const bookSchema = new mongoose.Schema({
    book_title: {
      type: String,
      required: true
      },
    book_comments: {
      type: Array
      }
    
  })

  let Book = mongoose.model("book", bookSchema); 

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]

      Book.find((err, books) => {
        if(err || books == null || books == ""){
          return res.json({
            "error": err
          })
        }

        var bookList = []

        bookList = books.map(item => {
          var bookObject = {
            "_id":item._id, 
            "title": item.book_title,
            "commentcount": item.book_comments.length
            }
          return bookObject
        })

        return res.send(bookList)
      })


    })
    
    .post(function (req, res){
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if(title){

        const myBook = new Book({
        book_title: title,
        book_comments: ""
        });

        myBook.save((err,book)=>{
          if(err){
            return res.json({
              "error": err
            })
          }

          return res.json({
            "_id": book._id,
            "title": book.book_title
          })

        })

      } else {
        return res.send("missing required field title")
      }

    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'

      Book.deleteMany((err,data)=>{
        if(err){
          return res.json({
            "error": err
          })
        }

        return res.send("complete delete successful")
      })

    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      console.log(bookid)
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}

      if(bookid){
        Book.find({_id: bookid},(err,book)=>{
          
          if(err || book == "" || book == null){
            return res.send(
              "no book exists"
            )
          }

          return res.json({
            "_id": book[0]._id,
            "title": book[0].book_title,
            "comments": book[0].book_comments
          })
        })
      } else {
        return res.json({
          "error": "please enter book id"
        })
      }
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      if(bookid){
        if(!comment){
          return res.send("missing required field comment")

        } else {

          Book.findById(bookid,(err,book)=>{

          if(err || book == null || book == ""){
            return res.send("no book exists")
          }

          if(book){
            if(book.book_comments == ""){
              book.book_comments = comment
            } else {
              book.book_comments.push(comment)

            }
              

              book.save((err,book)=>{
                if(err){
                  return res.json({
                    "error":err
                  })
                }

                return res.json({
                  "_id": book._id,
                  "title": book.book_title,
                  "comments": book.book_comments
                })

              })
              
            
          }

        })

        }

        

      } else {
        return res.send("Please enter book id")
      }
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'

      if(bookid){
        Book.findByIdAndRemove(bookid, (err,book)=>{
          if(err || book == null || book == ""){
            return res.send("no book exists")

          }

          return res.send("delete successful")

        })
        

      }else {
        return res.send("Please enter book id")
      }
    });
  
};
