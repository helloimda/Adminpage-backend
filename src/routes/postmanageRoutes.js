const express = require('express');
const router = express.Router();
const postmanageController = require('../controllers/postmanageController');

// 공지사항 리스트를 가져오는 라우트
router.get('/postmanage/notice/:page', postmanageController.getNotices);
router.get('/postmanage/notice/detail/:id', postmanageController.getPostNoticeDetail);
router.post('/postmanage/notice/detail/:id', postmanageController.updatePostNoticeDetail);
router.post('/postmanage/notice/delete/:id', postmanageController.deletePost);  

router.get('/postmanage/notice/search/subject/:name/:page', postmanageController.searchPostsBySubject);
router.get('/postmanage/notice/search/content/:name/:page', postmanageController.searchPostsByContent);
router.get('/postmanage/notice/search/nick/:name/:page', postmanageController.searchPostsByNick);
//여기까지 완료 아래부터 수정
// 일반 게시글 라우트
router.get('/postmanage/general/:page', postmanageController.getGeneralPosts); 
router.get('/postmanage/general/detail/:id', postmanageController.getGeneralPostDetail);
router.post('/postmanage/general/delete', postmanageController.deleteMultipleGeneralPosts);

router.get('/postmanage/general/search/subject', postmanageController.searchGeneralPostsBySubject);
router.get('/postmanage/general/search/content', postmanageController.searchGeneralPostsByContent);
router.get('/postmanage/general/search/nick', postmanageController.searchGeneralPostsByNick);


// 사기 피해 게시글 라우트
router.get('/postmanage/fraud/:page', postmanageController.getFraudPosts);
router.get('/postmanage/fraud/detail/:id', postmanageController.getFraudPostDetail);
router.post('/postmanage/fraud/delete', postmanageController.deleteMultipleFraudPosts);

router.get('/postmanage/fraud/search/memid', postmanageController.searchFraudPostsByMemId);
router.get('/postmanage/fraud/search/goodname', postmanageController.searchFraudPostsByGoodName);

module.exports = router;
