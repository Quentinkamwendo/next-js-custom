import mysql from "mysql2"
import bcrypt from "bcrypt"

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1999NO1q',
    database: 'projects'
})

export default Login = (req, res) => {
    if (req.method === 'POST') {
        const {email, password} = req.body;
        connection.query(`SELECT * FROM users WHERE email = ?`, [email],
            (error, results) => {
            if (error) {
                console.log(error);
                res.status(500).json({message: 'internal server error'});
            } else if (results.length === 0) {
                res.status(401).json({message: 'Invalid email or password'});
            } else {
                const user = results[0];
                bcrypt.compare(password, user.password, (error, result) => {
                    if (error) {
                        console.log(error);
                        res.status(500).json({message:  'Internal server error'});
                    } else if (!result) {
                        res.status(401).json({message: 'Invalid email or password'})
                    } else {
                        res.status(200).json({message: 'Login successful'});
                    }
                });
            }
        });
    } else {
        res.status(405).json({message: 'Method not allowed'});
    }
}