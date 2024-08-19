const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/members/:page', userController.getMembers);
router.get('/members/search/id/:name', userController.searchMembersById);
router.get('/members/search/nick/:name', userController.searchMembersByNick);
router.post('/members/ban/:mem_idx', userController.banUser);
router.post('/members/delete/:mem_idx', userController.deleteUser);
router.get('/members/userdetail/:mem_idx', userController.getUserDetail);

module.exports = router;

