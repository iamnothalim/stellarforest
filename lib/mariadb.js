const mariadb = require("mariadb");
const pool = mariadb.createPool({
    host:'193.123.247.25',
    port:3306,
    user:'hashroot',
    password:'blockchain1!',
    database:'stellar',
});
module.exports = pool;