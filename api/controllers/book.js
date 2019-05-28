let mongoose = require('mongoose');
let Book = require('../models/book');
const sharp = require('sharp');

var aws = require('aws-sdk');
var s3 = new aws.S3({
    // accessKeyId: process.env.AWS_ACCESS_KEY,
    // secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});
/*
 * GET /book route to retrieve all the books.
 */
function getBooks(req, res) {
    //Query the DB and if no errors, send all the books
    let query = Book.find({});
    query.exec((err, books) => {
        if (err) res.send(err);
        //If no errors, send them back to the client
        res.json(books);
    });
}


/*
 * POST /book to save a new book.
 */
async function postBook(req, res) {
    const file = req.file;
    const params = {
        Bucket: 'aedeon-files-upload',
        Key: `temp/${file.originalname}-${Date.now().toString()}`,
        Body: file.buffer
    };

    const uploadedImage = await s3.upload(params).promise();

    const semiTransparentRedPng = await sharp(file.buffer).resize(50, 50)
        .png()
        .toBuffer();

    const params1 = {
        Bucket: 'aedeon-files-upload',
        Key: `${params.Key}-thumb`,
        Body: semiTransparentRedPng
    };

    const uploadedThumbImage = await s3.upload(params1).promise();

    let bookInfo = req.body;
    bookInfo['image'] = uploadedImage.Location;
    bookInfo['thumb'] = uploadedThumbImage.Location;
    var newBook = new Book(bookInfo);
    newBook.save((err, book) => {
        if (err) {
            res.send(err);
        } else {
            res.json({ message: "Book successfully added!", book });
        }
    });
}

/*
 * GET /book/:id route to retrieve a book given its id.
 */
function getBook(req, res) {
    Book.findById(req.params.id, (err, book) => {
        if (err) res.send(err);
        //If no errors, send it back to the client
        res.json(book);
    });
}

/*
 * DELETE /book/:id to delete a book given its id.
 */
function deleteBook(req, res) {
    Book.remove({ _id: req.params.id }, (err, result) => {
        res.json({ message: "Book successfully deleted!", result });
    });
}

/*
 * PUT /book/:id to updatea a book given its id
 */
function updateBook(req, res) {
    Book.findById({ _id: req.params.id }, (err, book) => {
        if (err) res.send(err);
        Object.assign(book, req.body).save((err, book) => {
            if (err) res.send(err);
            res.json({ message: 'Book updated!', book });
        });
    });
}


function uploadBookImage(req, res) {
    res.send(req.file.location)
}

//export all the functions
module.exports = { getBooks, postBook, getBook, deleteBook, updateBook, uploadBookImage };