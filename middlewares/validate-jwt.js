const { request, response } = require("express");
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const validateJWT = async(req = request, res = response, next) => {
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'There is no token in the request'
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETEKEY);

        const user =  await User.findById(uid);

        if ( !user ) {
            return res.status(401).json({
                msg: 'Invalid token - User doesnt exist in DB'
            });
        }

        if ( !user.state ) {
            return res.status(401).json({
                msg: 'Invalid token - User status: false'
            });
        }

        req.user = user;

        next();
    } catch (err) {
        console.log(err);
        res.status(401).json({
            msg: 'Invalid token'
        });
    }
}

module.exports = {
    validateJWT
}