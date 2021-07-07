const express = require("express");
const router = express.Router();
const request = require("request-promise-native");
const session = require('../lib/session');
const pool = require('../lib/mariadb');
router.use(session);

const USER = process.env.RPC_USER;
const PASS = process.env.RPC_PASSWORD;

// rpcport=9708
// const PORT = 9708;
// const ACCOUNT = "hashroot";
// const ID_STRING = "hashroot";
const PORT = 9612;
const ID_STRING = "jemerald";

//////////////////////포레스트메인///////////////////////
router.get("/", async function (req, res) {
  try {
    const user =req.session.userid
   const conn = await pool.getConnection();
  const myseed = await conn.query('select seed from Users where userId= ? ',[user] ) 
  console.log(myseed)
  const seed = myseed[0].seed;
  conn.release();
  res.render("myforestmain",{user, seed});
  } catch (e) {
    console.log(e.message);
  }
});

///////////////////////내나무/////////////////////////////////////////
router.get("/mytree", async function (req, res) {
  try {
    //전체블록갯수
    var dataString = `{"jsonrpc":"1.0","id":"${ID_STRING}","method":"getblockcount","params":[]}`;
    var options = {
      url: `http://${USER}:${PASS}@127.0.0.1:${PORT}/`,
      method: "POST",
      body: dataString,
    };
    const result = await request(options);
    console.log("블록카운트",result)
    const data = await JSON.parse(result);
    const blockcount = await data.result;
    ///////////////////////////////////////////////
    
    const user =req.session.userid
    var dataString2 = `{"jsonrpc":"1.0","id":"${ID_STRING}","method":"listtransactions","params":["${user}"]}`;
    var options2 = {
      url: `http://${USER}:${PASS}@127.0.0.1:${PORT}/`,
      method: "POST",
      body: dataString2,
    };
    const result2 = await request(options2);
    console.log("리스트트랜잭션2",result2);
    const data2 = await JSON.parse(result2);
    console.log(data2.result.length);
    //////////내나무 갯수
    const myblock = data2.result.length;
       //////////내나무 블록해시값
    const mytransaction = data2.result;
    console.log("배열길이",myblock);

      /////////////////////////////////////////////
    res.render("mytree", { blockcount, myblock, mytransaction });

  } catch (e) {
    console.log(e.message);
  }
});


////////////////////내정보///////////////////////////////
router.get("/myinfo", async function (req, res) {
  try {
    const user =req.session.userid
   const conn = await pool.getConnection();
  const userinfo = await conn.query('select name, seed, address from Users where userId= ?',[user] ) 
  console.log(userinfo)

  const seed = userinfo[0].seed;
  const name = userinfo[0].name;
  const address = userinfo[0].address

  conn.release();
  res.render("myinfo",{user, seed,name, address});
  } catch (e) {
    console.log(e.message);
  }
});


module.exports = router;
