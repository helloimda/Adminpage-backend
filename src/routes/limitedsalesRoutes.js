const express = require('express');
const router = express.Router();
const limitedSalesController = require('../controllers/limitedSalesController');

// HM_GOODS 테이블에서 페이지네이션된 리스트를 불러오는 라우트
router.get('/limitedsales/:page', limitedSalesController.getLimitedSales);

module.exports = router;
