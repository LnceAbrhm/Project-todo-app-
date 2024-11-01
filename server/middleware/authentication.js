
const jwt = require('jsonwebtoken');

exports.authentication = (req, res, next) =>{
    const token = req.cookies.token;
    try {
        const verify = jwt.verify(token, 'secretkey');
        next(); 
    } catch (error) {
        res.clearCookie('id');
        res.clearCookie('token');
        return res.json({path: '/'});
    }    
}

