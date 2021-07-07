const express = require('express');
const router = express.Router();
//Maria DB 연동 모듈
const pool = require('../lib/mariadb');
//HashRoot 지갑 연동 모듈
const request =require("request-promise-native");
const dotenv = require('dotenv');
dotenv.config();
//
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

/*
>>>관리자 계정 기능 프로세스
1. 웹 브라우저 DOM에서 지도 클릭 -> 나무 x, y 좌표 전달
2. seed 5000 이상 회원 체크리스트 출력
3. 같은 나무의 hashroot를 전달할 회원을 선택한 후
4. 제출 버튼을 누르면 회원 지갑으로 5000 seeds 차감 및 10 hashroots 보내기
5. DB에는 sendfrom return 값인 txid와 나무 위치 coord_x, coord_y, timestamp, userId 가 저장된다. 
*/

router.get('/', async function (req, res) {
    const conn = await pool.getConnection();
    const seedLimit_data =  await conn.query('SELECT * FROM Users WHERE seed >= 5000');
    //console.log('data', seedLimit_data);
    conn.release();
    res.render('admin', {
        data : seedLimit_data,
    });
});

//api : sendfrom jeje JM5h99n4d3ZjFHnwbSHGs8Jho8AzTdqwwH 10
router.post('/', async function(req,res){
    try{
        //변수 정의하기
        console.log('지금 이 데이터가 들어온다!', req.body.user);
        const user = req.body.user;
        console.log(user.length);
        let address;
        let dataString;
        let options;
        let result;
        let data;
        for(let i = 0; i < user.length; i++){
            address = user[i];
            dataString = `{"jsonrpc":"1.0","id":"${ID_STRING}","method":"sendfrom","params":["jeje", "${address}", 10]}`;
            options = {
                url: `http://${USER}:${PASS}@127.0.0.1:${PORT}/`,
                method: "POST",
                headers: headers,
                body: dataString
            };
        result = await request(options);
        data = await JSON.parse(result);
        }
        //console.log('이 사람 아이디입니다.', userId);
        //console.log('이 사람 계좌입니다.', address);
        //지갑 연동
        // const dataString = `{"jsonrpc":"1.0","id":"${ID_STRING}","method":"sendfrom","params":["jeje", "${address}", 10]}`;
        // const options = {
        //     url: `http://${USER}:${PASS}@127.0.0.1:${PORT}/`,
        //     method: "POST",
        //     headers: headers,
        //     body: dataString
        // };
        // //지갑 콘솔 찍고 데이터 넘겨주기
        // const result = await request(options);
        // const data = await JSON.parse(result);
        // //5000 seeds 차감 
        // const conn = await pool.getConnection();
        // const current_seed = await conn.query('SELECT seed FROM Users WHERE address = ?', [address]);
        // console.log('current_seed', current_seed);
        // const change_seed = current_seed[0].seed - 5000;
        // console.log('change_seed', change_seed);
        // await conn.query('Update Users SET seed = ? WHERE address = ?', [change_seed, address]);
        // //userId 추가
        // const whoPlant = await conn.query('SELECT userId FROM Users WHERE address = ?', [address]);
        // await conn.query('INSERT INTO TreeInfo(txid, userId) VALUES (?, ?)', [data.result, whoPlant[0].userId]);
        // conn.release();
        // res.redirect('/admin');
    }catch(e){
        console.log(e.message);
    }
});

// router.get('/:id', async function(req,res){
//     try{
//         const dataString = `{"jsonrpc":"1.0","id":"${ID_STRING}","method":"sendfrom","params":["jeje", "${address}", 10]}`;
//         const options = {
//             url: `http://${USER}:${PASS}@127.0.0.1:${PORT}/`,
//             method: "POST",
//             headers: headers,
//             body: dataString
//         };
//         console.log('이 사람 계좌입니다.', address);
//         const result = await request(options);
//         const data = await JSON.parse(result);
//         DB에서 seed-5000
//         const conn = await pool.getConnection();
//         const current_seed = await conn.query('SELECT seed FROM Users WHERE address = ?', [address]);
//         console.log("current_seed",current_seed[0].seed);
//         const change_seed = current_seed[0].seed- 5000;
//         console.log(change_seed);
//         await conn.query('Update Users SET seed = ? WHERE address = ?', [change_seed ,address]);
//         const whoPlant = await conn.query('SELECT userId FROM Users WHERE address = ?', [address]);
//         await conn.query('INSERT INTO TreeInfo(txid, userId) VALUES (?, ?)', [data.result, whoPlant[0].userId]);
//         conn.release();
//         res.redirect('/admin');
//     }catch(e){
//         console.log(e);
//     }
// });

// router.post('/coord', async function (req,res){
//     console.log('ajax 호출');
//     console.log(req.body);
//     const coord_x = req.body.xposition;
//     const coord_y = req.body.yposition;
//     console.log('coord_x', coord_x, 'coord_y', coord_y);
//     const conn = await pool.getConnection();
//     await conn.query('INSERT INTO TreeInfo(coord_x, coord_y) VALUES (?, ?)', [coord_x, coord_y]);
//     res.redirect('/map');
// });

module.exports = router;