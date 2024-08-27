const express = require('express');
const router = express.Router();
const postmanageController = require('../controllers/postmanageController');
const extractUserFromToken = require('../middleware/extractUserFromToken');

const multer = require('multer');
const path = require('path');

const upload = multer({
    storage: multer.memoryStorage(), // 메모리 저장소 사용
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB 제한
});

// 공지사항 리스트를 가져오는 라우트
router.get('/postmanage/notice/:page', postmanageController.getNotices);
router.get('/postmanage/notice/detail/:id', postmanageController.getPostNoticeDetail);
router.post('/postmanage/notice/detail/:id', postmanageController.updatePostNoticeDetail);
router.post('/postmanage/notice/delete/:id', postmanageController.deletePost);  
router.get('/postmanage/notice/search/subject/:name/:page', postmanageController.searchPostsBySubject);
router.get('/postmanage/notice/search/content/:name/:page', postmanageController.searchPostsByContent);
router.get('/postmanage/notice/search/nick/:name/:page', postmanageController.searchPostsByNick);
router.post('/postmanage/notice/post', postmanageController.createNoticePost);
router.post('/postmanage/notice/imgdelete/:bo_idx/:img_idx', postmanageController.deleteNoticeImage);
router.get('/postmanage/notice/post/user', extractUserFromToken, postmanageController.returnUserInfo);

router.post('/postmanage/notice/imgadd/:bo_idx', upload.single('image'), postmanageController.addNoticeImage);

//일반 게시글
router.get('/postmanage/general/:page', postmanageController.getGeneralPosts); 
router.get('/postmanage/general/detail/:id', postmanageController.getGeneralPostDetail);
router.post('/postmanage/general/delete/:id', postmanageController.deleteGeneralPost);
router.get('/postmanage/general/search/subject/:id/:page', postmanageController.searchGeneralPostsBySubject);
router.get('/postmanage/general/search/content/:id/:page', postmanageController.searchGeneralPostsByContent);
router.get('/postmanage/general/search/nick/:id/:page', postmanageController.searchGeneralPostsByNick);
router.get('/postmanage/general/comment/:id', postmanageController.getCommentsByPostId);
router.get('/postmanage/general/comment/delete/:cmt_idx', postmanageController.deleteComment);
router.get('/postmanage/general/comment/list/:page', postmanageController.getCommentList);
router.get('/postmanage/general/comment/detail/:bo_idx/:page', postmanageController.getCommentDetailByPost);

router.get('/postmanage/general/comment/search/nickname/:mem_id/:page', postmanageController.searchCommentsByNickname);
router.get('/postmanage/general/comment/search/content/:content/:page', postmanageController.searchCommentsByContent);

// 사기 피해 게시글 라우트
router.get('/postmanage/fraud/:page', postmanageController.getFraudPosts);
router.get('/postmanage/fraud/detail/:id', postmanageController.getFraudPostDetail);
router.post('/postmanage/fraud/delete/:id', postmanageController.deleteFraudPost);
router.get('/postmanage/fraud/search/nick/:id/:page', postmanageController.searchFraudPostsByMemId);
router.get('/postmanage/fraud/search/goodname/:id/:page', postmanageController.searchFraudPostsByGoodName);
router.get('/postmanage/fraud/comment/:bof_idx', postmanageController.getFraudCommentsByPostId);
router.get('/postmanage/fraud/comment/delete/:bofc_idx', postmanageController.deleteFraudComment);
router.get('/postmanage/fraud/comment/list/:page', postmanageController.getFraudComments);
router.get('/postmanage/fraud/comment/detail/:bof_idx/:page', postmanageController.getFraudCommentsByPost);

router.get('/postmanage/fraud/comment/nickname/:mem_id/:page', postmanageController.searchFraudCommentsByNickname);
router.get('/postmanage/fraud/comment/content/:content/:page', postmanageController.searchFraudCommentsByContent);

module.exports = router;
