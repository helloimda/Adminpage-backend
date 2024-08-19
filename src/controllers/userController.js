const userService = require('../services/userService');

const getMembers = (req, res) => {
    const page = parseInt(req.params.page) || 1;
    const limit = 10;
  
    userService.getMembersCount((error, totalMembers) => {
      if (error) {
        console.error('회원 수 조회 실패:', error.message);
        return res.status(500).send('회원 수 조회 중 오류가 발생했습니다.');
      }
  
      const totalPages = Math.ceil(totalMembers / limit);
      const previousPage = page > 1 ? page - 1 : null;
      const nextPage = page < totalPages ? page + 1 : null;
  
      userService.getMembers(page, limit, (error, results) => {
        if (error) {
          console.error('회원 리스트 불러오기 실패:', error.message);
          return res.status(500).send('회원 리스트를 불러오는 중 오류가 발생했습니다.');
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

  const searchMembersById = (req, res) => {
    const searchTerm = req.params.name;
    const page = parseInt(req.params.page) || 1;
    const limit = 10;
  
    userService.getSearchMembersCountById(searchTerm, (error, totalMembers) => {
      if (error) {
        console.error('회원 수 조회 실패:', error.message);
        return res.status(500).send('회원 수 조회 중 오류가 발생했습니다.');
      }
  
      const totalPages = Math.ceil(totalMembers / limit);
      const previousPage = page > 1 ? page - 1 : null;
      const nextPage = page < totalPages ? page + 1 : null;
  
      userService.searchMembersById(searchTerm, page, (error, results) => {
        if (error) {
          console.error('회원 검색 실패:', error.message);
          return res.status(500).send('회원 검색 중 오류가 발생했습니다.');
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
  
  const searchMembersByNick = (req, res) => {
    const searchTerm = req.params.name;
    const page = parseInt(req.params.page) || 1;
    const limit = 10;
  
    userService.getSearchMembersCountByNick(searchTerm, (error, totalMembers) => {
      if (error) {
        console.error('회원 수 조회 실패:', error.message);
        return res.status(500).send('회원 수 조회 중 오류가 발생했습니다.');
      }
  
      const totalPages = Math.ceil(totalMembers / limit);
      const previousPage = page > 1 ? page - 1 : null;
      const nextPage = page < totalPages ? page + 1 : null;
  
      userService.searchMembersByNick(searchTerm, page, (error, results) => {
        if (error) {
          console.error('회원 검색 실패:', error.message);
          return res.status(500).send('회원 검색 중 오류가 발생했습니다.');
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

  const banUser = (req, res) => {
    const memIdx = req.params.mem_idx; // URL에서 mem_idx를 받음
    const { stop_info, stopdt } = req.body; // 요청 본문에서 stop_info와 stopdt를 받음
  
    // 요청 본문을 로그로 출력하여 데이터 확인
    console.log('Request body:', req.body);
  
    // stop_info나 stopdt가 제공되지 않았을 경우 에러 반환
    if (!stop_info || !stopdt) {
      return res.status(400).json({ success: false, message: 'stop_info 또는 stopdt 값이 제공되지 않았습니다.' });
    }
  
    // 로그로 memIdx, stop_info, stopdt 값 출력
    console.log(`memIdx: ${memIdx}, stopInfo: ${stop_info}, stopDt: ${stopdt}`);
  
    // 서비스 레이어에서 사용자 밴 처리 호출
    userService.banUser(memIdx, stop_info, stopdt, (error, message) => {
      if (error) {
        console.error('회원 정지 실패:', error.message);
        return res.status(500).send('회원 정지 중 오류가 발생했습니다.');
      }
      // 성공 시 응답
      res.json({ success: true, message: message });
    });
  };
  
  


const deleteUsers = (req, res) => {
    const userIds = req.body.userIds;

    // userIds가 배열이 아니거나, 비어있다면 에러 반환
    if (!Array.isArray(userIds) || userIds.length === 0) {
        return res.status(400).json({ success: false, message: 'No user IDs provided' });
    }

    const deldt = new Date().toISOString();  // 현재 날짜를 ISO 형식으로 설정

    userbanService.deleteMultipleUsers(userIds, deldt, (error, result) => {
        if (error) {
            return res.status(500).json({ success: false, message: 'Failed to delete users', error: error.message });
        }
        res.json({ success: true, message: 'Users deleted successfully', result: result });
    });
};

const getUserDetail = (req, res) => {
    const memId = req.params.id;

    userService.getUserDetailById(memId, (error, userDetail) => { // userbanService 대신 userService 사용
        if (error) {
            return res.status(500).json({ success: false, message: 'Failed to retrieve user details', error: error.message });
        }
        if (!userDetail) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, data: userDetail });
    });
};


module.exports = {
  getUserDetail,
  deleteUsers,
  banUser,
  getMembers,
  searchMembersById,
  searchMembersByNick,
};
