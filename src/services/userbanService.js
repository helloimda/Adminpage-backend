// services/userbanService.js
const connection = require('../config/db');

const banUser = (memIdx, stopInfo, stopDt, callback) => {
  console.log(`memIdx: ${memIdx}, stopInfo: ${stopInfo}, stopDt: ${stopDt}`);

  const query = `
    UPDATE HM_MEMBER
    SET isstop = 'Y', stop_info = ?, stopdt = ?
    WHERE mem_idx = ? AND deldt IS NULL
  `;

  console.log(`Executing query: ${query}`);
  console.log(`With parameters: ${[stopInfo, stopDt, memIdx]}`);

  connection.query(query, [stopInfo, stopDt, memIdx], (error, results) => {
    if (error) {
      console.error('쿼리 실행 오류:', error.message);
      return callback(error);
    }
    if (results.affectedRows === 0) {
      console.log('No rows affected. Check if the mem_idx and deldt conditions match any record.');
      return callback(new Error('사용자를 찾을 수 없습니다.'));
    }
    callback(null, '회원이 성공적으로 정지되었습니다.');
  });
};


const unbanUser = (memIdx, callback) => {
  const query = `
    UPDATE HM_MEMBER
    SET isstop = 'N', stop_info = NULL, stopdt = NULL
    WHERE mem_idx = ?
  `;

  connection.query(query, [memIdx], (error, results) => {
    if (error) return callback(error);
    if (results.affectedRows === 0) return callback(new Error('사용자를 찾을 수 없습니다.'));
    callback(null, `회원 정지가 성공적으로 해제되었습니다.`);
  });
};

const getBannedUsers = (page, callback) => {
  const limit = 10;
  const offset = (page - 1) * limit;

  const query = `
    SELECT mem_idx, mem_id, mem_nick, mem_email, mem_hp, stopdt, stop_info, mem_profile_url
    FROM HM_MEMBER
    WHERE isstop = 'Y' AND deldt IS NULL
    ORDER BY mem_idx DESC
    LIMIT ? OFFSET ?;
  `;
  
  connection.query(query, [limit, offset], (error, results) => {
    if (error) return callback(error);
    callback(null, results);
  });
};


const searchBannedMembersById = (searchTerm, callback) => {
  const query = `
      SELECT mem_idx, mem_id, mem_nick, mem_email, mem_hp, stopdt, stop_info
      FROM HM_MEMBER
      WHERE isstop = 'Y' AND deldt IS NULL AND mem_id LIKE ?
  `;

  connection.query(query, [`%${searchTerm}%`], (error, results) => {
      if (error) return callback(error);
      callback(null, results);
  });
};

const searchBannedMembersByNick = (searchTerm, callback) => {
  const query = `
      SELECT mem_idx, mem_id, mem_nick, mem_email, mem_hp, stopdt, stop_info
      FROM HM_MEMBER
      WHERE isstop = 'Y' AND deldt IS NULL AND mem_nick LIKE ?
  `;

  connection.query(query, [`%${searchTerm}%`], (error, results) => {
      if (error) return callback(error);
      callback(null, results);
  });
};

const deleteUsers = (memIds, callback) => {
  const query = `
    UPDATE HM_MEMBER
    SET deldt = NOW()
    WHERE mem_id IN (?)
  `;

  connection.query(query, [memIds], (error, results) => {
    if (error) return callback(error);
    if (results.affectedRows === 0) return callback(new Error('사용자를 찾을 수 없습니다.'));
    callback(null, `${results.affectedRows}명의 회원이 삭제되었습니다.`);
  });
};



module.exports = {
  deleteUsers,
  searchBannedMembersById,
  searchBannedMembersByNick,
  banUser,
  unbanUser,
  getBannedUsers
};
