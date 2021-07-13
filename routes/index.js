const express = require('express');
const router = express.Router();
const session = require('../lib/session');
const request = require("request-promise-native");
const pool = require('../lib/mariadb');
router.use(session);

/* Session 연결 */


/* GET home page. */
router.get('/', async function(req, res) {
  console.log(req.session);
  try {
    const user =req.session.userid
    res.render('index',{user});
  } catch (e) {
    console.log(e.message);
  }
});

module.exports = router;
