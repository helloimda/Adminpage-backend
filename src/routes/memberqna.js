const express = require('express');
const router = express.Router();
const memberQnaController = require('../controllers/memberQnaController');

// deldt가 null인 게시글을 불러오는 라우트
router.get('/memberqna/:page', memberQnaController.getQnaPosts);

module.exports = router;
