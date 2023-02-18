export default function handler(req, res) {
    if (req.method === 'POST') {
        const {nameValue, emailValue, passwordValue} = req.body
        res.status(200).json({message: `successfully logged in as ${nameValue}`})
    }
}