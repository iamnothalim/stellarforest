const mariadb = require('mariadb');
const db = mariadb.createConnection({
    host : '193.123.247.25', 
    port : 3306, 
    user : 'hashroot', 
    password : 'blockchain1!', 
    database : 'stellar',
});
module.exports = db;