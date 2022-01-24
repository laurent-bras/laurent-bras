
const jwt = require('jsonwebtoken');
const { mySecret } = require('./configuration');

module.exports.checkAuth = (req, res, next) => {
    try {
        let token = req.headers.authorization.split(" ")[1];
        let base64data = Buffer.from(mySecret).toString('base64');
        let decoded = jwt.verify(token, base64data, {
            algorithms: ["XXXX", "YYYYY"]
        });

        req.userData = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
}

module.exports.getToken = () => {
    let base64data = Buffer.from(mySecret).toString('base64');
    let payload = {
        data: {
            id: "XXXXXXXXXXXXXXXX",
            name: "YYYYYYYYYYY",
        },
        exp: XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX,
    }

    let token = jwt.sign(payload, base64data);
    return 'Bearer ' + token;
}

