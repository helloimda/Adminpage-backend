const express = require('express');
const router = express.Router();
const goodsController = require('../controllers/goodsController');

// bo_idx를 기반으로 HM_MEMBER_BOARD_GOOD 테이블에서 데이터를 가져오는 라우트
router.get('/goods/board/:bo_idx/:page', goodsController.getGoodsByBoIdx);
router.get('/bads/board/:bo_idx/:page', goodsController.getBadsByBoIdx);
router.get('/goods/boardcomment/:bo_idx/:cmt_idx/:page', goodsController.getGoodsCommentsByBoIdxCmtIdx);

router.get('/goods/goodgoods/:gd_idx/:page', goodsController.getGoodGoodsByGdIdx);

module.exports = router;
