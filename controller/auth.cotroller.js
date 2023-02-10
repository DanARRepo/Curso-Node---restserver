const { response, request, json } = require("express");
const bcryptjs = require('bcryptjs');

const User = require('../models/user');

const { generateJWT } = require("../helpers/generate-jsw");
const { googleVerify } = require("../helpers/google-verify");
const { DefaultTransporter } = require("google-auth-library");

const login = async(req, res = response) => {

    const { email, password } = req.body;

    try {
        // Validate email 
        const user = await User.findOne({ email });
        if ( !user ) {
            return res.status(400).json({
                msg: 'User / Password are not correct - email'
            })
        }

        // Validate user state 
        if ( !user.state ) {
            return res.status(400).json({
                msg: 'User / Password are not correct - state: false'
            });
        }

        // Validate password
        const validPassword = bcryptjs.compareSync( password, user.password );
        if ( !validPassword ) {
            return res.status(400).json({
                msg: 'User / Password are not correct - password'
            });
        }

        // Generate JWT 
        const token = await generateJWT( user.id );

        res.json({
            user,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Something went wrong, call an admin'
        });
    }

};

const googleSignIn = async( req = request, res = response ) => {

    const { id_token } = req.body;

    try {

        const { name, email, img } = await googleVerify( id_token );

        let user = await User.findOne({ email });

        if ( !user ) {
            const data = {
                name,
                email,
                password: 'loquesea',
                img,
                google: true,
            }

            user = new User( data );
            await user.save();
        }

        if ( !user.state ) {
            return res.status(401).json({
                msg: 'Search for an admin, blocked user'
            })
        }

        const token = await generateJWT( user.id );

        res.json({
            user,
            token
        });
    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'Cant verify token',
            error
        })
    }

}

module.exports = {
    login,
    googleSignIn
}