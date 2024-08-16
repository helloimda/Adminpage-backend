// controllers/userbanController.js
const userbanService = require('../services/userbanService');

const banUser = (req, res) => {
  const memId = req.params.memId;
  const { stop_info, stopdt } = req.body;

  userbanService.banUser(memId, stop_info, stopdt, (error, message) => {
    if (error) {
      console.error('회원 정지 실패:', error.message);
      return res.status(500).send('회원 정지 중 오류가 발생했습니다.');
    }
    res.send(message);
  });
};

const unbanUser = (req, res) => {
  const memId = req.params.memId;

  userbanService.unbanUser(memId, (error, message) => {
    if (error) {
      console.error('회원 정지 해제 실패:', error.message);
      return res.status(500).send('회원 정지 해제 중 오류가 발생했습니다.');
    }
    res.send(message);
  });
};

const getBannedUsers = (req, res) => {
  userbanService.getBannedUsers((error, users) => {
    if (error) {
      console.error('정지된 회원 목록을 가져오지 못했습니다:', error.message);
      return res.status(500).send('회원 목록을 가져오는 중 오류가 발생했습니다.');
    }
    res.json(users);
  });
};

module.exports = {
  banUser,
  unbanUser,
  getBannedUsers,
};
