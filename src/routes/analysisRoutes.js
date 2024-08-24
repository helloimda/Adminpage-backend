// routes/analysisRoutes.js
const express = require('express');
const router = express.Router();
const analysisController = require('../controllers/analysisController');

// 일일 방문자 수를 가져오는 라우트
router.get('/analysis/visitors/:type', analysisController.getVisitors);

// 오늘 날짜에 가입한 사람 수를 가져오는 라우트
router.get('/analysis/registrations/:type', analysisController.getRegistrations);

// 총 회원 수를 가져오는 라우트
router.get('/analysis/total-members/:type', analysisController.getTotalMembers);

// 성별 및 연령대 집계 라우트
router.get('/analysis/gender-age-stats', analysisController.getGenderAndAgeStats);

// 포스트 분석 라우트
router.get('/analysis/posts/:type', analysisController.getPostAnalysis);

// 포스트 카테고리별 집계 라우트
router.get('/analysis/postscategory/:date', analysisController.getPostsByCategory);

router.get('/analysis/postscategoryall', analysisController.getAllPostsByCategory);

module.exports = router;
