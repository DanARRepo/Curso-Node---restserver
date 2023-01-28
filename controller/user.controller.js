const { response } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user');

const userGet = async( req, res = response ) => {
    const { limit = 5, from = 0 } = req.query;
    const query = { state: true };
    
    const [ total, users ] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
            .limit(Number(limit))
            .skip(Number(from))
    ]).catch( () => {
        console.log('Promise rejected');
    });

    res.json({
        total,
        users
    });
}

const userPost = async(req, res = response) => {
    const { name, email, password, role } = req.body;
    const user = new User({ name, email, password, role });
    
    // Encriptar pass
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync( password, salt );

    // Guardar en BD
    await user.save();

    res.json({
        user
    });
}

const userPut = async(req, res = response) => {
    const { id } = req.params;
    const { _id, password, google, ...all } = req.body;

    if ( password ) {
        const salt = bcryptjs.genSaltSync();
        all.password = bcryptjs.hashSync( password, salt );
    }

    const userDB = await User.findByIdAndUpdate( id, all );

    res.json( userDB );
}

const userPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - Controller'
    });
}

const userDelete = async(req, res = response) => {
    const { id } = req.params;

    // Para borrarlo fisicamente 
    // const user = await User.findByIdAndDelete(id);

    const user = await User.findByIdAndUpdate( id, { state: false } );

    res.json({
        user
    });
}

module.exports = {
    userGet,
    userPost,
    userPut,
    userPatch,
    userDelete
}