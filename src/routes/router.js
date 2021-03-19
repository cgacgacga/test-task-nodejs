const express = require('express');


const router = express.Router();

router.use((req, res, next) => {
  console.log(`${req.url} [${req.method}] : ${JSON.stringify(req.body)}`);

  next();
});


router.use('/users', require('./usersRouter'));

module.exports = router;
