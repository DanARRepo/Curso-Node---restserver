const { response } = require('express');
const { Product } = require('../models');

const getProducts = async(req, res = response) => {
    const { limit = 5, from = 0 } = req.query;
    const query = { state: true };

    const [ total, products ] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
            .populate('user', 'name')
            .populate('categorie', 'name')
            .skip(Number(from))
            .limit(Number(limit))
    ]).catch( (err) => {
        console.error(err);
    });

    res.status(200).json({
        total,
        products
    })
}

const getProduct = async(req, res = response) => {
    const { id } = req.params;
    const product = await Product.findById(id)
                                 .populate('user', 'name')
                                 .populate('categorie', 'name');

    res.json( product );
}

const createProduct = async(req, res = response) => {

    const { state, user, ...body } = req.body;
    const productDB = await Product.findOne({ name: body.name });

    if ( productDB ) {
        return res.status(400).json({
            msg: `Product ${ productDB.name }, already exist`
        });
    }

    // Generate data 
    const data = {
        ...body,
        name: body.name.toUpperCase(),
        user: req.user._id
    }

    const product = new Product(data);

    await product.save();

    res.status(201).json(product);

}

const updateProduct = async(req, res = response) => {
    const { id } = req.params;
    const { state, user, ...data } = req.body;

    if (data.name) {
        data.name = data.name.toUpperCase();
    }
    
    data.user = req.user._id;

    const product = await Product.findByIdAndUpdate(id, data, { new: true });

    res.json( product );
}

const deleteProduct = async(req, res = response) => {
    try {
        const { id } = req.params;
    
        const product = await Product.findByIdAndUpdate(id, { state: false });
    
        res.status(202).json(product)
    } catch (error) {
        res.status(400).json({
            msg: 'Something went wrong',
            error
        });
    }
}

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
}