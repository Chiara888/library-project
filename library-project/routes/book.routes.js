const express = require('express');
const router = express.Router();

const Book = require('../models/Book.model');



// GET /books
router.get("/books", (req, res, next) => {
    Book.find()
        .then( (booksFromDB) => {

            const data = {
                books: booksFromDB
            }

            res.render("books/books-list", data);
        })
        .catch( e => {
            console.log("error getting list of books from DB", e);
            next(e);
        });
});



// GET /books/create    (display form)
router.get("/books/create", (req, res, next) => {
    res.render("books/book-create");
});



// POST /books/create   (process form)
router.post("/books/create", (req, res, next) => {

    const newBook = {
        title: req.body.title,
        description: req.body.description,
        author: req.body.author,
        rating: req.body.rating
    };


    Book.create(newBook)
        .then( (newBook) => {
            res.redirect("/books");
        })
        .catch( e => {
            console.log("error creating new book", e);
            next(e);
        });
});

// GET /books/ update
router.get("/books/:bookId/update", (req, res, next) => {
  Book.findById(req.params.bookId)
    .then((bookById) => {
        res.render('books/book-update',{bookId: bookById})
    })
    .catch( e => {
            console.log("error update books from DB", e);
            next(e);
    }); 
});   

// POST /books/ update
router.post("/books/:bookId/update", (req, res, next) => {

    const {bookId} = req.params;
    const {title,description,author,rating} = req.body;

    Book.findByIdAndUpdate(bookId, {title,description,author,rating}, {new: true})
        .then((updatedBook) => {res.redirect(`/books/`)
      })
      .catch( e => {
              console.log("error update books from DB", e);
              next(e)
      }); 
  });   
    

router.post("/books/:bookId/delete", (req,res,next) => {
    const {bookId} = req.params;

    Book.findByIdAndDelete(bookId)
    .then( ()=> res.redirect("/books"))
    .catch( e => {
        console.log("error deleting books from DB", e);
        next(e)
}); 
});


// GET /books/:bookId
router.get("/books/:bookId", (req, res, next) => {
    const id = req.params.bookId;

    Book.findById(id)
        .then( bookFromDB => {
            res.render("books/book-details", bookFromDB);
        })
        .catch( e => {
            console.log("error getting book details from DB", e);
            next(e);
        });
});




module.exports = router;
