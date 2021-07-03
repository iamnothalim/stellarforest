const express = require('express');
const router = express.Router();
const pool = require('../lib/mariadb');

/* GET home page. */
router.get('/', async function(req, res) {
  try {
    const conn = await pool.getConnection();
    res.render('index');
  } catch (e) {
    console.log(e.message);
  }
});

module.exports = router;
