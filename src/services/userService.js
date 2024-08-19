const connection = require('../config/db');

const getMembers = (page, limit, callback) => {
    const offset = (page - 1) * limit;
  
    const query = `
      SELECT mem_idx, mem_id, mem_nick, mem_email, mem_hp,stopdt, stop_info, mem_profile_url
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

const banMultipleUsers = (userIds, stopInfo, stopDt, callback) => {
    const query = `
      UPDATE HM_MEMBER
      SET isstop = 'Y', stop_info = ?, stopdt = ?
      WHERE mem_id IN (?)
    `;
  
    connection.query(query, [stopInfo, stopDt, userIds], (error, results) => {
      if (error) return callback(error);
      callback(null, results);
    });
  };

  
const deleteMultipleUsers = (userIds, deldt, callback) => {
    const query = `
      UPDATE HM_MEMBER
      SET deldt = ?
      WHERE mem_id IN (?)
    `;
  
    connection.query(query, [deldt, userIds], (error, results) => {
      if (error) return callback(error);
      callback(null, results);
    });
  };  

  const getUserDetailById = (memId, callback) => {
    const query = `
        SELECT mem_id, mem_nick, mem_email, mem_hp, mem_profile_url, todaydt, isadmin  -- 올바른 컬럼 이름으로 수정
        FROM HM_MEMBER
        WHERE mem_id = ?
    `;

    connection.query(query, [memId], (error, results) => {
        if (error) return callback(error);
        if (results.length === 0) return callback(null, null);
        callback(null, results[0]);
    });
};
module.exports = {
  getUserDetailById,
  deleteMultipleUsers,
  banMultipleUsers,
  getMembers,
  getMembersCount,
  searchMembersById,
  searchMembersByNick,
  getSearchMembersCountById,
  getSearchMembersCountByNick,
};
