process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Book = require('../api/models/book');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();


chai.use(chaiHttp);


describe('Books', () => {
    beforeEach('Remove All Books', (done) => {
        Book.remove({}, () => {
            done();
        });
    });

    describe('/GET books', () => {
        it('it Should get all books', (done) => {
            chai.request(server)
                .get('/book')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                })
        });
    });

    describe('/POST Book', () => {
        it('it Should not accept book without pages', (done) => {
            const book = {
                title: "The Lord of the Rings",
                author: "J.R.R. Tolkien",
                year: 1954
            };
            chai.request(server)
                .post('/book')
                .send(book)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('pages');
                    res.body.errors.pages.should.have.property('kind').eql('required');
                    done();
                });
        });
        it('it should save a book', (done) => {
            const book = {
                title: "The Lord of the Rings",
                author: "J.R.R. Tolkien",
                year: 1954,
                pages: 10
            };
            chai.request(server)
                .post('/book')
                .send(book)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Book successfully added!');
                    res.body.book.should.have.property('title');
                    res.body.book.should.have.property('author');
                    res.body.book.should.have.property('pages');
                    done();
                })
        })
    });

    describe('/GET/:id book', () => {
        it('it should get book by id', (done) => {
            const book = new Book({
                title: "The Lord of the Rings",
                author: "J.R.R. Tolkien",
                year: 1954,
                pages: 10
            });
            book.save((err, book) => {
                chai.request(server)
                    .get(`/book/${book.id}`)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('title');
                        res.body.should.have.property('author');
                        res.body.should.have.property('_id').eql(book.id);
                        done();
                    })

            })
        })
    });

    describe('/PUT/:id book', () => {
        it('it should UPDATE book by id', (done) => {
            let bookDetails = {
                title: "The Lord of the Rings",
                author: "J.R.R. Tolkien",
                year: 1954,
                pages: 10
            };
            const bookToSave = new Book(bookDetails);
            bookToSave.save((err, book) => {
                chai.request(server)
                    .put(`/book/${book.id}`)
                    .send({ ...bookDetails, pages: 20 })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('message').eql('Book updated!');
                        res.body.book.should.have.property('pages').eql(20);
                        done();
                    })
            });
        });
    });



})
