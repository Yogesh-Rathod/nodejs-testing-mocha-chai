const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

var aws = require('aws-sdk');
let multer = require('multer');
let multerS3 = require('multer-s3');
var s3 = new aws.S3({
    // accessKeyId: process.env.AWS_ACCESS_KEY,
    // secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

var upload = multer({
    // storage: multerS3({
    //     s3: s3,
    //     bucket: 'aedeon-files-upload/temp',
    //     metadata: function (req, file, cb) {
    //         cb(null, { fieldName: file.fieldname });
    //     },
    //     key: function (req, file, cb) {
    //         cb(null, file.originalname + '-' + Date.now().toString())
    //     }
    // })
});

const BookController = require('../controllers/book');

router.get('/', BookController.getBooks);

router.post('/', upload.single('bookImage'), BookController.postBook);

router.get('/:id', BookController.getBook);

router.put('/:id', BookController.updateBook);

router.delete('/:id', BookController.deleteBook);


router.post('/uploadImage', upload.single('bookImage'), BookController.uploadBookImage);

module.exports = router;