const userbanService = require('../services/userbanService');

const banUser = (req, res) => {
  const memIdx = req.params.mem_idx;
  const { stop_info, stopdt } = req.body;

  // req.body를 로그로 출력해 확인
  console.log('Request body:', req.body);

  if (!stop_info || !stopdt) {
    return res.status(400).json({ success: false, message: 'stop_info 또는 stopdt 값이 제공되지 않았습니다.' });
  }

  console.log(`memIdx: ${memIdx}, stopInfo: ${stop_info}, stopDt: ${stopdt}`);

  userbanService.banUser(memIdx, stop_info, stopdt, (error, message) => {
    if (error) {
      console.error('회원 정지 실패:', error.message);
      return res.status(500).send('회원 정지 중 오류가 발생했습니다.');
    }
    res.json({ success: true, message: message });
  });
};



const unbanUser = (req, res) => {
  const memIdx = req.params.mem_idx;  // 단일 사용자 ID를 URL 파라미터로 받음

  if (!memIdx) {
    return res.status(400).json({ success: false, message: '해제할 사용자 ID를 선택해주세요.' });
  }

  userbanService.unbanUser(memIdx, (error, message) => {
    if (error) {
      return res.status(500).json({ success: false, message: '회원 정지 해제 중 오류가 발생했습니다.', error: error.message });
    }
    res.json({ success: true, message: message });
  });
};


const getBannedUsers = (req, res) => {
  const page = parseInt(req.params.page) || 1;
  const limit = 10;

  // 총 페이지 수 계산을 위한 전체 사용자 수 가져오기
  userbanService.getBannedUsersCount((error, totalUsers) => {
      if (error) {
          console.error('밴된 회원 수 조회 실패:', error.message);
          return res.status(500).send('밴된 회원 수를 조회하는 중 오류가 발생했습니다.');
      }
      const totalPages = Math.ceil(totalUsers / limit);
      const previousPage = page > 1 ? page - 1 : null;
      const nextPage = (page * limit) < totalUsers ? page + 1 : null;

      userbanService.getBannedUsers(page, limit, (error, results) => {
          if (error) {
              console.error('밴된 회원 리스트 불러오기 실패:', error.message);
              return res.status(500).send('밴된 회원 리스트를 불러오는 중 오류가 발생했습니다.');
          }

          res.json({
              data: results,
              pagination: {
                  previousPage,
                  nextPage,
                  currentPage: page,
                  totalPages,
              },
          });
      });
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

const deleteUsers = (req, res) => {
  const memIdxs = req.body.memIdxs;  // 수정: memIds -> memIdxs

  if (!Array.isArray(memIdxs) || memIdxs.length === 0) {
      return res.status(400).json({ success: false, message: '삭제할 사용자 ID를 선택해주세요.' });
  }

  userbanService.deleteUsers(memIdxs, (error, message) => {
      if (error) {
          return res.status(500).json({ success: false, message: '회원 삭제 중 오류가 발생했습니다.', error: error.message });
      }
      res.json({ success: true, message: message });
  });
};

module.exports = {
  deleteUsers,
  searchBannedMembersById,
  searchBannedMembersByNick,
  banUser,
  unbanUser,
  getBannedUsers,
};
