const express = require('express');
const router = express.Router();
let multer = require('multer');
var upload = multer({});

const BookController = require('../controllers/book');

router.get('/', BookController.getBooks);

router.post('/sendMail', BookController.sendMail);

// router.post('/', upload.single('bookImage'), BookController.postBook);

router.get('/:id', BookController.getBook);

router.put('/:id', BookController.updateBook);

router.delete('/:id', BookController.deleteBook);


router.post('/uploadImage', upload.single('bookImage'), BookController.uploadBookImage);

module.exports = router;