const express = require('express');


const router = express.Router();

const UsersController = require('../controllers/usersController');
const usersController = new UsersController();

router.get('/user/', (req, res) => {
  usersController.findAll(res);
});

router.get('/:id', (req, res) => {
  usersController.findById(req, res);
});

router.post('/', (req, res) => {
  usersController.create(req, res);
});

router.put('/:id', (req, res) => {
  usersController.update(req, res);
});

router.delete('/:id', (req, res) => {
  usersController.delete(req, res);
});

module.exports = router;
