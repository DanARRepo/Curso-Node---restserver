const { response } = require("express");
const { ObjectId } = require('mongoose').Types;

const { Categorie, Product, User } = require('../models')

const allowedColections = [
    'users',
    'categories',
    'products',
    'roles'
];

const searchUsers = async( term = '', res = response ) => {
    const isMongoID = ObjectId.isValid(term);

    if ( isMongoID ) {
        const user = await User.findById(term);
        res.json({
            results: ( user ) ? [ user ] : []
        });
    }

    const regex = RegExp(term, 'i');

    const users = await User.find({
        $or: [{ name: regex }, { email: regex }],
        $and: [{ state: true }]
    });

    res.json({
        results: users
    });

}
const searchProducts = async( term = '', res = response ) => {
    const isMongoID = ObjectId.isValid(term);

    if ( isMongoID ) {
        const product = await Product.findById(term).populate('categorie', 'name');
        res.json({
            results: ( product ) ? [ product ] : []
        });
    }

    const regex = RegExp(term, 'i');

    const products = await Product.find({ name: regex, state: true }).populate('categorie', 'name');

    res.json({
        results: products
    });

}

const searchCategories = async( term = '', res = response ) => {
    const isMongoID = ObjectId.isValid(term);

    if ( isMongoID ) {
        const categorie = await Categorie.findById(term);
        res.json({
            results: ( categorie ) ? [ categorie ] : []
        });
    }

    const regex = RegExp(term, 'i');

    const categories = await Categorie.find({ name: regex, state: true });

    res.json({
        results: categories
    });

}



const search = (req, res = response) => {

    const { colection, term } = req.params;

    if ( !allowedColections.includes(colection) ) {
        return res.status(400).json({
            msg: `this are the allowed colections: ${allowedColections}`
        })
    }

    switch (colection) {
        case 'users':
            searchUsers(term, res);
            break;

        case 'categories':
            searchCategories(term, res);
            break;

        case 'products':
            searchProducts(term, res);
            break;

        default:
            res.status(500).json({
                msg: 'this colection doesnt exist'
            })
    }
}

module.exports = {
    search
}