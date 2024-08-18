const express = require('express');
const router = express.Router();
const postmanageController = require('../controllers/postmanageController');

// 공지사항 리스트를 가져오는 라우트
router.get('/postmanage/notices/:page', postmanageController.getNotices);
router.get('/postmanage/notice/detail/:id', postmanageController.getPostDetail);
router.post('/postmanage/notice/detail/:id', postmanageController.updatePostNoticeDetail);
router.post('/postmanage/notice/delete', postmanageController.deleteMultiplePosts);  

router.get('/postmanage/notice/search/subject', postmanageController.searchPostsBySubject);
router.get('/postmanage/notice/search/content', postmanageController.searchPostsByContent);
router.get('/postmanage/notice/search/nick', postmanageController.searchPostsByNick);

// 일반 게시글 라우트
router.get('/postmanage/general/:page', postmanageController.getGeneralPosts); 
router.get('/postmanage/general/detail/:id', postmanageController.getGeneralPostDetail);
router.post('/postmanage/general/detail/:id', postmanageController.updateGeneralPostDetail);
router.post('/postmanage/general/delete', postmanageController.deleteMultipleGeneralPosts);

router.get('/postmanage/general/search/subject', postmanageController.searchGeneralPostsBySubject);
router.get('/postmanage/general/search/content', postmanageController.searchGeneralPostsByContent);
router.get('/postmanage/general/search/nick', postmanageController.searchGeneralPostsByNick);

module.exports = router;
