const express = require('express');

const router = express.Router();

const BooksController = require('../controllers/booksController');
const booksController = new BooksController();

router.get('/:book_id', (req, res) => {
    booksController.findById(req, res);
});

router.post('/', (req, res) => {
    booksController.create(req, res);
});

router.put('/:book_id', (req, res) => {
    booksController.update(req, res);
});

router.delete('/:book_id', (req, res) => {
    booksController.delete(req, res);
});

router.post('/give/:book_id', (req, res) => {
    booksController.giveBookAway(req, res);
});

router.post('/return/:book_id', (req,res) => {
    booksController.returnBook(req, res);
});

module.exports = router;
