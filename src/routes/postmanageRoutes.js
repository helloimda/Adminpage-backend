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

// 일반 게시글 라우트
router.get('/postmanage/general/:page', postmanageController.getGeneralPosts); 
router.get('/postmanage/general/detail/:id', postmanageController.getGeneralPostDetail);
router.post('/postmanage/general/delete/:id', postmanageController.deleteGeneralPost);

router.get('/postmanage/general/search/subject/:id/:page', postmanageController.searchGeneralPostsBySubject);
router.get('/postmanage/general/search/content/:id/:page', postmanageController.searchGeneralPostsByContent);
router.get('/postmanage/general/search/nick/:id/:page', postmanageController.searchGeneralPostsByNick);


// 사기 피해 게시글 라우트
router.get('/postmanage/fraud/:page', postmanageController.getFraudPosts);
router.get('/postmanage/fraud/detail/:id', postmanageController.getFraudPostDetail);
//여기까지 완료 아래부터 수정해야함
router.post('/postmanage/fraud/delete/:id', postmanageController.deleteFraudPost);

router.get('/postmanage/fraud/search/nick/:id/:page', postmanageController.searchFraudPostsByMemId);
router.get('/postmanage/fraud/search/goodname', postmanageController.searchFraudPostsByGoodName);

module.exports = router;
