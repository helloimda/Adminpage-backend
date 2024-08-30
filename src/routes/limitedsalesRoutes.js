const express = require('express');
const router = express.Router();
const limitedSalesController = require('../controllers/limitedSalesController');

// HM_GOODS 테이블에서 페이지네이션된 리스트를 불러오는 라우트
router.get('/limitedsales/list/:page', limitedSalesController.getLimitedSales);
router.get('/limitedsales/category/:brand/:type/:page', limitedSalesController.getLimitedSalesByCategory);
router.get('/limitedsales/listcategory', limitedSalesController.getBrandListByBtype);
router.post('/limitedsales/post/delete/:gd_idx', limitedSalesController.deleteLimitedSale);
router.post('/limitedsales/post/search/goods/:gd_name/:page', limitedSalesController.searchGoodsByName);
router.post('/limitedsales/post/search/member/:mem_id/:page', limitedSalesController.searchGoodsByMember);

router.get('/limitedsales/post/detail/:gd_idx', limitedSalesController.getGoodsDetail);


module.exports = router;
