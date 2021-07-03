const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', async function(req, res) {
  try {
    res.render('index');
  } catch (e) {
    console.log(e.message);
  }
});

module.exports = router;
