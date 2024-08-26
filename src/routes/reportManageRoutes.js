const express = require('express');
const router = express.Router();
const reportManageController = require('../controllers/reportManageController');

// 신고된 게시글 리스트를 페이지네이션으로 불러오는 라우트
router.get('/reports/board/:page', reportManageController.getReports);
router.get('/reports/boardcount', reportManageController.getReportedPostsCount);

router.get('/reports/member/:page', reportManageController.getMemberReports);
router.get('/reports/membercount', reportManageController.getMemberReportsCount);
module.exports = router;
