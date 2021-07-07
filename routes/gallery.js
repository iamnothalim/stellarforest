const express = require('express');
const router = express.Router();

const pool = require('../lib/mariadb');

/* GET home page. */
router.get('/', async function (req, res) {
    try {
        const conn = await pool.getConnection();
        const topTenUserIds = await conn.query('select userid, tree from Users order by tree desc limit 10');
        conn.release();
        res.render('gallery',{topTenUserIds});
    } catch (e) {
        console.log(e.message);
    }
});

module.exports = router;