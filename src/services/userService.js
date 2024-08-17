const connection = require('../config/db');

const getMembers = (page, callback) => {
  const limit = 10;
  const offset = (page - 1) * limit;
  
  const query = `
    SELECT mem_idx, mem_id, mem_nick 
    FROM HM_MEMBER 
    ORDER BY mem_idx DESC 
    LIMIT ? OFFSET ?;
  `;
  
  connection.query(query, [limit, offset], (error, results) => {
    if (error) return callback(error);
    callback(null, results);
  });
};

const searchMembersById = (searchTerm, page, callback) => {
  const limit = 10;
  const offset = (page - 1) * limit;
  
  const query = `
    SELECT mem_idx, mem_id, mem_nick 
    FROM HM_MEMBER 
    WHERE mem_id LIKE ? 
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
    SELECT mem_idx, mem_id, mem_nick 
    FROM HM_MEMBER 
    WHERE mem_nick LIKE ? 
    ORDER BY mem_idx DESC 
    LIMIT ? OFFSET ?;
  `;
  
  connection.query(query, [`%${searchTerm}%`, limit, offset], (error, results) => {
    if (error) return callback(error);
    callback(null, results);
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

module.exports = {
  deleteMultipleUsers,
  banMultipleUsers,
  getMembers,
  searchMembersById,
  searchMembersByNick,
};
