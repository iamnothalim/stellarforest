const express = require('express');
const router = express.Router();
var request = require("request");

const USER = process.env.RPC_USER;
const PASS = process.env.RPC_PASSWORD;


// rpcport=9708
const PORT = 9708;
const ACCOUNT = "hashroot";
const ID_STRING = "hashroot";

/* GET home page. */
router.get('/', async function (req, res) {
    try {
        res.render('myforestmain');
    } catch (e) {
        console.log(e.message);
    }
});

router.get('/mytree', async function (req, res) {
    try {
            // res.send(`Account : ${account}`); 193.123.247.25:9708
            var dataString = `{"jsonrpc":"1.0","id":"${ID_STRING}","method":"getblockcount","params":[]}`;
            var options = {
              url: `http://${USER}:${PASS}@193.123.247.25:${PORT}/`,
              method: "POST",
              body: dataString
            };
            callback = (error, response, body) => {
                if (!error && response.statusCode == 200) {
                  const data = body;
                //   res.send(data);
                  res.render('mytree',
                  {data});
                }
              };
              request(options, callback);
    } catch (e) {
        console.log(e.message);
    }
});

router.get('/myinfo', async function (req, res) {
    try {
        res.render('myinfo');
    } catch (e) {
        console.log(e.message);
    }
});


/////////////////블록 ////////////////////

// router.get('/getblockcount', function (req, res) {  
//     res.render('getblockcount');
//   });
  
//   router.post('/getblockcount_result', (req, res) => {
//     // res.send(`Account : ${account}`); 193.123.247.25:9708
//     var dataString = `{"jsonrpc":"1.0","id":"${ID_STRING}","method":"getblockcount","params":[]}`;
//     var options = {
//       url: `http://${USER}:${PASS}@193.123.247.25:${PORT}/`,
//       method: "POST",
//       body: dataString
//     };
//     callback = (error, response, body) => {
//         if (!error && response.statusCode == 200) {
//           const data = JSON.parse(body);
//           res.send(data);
//         }
//       };
//       request(options, callback);
//     });

module.exports = router;