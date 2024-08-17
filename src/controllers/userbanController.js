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
  const memIds = req.body.memIds; // 체크박스로 선택된 mem_id 배열

  if (!Array.isArray(memIds) || memIds.length === 0) {
      return res.status(400).json({ success: false, message: '해제할 사용자 ID를 선택해주세요.' });
  }

  userbanService.unbanUser(memIds, (error, message) => {
      if (error) {
          return res.status(500).json({ success: false, message: '회원 정지 해제 중 오류가 발생했습니다.', error: error.message });
      }
      res.json({ success: true, message: message });
  });
};


const getBannedUsers = (req, res) => {
  const page = parseInt(req.params.page) || 1;

  userbanService.getBannedUsers(page, (error, results) => {
    if (error) {
      console.error('밴된 회원 리스트 불러오기 실패:', error.message);
      return res.status(500).send('밴된 회원 리스트를 불러오는 중 오류가 발생했습니다.');
    }
    res.json({ success: true, data: results });
  });
};

const searchBannedMembersById = (req, res) => {
  const searchTerm = req.params.name;

  userbanService.searchBannedMembersById(searchTerm, (error, results) => {
      if (error) {
          console.error('아이디로 밴된 회원 검색 실패:', error.message);
          return res.status(500).send('밴된 회원 검색 중 오류가 발생했습니다.');
      }
      res.json(results);
  });
};

const searchBannedMembersByNick = (req, res) => {
  const searchTerm = req.params.name;

  userbanService.searchBannedMembersByNick(searchTerm, (error, results) => {
      if (error) {
          console.error('닉네임으로 밴된 회원 검색 실패:', error.message);
          return res.status(500).send('밴된 회원 검색 중 오류가 발생했습니다.');
      }
      res.json(results);
  });
};


module.exports = {
  searchBannedMembersById,
  searchBannedMembersByNick,
  banUser,
  unbanUser,
  getBannedUsers,
};
