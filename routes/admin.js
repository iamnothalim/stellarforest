const express = require('express');
const router = express.Router();
const client = require('../mariadb');
const dotenv = require('dotenv');
const log = console.log();
dotenv.config();

const USER = process.env.RPC_USER;
const PASS = process.env.RPC_PASSWORD;
const PORT = 9612;
const ACCOUNT = "jeje";
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
    client.query('SELECT * FROM stellar.Users WHERE seed >= 5000', (err, data)=>{
        log(data);
        res.render('admin', {
            data : data
        });
    })
});

// router.get('/getaddressesbyaccount', (req,res)=>{
    

// })

// router.post('/generate', async function (req, res) {

// });

module.exports = router;