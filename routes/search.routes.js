const { Router } = require('express');
const { search } = require('../controller/search.controller');

const router = Router();

router.get('/:colection/:term', search);

module.exports = router;
