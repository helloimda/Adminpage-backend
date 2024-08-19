// routes/userbanRoutes.js
const express = require('express');
const router = express.Router();
const userbanController = require('../controllers/userbanController');

// 회원 정지 라우트 (mem_id 기준)
router.post('/users/ban/:mem_idx', userbanController.banUser);

// 회원 정지 해제 라우트 (mem_id 기준)
router.post('/users/unban/:mem_idx', userbanController.unbanUser);

// 정지된 회원 목록을 가져오는 라우트
router.get('/users/banuser/:page', userbanController.getBannedUsers);

// 특정 ID로 밴된 회원 검색 라우트
router.get('/users/search/id/:name', userbanController.searchBannedMembersById);

// 특정 닉네임으로 밴된 회원 검색 라우트
router.get('/users/search/nick/:name', userbanController.searchBannedMembersByNick);

router.post('/users/delete/:mem_idx', userbanController.deleteUser);
module.exports = router;
