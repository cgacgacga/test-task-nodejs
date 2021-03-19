const express = require('express');

const router = express.Router();

const BooksController = require('../controllers/booksController');
const booksController = new BooksController();

router.get('/:id', (req, res) => {
    booksController.findById(req, res);
});

router.post('/', (req, res) => {
    booksController.create(req, res);
});

router.put('/:id', (req, res) => {
    booksController.update(req, res);
});

router.delete('/:id', (req, res) => {
    booksController.delete(req, res);
});

module.exports = router;
