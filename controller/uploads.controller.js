const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config( process.env.CLOUDINARY_URL );

const { response } = require("express");
const { uploadFl } = require("../helpers");
const { User, Product } = require('../models')

const uploadFile = async(req, res = response) => {
    try {
        const fileName = await uploadFl( req.files, undefined, 'imgs' );
        res.json({
            fileName
        });
    } catch (msg) {
        res.status(400).json({ msg });
    }
}

const updateFile = async(req, res = response) => {
    const { id, colection } = req.params;

    let model;

    switch ( colection ) {
        case 'users':
            model = await User.findById(id);
            if ( !model ) {
                return res.status(400).json({
                    msg: `User ${id} doesnt exist`
                });
            }
            break;

        case 'products':
            model = await Product.findById(id);
            if ( !model ) {
                return res.status(400).json({
                    msg: `Product ${id} doesnt exist`
                });
            } 
            break;
    
        default:
            return res.status(500).json({ msg: 'this is not yet validated'})
    }

    // clean preview images 
    if ( model.img ) {
        const pathImg = path.join( __dirname, '../uploads', colection, model.img );
        if ( fs.existsSync(pathImg) ) {
            fs.unlinkSync(pathImg);
        }
    }
    
    const fileName = await uploadFl( req.files, undefined, colection );
    model.img = fileName

    await model.save();

    res.json( model );
}

const updateFileCloudinary = async(req, res = response) => {
    const { id, colection } = req.params;

    let model;

    switch ( colection ) {
        case 'users':
            model = await User.findById(id);
            if ( !model ) {
                return res.status(400).json({
                    msg: `User ${id} doesnt exist`
                });
            }
            break;

        case 'products':
            model = await Product.findById(id);
            if ( !model ) {
                return res.status(400).json({
                    msg: `Product ${id} doesnt exist`
                });
            } 
            break;
    
        default:
            return res.status(500).json({ msg: 'this is not yet validated'})
    }

    // clean preview images 
    if ( model.img ) {
        const nameArr = model.img.split('/');
        const name = nameArr[nameArr.length -1];
        const [ public_id ] = name.split('.');

        cloudinary.uploader.destroy(public_id);
    }

    const { tempFilePath } = req.files.file;
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
    
    model.img = secure_url

    await model.save();

    res.json( model );
}

const showImage = async(req, res = response) => {
    const { id, colection } = req.params;

    let model;

    switch ( colection ) {
        case 'users':
            model = await User.findById(id);
            if ( !model ) {
                return res.status(400).json({
                    msg: `User ${id} doesnt exist`
                });
            }
            break;

        case 'products':
            model = await Product.findById(id);
            if ( !model ) {
                return res.status(400).json({
                    msg: `Product ${id} doesnt exist`
                });
            } 
            break;
    
        default:
            return res.status(500).json({ msg: 'this is not yet validated'})
    }

    // clean preview images 
    if ( model.img ) {
        const pathImg = path.join( __dirname, '../uploads', colection, model.img );
        if ( fs.existsSync(pathImg) ) {
            return res.sendFile(pathImg);
        }
    }

    const noImg = path.join( __dirname, '../assets/no-image.jpg' );
    return res.sendFile(noImg)

}

module.exports = {
    uploadFile,
    updateFile,
    showImage,
    updateFileCloudinary
}