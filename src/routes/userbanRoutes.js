// routes/userbanRoutes.js
const express = require('express');
const router = express.Router();
const userbanController = require('../controllers/userbanController');

// 회원 정지 라우트 (mem_id 기준)
router.post('/users/ban/:memId', userbanController.banUser);

// 회원 정지 해제 라우트 (mem_id 기준)
router.post('/users/unban/:memId', userbanController.unbanUser);

// 정지된 회원 목록을 가져오는 라우트
router.get('/users/banned', userbanController.getBannedUsers);

module.exports = router;
