import mysql from "mysql2";

const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1999NO1q',
    database: 'projects'
});

export default connection;