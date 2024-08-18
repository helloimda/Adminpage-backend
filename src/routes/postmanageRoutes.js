const express = require('express');
const router = express.Router();
const postmanageController = require('../controllers/postmanageController');

// 공지사항 리스트를 가져오는 라우트
router.get('/postmanage/notices/:page', postmanageController.getNotices);
router.get('/postmanage/postdetail/:id', postmanageController.getPostDetail);

module.exports = router;
