const express = require('express');
const router = express.Router();

const pool = require('../lib/mariadb');
const session = require('../lib/session');

/* Session 연결 */
router.use(session);

/* GET itemlist page. */
router.get('/', async function (req, res) {
    try {
        const user =req.session.userid
        const conn = await pool.getConnection();
        const itemInfo_zero = await conn.query('select * from Products where category = ?',['zero']);
        const itemInfo_upcycle = await conn.query('select * from Products where category = ?',['upcycle']);
        const itemInfo_bio = await conn.query('select * from Products where category = ?',['bio']);
        conn.release();
        res.render('./shop/itemlist',{itemInfo_zero, itemInfo_upcycle, itemInfo_bio,user});
    } catch (e) {
        console.log(e.message);
    }
});

module.exports = router;
