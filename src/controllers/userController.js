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

const banUsers = (req, res) => {
    const userIds = req.body.userIds;
    const stopInfo = req.body.stopInfo;
    const stopDt = req.body.stopDt;
  
    // userIds가 배열이 아니거나, 비어있다면 에러 반환
    if (!Array.isArray(userIds) || userIds.length === 0) {
        return res.status(400).json({ success: false, message: 'No user IDs provided' });
    }

    // stopInfo가 제공되지 않으면 에러 반환
    if (!stopInfo || typeof stopInfo !== 'string') {
        return res.status(400).json({ success: false, message: 'No stop info provided or stop info is invalid' });
    }

    // stopDt가 제공되지 않으면 에러 반환
    if (!stopDt || isNaN(new Date(stopDt))) {
        return res.status(400).json({ success: false, message: 'No stop date provided or stop date is invalid' });
    }

    userbanService.banMultipleUsers(userIds, stopInfo, stopDt, (error, result) => {
        if (error) {
            return res.status(500).json({ success: false, message: 'Failed to ban users', error: error.message });
        }
        res.json({ success: true, message: 'Users banned successfully', result: result });
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
  banUsers,
  getMembers,
  searchMembersById,
  searchMembersByNick,
};
