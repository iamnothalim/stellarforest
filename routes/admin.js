const express = require('express');
const router = express.Router();
//Maria DB 연동 모듈
const pool = require('../lib/mariadb');
//HashRoot 지갑 연동 모듈
const request =require("request-promise-native");
const dotenv = require('dotenv');
dotenv.config();
//HashRoot 지갑 환경 변수 설정
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
        const user = req.body.user;
        console.log('user', user);
        const coord_x = req.body.coord_x;
        const coord_y = req.body.coord_y;
        for(let i = 0; i < user.length; i++){
            //내가 선택한 유저들에게 지갑 주소로 10 hashroots 전송
            if(typeof(user) == "string"){
                const address = user;
                console.log('address', address);
            }else{
                address = user[i];
                console.log('address', address);
            }
            console.log('지금은 얘한테 보내줄 차례!',address);
            const dataString = `{"jsonrpc":"1.0","id":"${ID_STRING}","method":"sendfrom","params":["jeje", "${address}", 10]}`;
            const options = {
                url: `http://${USER}:${PASS}@127.0.0.1:${PORT}/`,
                method: "POST",
                headers: headers,
                body: dataString
            };
            //결과 넘겨줘서 json 데이터 해석
            const result = await request(options);
            console.log('result', result);
            const data = await JSON.parse(result);

            //5000 seeds 차감
            const conn = await pool.getConnection();
            const current_seed = await conn.query('SELECT seed FROM Users WHERE address = ?', [address]);
            
            console.log('current_seed', current_seed);
            const change_seed = current_seed[0].seed - 5000;
            console.log('change_seed', change_seed);
            await conn.query('Update Users SET seed = ? WHERE address = ?', [change_seed, address]);
            
            //userId, txid, coords 저장
            const whoPlant = await conn.query('SELECT userId FROM Users WHERE address = ?', [address]);
            
            console.log('data', typeof(data.result));
            const time = Date.now();
            console.log(time);
            console.log('시간!', typeof(time));
            console.log('좌표!', typeof(coord_x));
            await conn.query('INSERT INTO TreeInfo(userId, txid, coord_x, coord_y, time) VALUES (?,?,?,?,?)', [whoPlant[0].userId, data.result, coord_x, coord_y, time]);
            
        }
        res.redirect('/admin');
        conn.release();
    }catch(e){
        console.log(e.message);
    }
});

module.exports = router;