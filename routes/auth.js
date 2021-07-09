const express = require('express');
const router = express.Router();

const pool = require('../lib/mariadb');
const crypto =require('../lib/crypto');
const session = require('../lib/session');

/* Session 연결 */
router.use(session);

/* Hashroot 연결 */
const request =require("request-promise-native");
const dotenv = require("dotenv");
dotenv.config();

const USER = process.env.RPC_USER;
const PASS = process.env.RPC_PASSWORD;

//const PORT = 9708; // hashroot
//const ID_STRING = "hashroot";
const PORT = 9612; // jemerald
const ID_STRING = "jemerald";
const headers = {
    "content-type": "text/plain;"
};

/* GET login page. */
router.get('/', function (req, res) {
    try {
        res.render('./auth/login');
    } catch (e) {
        console.log(e.message);
    }
});

/* POST login method. */
router.post('/login', async function (req, res) {
    const password = crypto.hashed(req.body.password);
    try {
        const conn = await pool.getConnection();
        const idinfo = await conn.query('select * from Users where userId =?',[req.body.userId]);
        if(idinfo[0]==undefined){
            conn.release();
            res.send('<script>alert("존재하지 않은 아이디입니다.");history.back();</script>');
        }else{
            if(idinfo[0].password !== password){
                conn.release();
                res.send('<script>alert("비밀번호가 틀렸습니다.");history.back();</script>');
            }else{
                req.session.loggedin = true;
                req.session.userid = req.body.userId;
                req.session.save(()=>{
                    conn.release();
                    res.redirect('/')
                })
            }
        }
    } catch (e) {
        console.log(e.message);
    }
});

/* GET register page. */
router.get('/register', function (req, res) {
    try {
        res.render('./auth/register');
    } catch (e) {
        console.log(e.message);
    }
});
router.get('/register_complete', function (req, res) {
    try {
        res.render('./auth/register_complete');
    } catch (e) {
        console.log(e.message);
    }
});

/* POST register method. */
router.post('/register',async function(req,res){
    //console.log(req.body);
    const password = crypto.hashed(req.body.password);
    
    const account =req.body.userId;
    const dataString = `{"jsonrpc":"1.0","id":"${ID_STRING}","method":"getnewaddress","params":["${account}"]}`;
    const options = {
        url: `http://${USER}:${PASS}@127.0.0.1:${PORT}/`,
        method: "POST",
        headers: headers,
        body: dataString
    };
    
    try {
        const result = await request(options);
        const data = await JSON.parse(result);
        const address = await data.result;
        const conn = await pool.getConnection();
        conn.query('insert into Users (userId,password,name,address) values (?,?,?,?)',[req.body.userId, password, req.body.name, address]);
        conn.release();
        res.send('<script>alert("회원가입이 완료되었습니다!");location.href="/auth/register_complete";</script>');
    } catch (e) {
        console.log(e.message);
    }
});

module.exports = router;