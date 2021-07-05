const express = require('express');
const router = express.Router();

const pool = require('../lib/mariadb');
const session = require('../lib/session');

/* Session 연결 */
router.use(session);

/* GET itemlist page. */
router.get('/', async function (req, res) {
    try {
        const conn = await pool.getConnection();
        const itemInfo = await conn.query('select * from Products');
        res.render('./shop/itemlist',{itemInfo});
    } catch (e) {
        console.log(e.message);
    }
});

module.exports = router;