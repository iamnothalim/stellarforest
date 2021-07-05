const express = require('express');
const router = express.Router();

const pool = require('../lib/mariadb');
//const log = console.log();

const request =require("request-promise-native");
const dotenv = require('dotenv');
dotenv.config();

const USER = process.env.RPC_USER;
const PASS = process.env.RPC_PASSWORD;
//const PORT = 9708; // hashroot
const PORT = 9612; // jemerald
//const ID_STRING = "hashroot";
//const ACCOUNT = "jeje";
const ID_STRING = "jemerald";
const headers = {
    "content-type": "text/plain;"
};
// const PORT = process.env.RPC_PORT;
// const ACCOUNT = process.env.ACCOUNT;
// const ID_STRING = process.env.ID_STRING;
// const headers = {
//   "content-type" : "text/plain;"
// };

router.get('/', async function (req, res) {
    const conn = await pool.getConnection();
    const seedLimit_data =  await conn.query('SELECT * FROM Users WHERE seed >= 5000');
    //console.log('data', seedLimit_data);
    res.render('admin', {
        data : seedLimit_data,
    });
});

//api : sendfrom jeje JM5h99n4d3ZjFHnwbSHGs8Jho8AzTdqwwH 10
router.get('/:id', async function(req,res){
    try{
        const address = req.params.id;
        const dataString = `{"jsonrpc":"1.0","id":"${ID_STRING}","method":"sendfrom","params":["jeje", "${address}", 10]}`;
        const options = {
            url: `http://${USER}:${PASS}@127.0.0.1:${PORT}/`,
            method: "POST",
            headers: headers,
            body: dataString
        };
        console.log('이 사람 계좌입니다.', address);
        const result = await request(options);
        console.log('result',result)
        const data = await JSON.parse(result);
        console.log('data',data)
        //DB에서 seed -5000
        await console.log('aaaa')
        const conn = await pool.getConnection();
        const current_seed = await conn.query('SELECT seed FROM Users WHERE address = ?', [address]);
        console.log("current_seed",current_seed[0].seed);
        const change_seed = current_seed[0].seed- 5000;
        console.log(change_seed);
        await conn.query('Update Users SET seed = ? WHERE address = ?', [change_seed ,address]);
        res.send(data.result);
    }catch(e){
        console.log(e);
    }
});

// router.get('/generate', async function (req, res) {
//     var account = "JQzeGohZThyw3zXxQsEeGu4kSPPBNperxB";
//     //res.send(`Account : ${account}`);
//     var dataString = `{"jsonrpc":"1.0","id":"${ID_STRING}","method":"generatetoaddress","params":[" 1 ${account}"]}`;
//   var options = {
//     url: `http://${USER}:${PASS}@193.123.240.70:${PORT}/`,
//     method: "POST",
//     headers: headers,
//     body: dataString
//   };

//   callback = (error, response, body) => {
//     if (!error && response.statusCode == 200) {
//       const data = JSON.parse(body);
//       //res.send(data);
//     }
//   };
//   request(options, callback);
// });


// router.get('/getaddressesbyaccount', (req,res)=>{
    

// })


module.exports = router;