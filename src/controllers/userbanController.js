const userbanService = require('../services/userbanService');

const banUser = (req, res) => {
  try{
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
  }catch(error){
    console.error('banUser Controller error :', error.message);
    res.status(500).send('banUser Controller error');
    }
};



const unbanUser = (req, res) => {
  try{
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
  }catch(error){
    console.error('unbanUser Controller error :', error.message);
    res.status(500).send('unbanUser Controller error');
    }
};


const getBannedUsers = (req, res) => {
  try{
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
  }
  catch(error){
    console.error('getBannedUsersCount Controller error :', error.message);
    res.status(500).send('getBannedUsersCount Controller error');
    }
};



const searchBannedMembersById = (req, res) => {
  try{
    const searchTerm = req.params.name;
  const page = parseInt(req.params.page) || 1;
  const limit = 10;

  userbanService.getBannedUsersCountById(searchTerm, (error, totalUsers) => {
      if (error) {
          console.error('아이디로 밴된 회원 수 조회 실패:', error.message);
          return res.status(500).send('아이디로 밴된 회원 수를 조회하는 중 오류가 발생했습니다.');
      }

      const totalPages = Math.ceil(totalUsers / limit);
      const previousPage = page > 1 ? page - 1 : null;
      const nextPage = page < totalPages ? page + 1 : null;

      userbanService.searchBannedMembersById(searchTerm, page, limit, (error, results) => {
          if (error) {
              console.error('아이디로 밴된 회원 검색 실패:', error.message);
              return res.status(500).send('밴된 회원 검색 중 오류가 발생했습니다.');
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
  }catch(error){
    console.error('searchBannedMembersById Controller error :', error.message);
    res.status(500).send('searchBannedMembersById Controller error');
    }
};

const searchBannedMembersByNick = (req, res) => {
  try{
    const searchTerm = req.params.name;
  const page = parseInt(req.params.page) || 1;
  const limit = 10;

  userbanService.getBannedUsersCountByNick(searchTerm, (error, totalUsers) => {
      if (error) {
          console.error('닉네임으로 밴된 회원 수 조회 실패:', error.message);
          return res.status(500).send('닉네임으로 밴된 회원 수를 조회하는 중 오류가 발생했습니다.');
      }

      const totalPages = Math.ceil(totalUsers / limit);
      const previousPage = page > 1 ? page - 1 : null;
      const nextPage = page < totalPages ? page + 1 : null;

      userbanService.searchBannedMembersByNick(searchTerm, page, limit, (error, results) => {
          if (error) {
              console.error('닉네임으로 밴된 회원 검색 실패:', error.message);
              return res.status(500).send('밴된 회원 검색 중 오류가 발생했습니다.');
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
  }catch(error){
    console.error('searchBannedMembersByNick Controller error :', error.message);
    res.status(500).send('searchBannedMembersByNick Controller error');
    }
};


const deleteUser = (req, res) => {
  try{
    const memIdx = req.params.mem_idx;  // URL 파라미터로 mem_idx를 받음

  if (!memIdx) {
      return res.status(400).json({  message: '삭제할 사용자 ID가 제공되지 않았습니다.' });
  }

  userbanService.deleteUser(memIdx, (error, message) => {
      if (error) {
          return res.status(500).json({  message: '회원 삭제 중 오류가 발생했습니다.', error: error.message });
      }
      res.json({  message: message });
  });
  }catch(error){
    console.error('deleteUser Controller error :', error.message);
    res.status(500).send('deleteUser Controller error');
    }
};


module.exports = {
  deleteUser,
  searchBannedMembersById,
  searchBannedMembersByNick,
  banUser,
  unbanUser,
  getBannedUsers,
};
