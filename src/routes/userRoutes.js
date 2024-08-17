const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/members/:page', userController.getMembers);
router.get('/members/search/id/:name', userController.searchMembersById);
router.get('/members/search/nick/:name', userController.searchMembersByNick);
router.post('/members/ban', userController.banUsers);
router.post('/members/delete', userController.deleteUsers);

module.exports = router;
