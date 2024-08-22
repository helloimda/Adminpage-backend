const connection = require('../config/db');

const getMembers = (page, limit, callback) => {
  const offset = (page - 1) * limit;

  const query = `
    SELECT mem_idx, mem_id, mem_nick, mem_email, mem_hp, mem_profile_url, todaydt, isadmin, stopdt, stop_info
    FROM HM_MEMBER
    WHERE deldt IS NULL
    ORDER BY mem_idx DESC
    LIMIT ? OFFSET ?
  `;

  connection.query(query, [limit, offset], (error, results) => {
    if (error) return callback(error);
    callback(null, results);
  });
};

  
  const getMembersCount = (callback) => {
    const query = `
      SELECT COUNT(*) AS total
      FROM HM_MEMBER
      WHERE deldt IS NULL
    `;
  
    connection.query(query, (error, results) => {
      if (error) return callback(error);
      callback(null, results[0].total);
    });
  };

  const searchMembersById = (searchTerm, page, callback) => {
    const limit = 10;
    const offset = (page - 1) * limit;
    
    const query = `
      SELECT mem_idx, mem_id, mem_nick, mem_email, mem_hp, mem_profile_url, stopdt, stop_info
      FROM HM_MEMBER 
      WHERE mem_id LIKE ? AND deldt IS NULL
      ORDER BY mem_idx DESC 
      LIMIT ? OFFSET ?;
    `;
    
    connection.query(query, [`%${searchTerm}%`, limit, offset], (error, results) => {
      if (error) return callback(error);
      callback(null, results);
    });
  };
  
  const searchMembersByNick = (searchTerm, page, callback) => {
    const limit = 10;
    const offset = (page - 1) * limit;
    
    const query = `
      SELECT mem_idx, mem_id, mem_nick, mem_email, mem_hp, mem_profile_url, stopdt, stop_info
      FROM HM_MEMBER 
      WHERE mem_nick LIKE ? AND deldt IS NULL
      ORDER BY mem_idx DESC 
      LIMIT ? OFFSET ?;
    `;
    
    connection.query(query, [`%${searchTerm}%`, limit, offset], (error, results) => {
      if (error) return callback(error);
      callback(null, results);
    });
  };
  
  const getSearchMembersCountById = (searchTerm, callback) => {
    const query = `
      SELECT COUNT(*) AS total
      FROM HM_MEMBER
      WHERE mem_id LIKE ? AND deldt IS NULL
    `;
  
    connection.query(query, [`%${searchTerm}%`], (error, results) => {
      if (error) return callback(error);
      callback(null, results[0].total);
    });
  };
  
  const getSearchMembersCountByNick = (searchTerm, callback) => {
    const query = `
      SELECT COUNT(*) AS total
      FROM HM_MEMBER
      WHERE mem_nick LIKE ? AND deldt IS NULL
    `;
  
    connection.query(query, [`%${searchTerm}%`], (error, results) => {
      if (error) return callback(error);
      callback(null, results[0].total);
    });
  };

  const banUser = (memIdx, stopInfo, stopDt, callback) => {
    const query = `
      UPDATE HM_MEMBER
      SET isstop = 'Y', stop_info = ?, stopdt = ?
      WHERE mem_idx = ? AND deldt IS NULL
    `;
  
    // 정지 정보를 업데이트하는 쿼리 실행
    connection.query(query, [stopInfo, stopDt, memIdx], (error, results) => {
      if (error) return callback(error);
      if (results.affectedRows === 0) {
        return callback(new Error('해당 사용자를 찾을 수 없습니다.'));
      }
      callback(null, '회원이 성공적으로 정지되었습니다.');
    });
  };

  
  const deleteUser = (memIdx, callback) => {
    const query = `
      UPDATE HM_MEMBER
      SET deldt = NOW()
      WHERE mem_idx = ?
    `;
  
    connection.query(query, [memIdx], (error, results) => {
      if (error) return callback(error);
      if (results.affectedRows === 0) return callback(new Error('사용자를 찾을 수 없습니다.'));
      callback(null, '회원이 성공적으로 삭제되었습니다.');
    });
  };
  

  const getUserDetailById = (memIdx, callback) => {
    const query = `
        SELECT mem_idx, mem_id, mem_name, mem_nick, mem_email, mem_sex, mem_birth, mem_hp, mem_profile_url, 
               content, todaydt, isstop, stop_info, stopdt, regdt
        FROM HM_MEMBER
        WHERE mem_idx = ?
    `;

    connection.query(query, [memIdx], (error, results) => {
        if (error) return callback(error);
        console.log("Query Results for mem_idx:", memIdx, results);  // 결과 출력
        if (results.length === 0) return callback(null, null);
        callback(null, results[0]);
    });
};


module.exports = {
  getUserDetailById,
  deleteUser,
  banUser,
  getMembers,
  getMembersCount,
  searchMembersById,
  searchMembersByNick,
  getSearchMembersCountById,
  getSearchMembersCountByNick,
};