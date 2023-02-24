import {destroyCookie} from "nookies"

export default function Logout(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({message: 'Method not allowed'});
    }
    destroyCookie({res}, 'auth');
    res.status(200).json({message: 'Logged out successfully'})
}