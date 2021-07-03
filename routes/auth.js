const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', async function (req, res) {
    try {
        res.render('login');
    } catch (e) {
        console.log(e.message);
    }
});

router.post('/register', async function (req, res) {
    try {
        res.render('login');
    } catch (e) {
        console.log(e.message);
    }
});


module.exports = router;