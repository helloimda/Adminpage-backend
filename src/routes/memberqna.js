const express = require('express');
const router = express.Router();
const memberQnaController = require('../controllers/memberQnaController');

// deldt가 null인 게시글을 불러오는 라우트
router.get('/memberqna/:page', memberQnaController.getQnaPosts);
router.post('/memberqna/answer/post/:meq_idx', memberQnaController.postQnaAnswer);
router.get('/memberqna/notresponse/:page', memberQnaController.getNotRespondedQnaPosts);
router.get('/memberqna/response/:page', memberQnaController.getRespondedQnaPosts);
router.get('/memberqna/detail/:meq_idx', memberQnaController.getQnaDetail);

module.exports = router;
