const express = require('express');
const router = express.Router();
const session = require('../lib/session');

/* Session 연결 */
router.use(session);

/* GET home page. */
router.get('/', async function(req, res) {
  console.log(req.session);
  try {
    res.render('index');
  } catch (e) {
    console.log(e.message);
  }
});

module.exports = router;
