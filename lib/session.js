const bodyParser = require('body-parser');
const session = require('express-session');
const express = require('express');
const router = express.Router();

router.use(
    session({
        secret:"secret",
        resave:true,
        saveUninitialized:true,
    })
)
router.use(bodyParser.json());
module.exports = router;