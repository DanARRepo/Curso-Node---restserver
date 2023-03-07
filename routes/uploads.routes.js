const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields, validateUploadFile } = require('../middlewares');
const { uploadFile, updateFile, showImage, updateFileCloudinary } = require('../controller/uploads.controller');
const { allowedColections } = require('../helpers');


const router = Router();

router.post('/', validateUploadFile, uploadFile);

router.put('/:colection/:id', [
    validateUploadFile,
    check('id', 'Must be a valid Mongo ID').isMongoId(),
    check('colection').custom( c => allowedColections( c, ['users', 'products'])),
    validateFields
], updateFileCloudinary );

router.get('/:colection/:id', [
    check('id', 'Must be a valid Mongo ID').isMongoId(),
    check('colection').custom( c => allowedColections( c, ['users', 'products'])),
    validateFields
], showImage);

module.exports = router;