const express = require('express');


const router = express.Router();

router.use((req, res, next) => {
  console.log(`${req.url} [${req.method}] : ${JSON.stringify(req.body)}`);

  next();
});


router.use('/user', require('./usersRouter'));
router.use('/book', require('./booksRouter'));

module.exports = router;
