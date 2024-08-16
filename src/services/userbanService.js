// services/userbanService.js
const connection = require('../config/db');

const banUser = (memId, stopInfo, stopDt, callback) => {
  const query = `
    UPDATE HM_MEMBER
    SET isstop = 'Y', stop_info = ?, stopdt = ?
    WHERE mem_id = ?
  `;

  connection.query(query, [stopInfo, stopDt, memId], (error, results) => {
    if (error) return callback(error);
    if (results.affectedRows === 0) return callback(new Error('사용자를 찾을 수 없습니다.'));
    callback(null, '회원이 성공적으로 정지되었습니다.');
  });
};

const unbanUser = (memId, callback) => {
  const query = `
    UPDATE HM_MEMBER
    SET isstop = 'N', stop_info = NULL, stopdt = NULL
    WHERE mem_id = ?
  `;

  connection.query(query, [memId], (error, results) => {
    if (error) return callback(error);
    if (results.affectedRows === 0) return callback(new Error('사용자를 찾을 수 없습니다.'));
    callback(null, '회원 정지가 해제되었습니다.');
  });
};

const getBannedUsers = (callback) => {
  const query = `
    SELECT mem_idx, mem_id, mem_nick, stop_info, stopdt
    FROM HM_MEMBER
    WHERE isstop = 'Y'
  `;

  connection.query(query, (error, results) => {
    if (error) return callback(error);
    callback(null, results);
  });
};

module.exports = {
  banUser,
  unbanUser,
  getBannedUsers
};
