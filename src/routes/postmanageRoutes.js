const express = require('express');
const router = express.Router();
const postmanageController = require('../controllers/postmanageController');

// 공지사항 리스트를 가져오는 라우트
router.get('/postmanage/notices/:page', postmanageController.getNotices);
router.get('/postmanage/postnoticedetail/:id', postmanageController.getPostDetail);
router.post('/postmanage/postnoticedetail/:id', postmanageController.updatePostNoticeDetail);
router.post('/postmanage/postdelete', postmanageController.deleteMultiplePosts);  // 변경된 라우트



router.get('/postmanage/search/subject', postmanageController.searchPostsBySubject);
router.get('/postmanage/search/content', postmanageController.searchPostsByContent);
router.get('/postmanage/search/nick', postmanageController.searchPostsByNick);


module.exports = router;
