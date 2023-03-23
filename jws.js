const jwt = require('jsonwebtoken');
const { mySecret } = require('./configuration');

const checkAuth = (req, res, next) => {
    try {
        let token = req.headers.authorization.split(" ")[1];
        let base64data = Buffer.from(mySecret).toString('base64');
        let decoded = jwt.verify(token, base64data, {
            algorithms: ["XXXX", "YYYY"]
        });

        req.userData = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
}

const getToken = () => {
    let base64data = Buffer.from(mySecret).toString('base64');
    let payload = {
        data: {
            id: "XXXXXXXXXXXXXXXX",
            name: "YYYYYYYYYYY",
        },
        exp: XXXXXXXXXXX,
    }

    let token = jwt.sign(payload, base64data);
    return `Bearer ${token}`;
}

module.exports = {
    checkAuth,
    getToken,
};
