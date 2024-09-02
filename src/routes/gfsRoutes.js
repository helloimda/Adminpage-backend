const express = require('express');
const router = express.Router();
const gfsController = require('../controllers/gfsController');


router.get('/department/list', gfsController.getDepartmentList);

router.get('/gfslist/:de_idx/:brand_name', gfsController.getGfsList);

module.exports = router;
