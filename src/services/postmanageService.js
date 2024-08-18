const connection = require('../config/db');

const getNotices = (page, callback) => {
  const limit = 10;
  const offset = (page - 1) * limit;

  const query = `
    SELECT bo_idx, mem_id, subject, cnt_view, regdt
    FROM HM_BOARD_NOTICE
    ORDER BY regdt DESC
    LIMIT ? OFFSET ?;
  `;

  connection.query(query, [limit, offset], (error, results) => {
    if (error) return callback(error);
    callback(null, results);
  });
};

const getPostNoticeDetail = (bo_idx, callback) => {
    const query = `
      SELECT mem_idx, mem_id, subject, cnt_view, regdt, content
      FROM HM_BOARD_NOTICE
      WHERE bo_idx = ?
    `;
  
    connection.query(query, [bo_idx], (error, results) => {
      if (error) return callback(error);
      if (results.length === 0) return callback(new Error('해당 게시글을 찾을 수 없습니다.'));
      
      const postDetail = results[0];
      
      // 이미지를 가져오는 쿼리 추가
      const imageQuery = `
        SELECT file_name, file_url
        FROM HM_BOARD_NOTICE_IMG
        WHERE bo_idx = ?
      `;
      
      connection.query(imageQuery, [bo_idx], (imgError, imgResults) => {
        if (imgError) return callback(imgError);
        
        // 게시글 상세 정보에 이미지 추가
        postDetail.images = imgResults;
        
        callback(null, postDetail);
      });
    });
};

const updatePostNoticeDetail = (bo_idx, subject, content, callback) => {
    const query = `
      UPDATE HM_BOARD_NOTICE
      SET subject = ?, content = ?, moddt = ?
      WHERE bo_idx = ?
    `;
  
    const moddt = new Date(); // 현재 타임스탬프
    connection.query(query, [subject, content, moddt, bo_idx], (error, results) => {
      if (error) return callback(error);
      
      // 업데이트된 행 수를 확인하고 적절한 처리를 할 수 있습니다.
      if (results.affectedRows === 0) {
        return callback(new Error('해당 게시글을 찾을 수 없습니다.'));
      }

      callback(null, results);
    });
};

const searchPostsBySubject = (searchTerm, page, callback) => {
    const limit = 10;
    const offset = (page - 1) * limit;
    
    const query = `
      SELECT bo_idx, subject, content, regdt 
      FROM HM_BOARD_NOTICE 
      WHERE subject LIKE ? 
      ORDER BY bo_idx DESC 
      LIMIT ? OFFSET ?;
    `;
    
    connection.query(query, [`%${searchTerm}%`, limit, offset], (error, results) => {
      if (error) return callback(error);
      callback(null, results);
    });
  };
  
  const searchPostsByContent = (searchTerm, page, callback) => {
    const limit = 10;
    const offset = (page - 1) * limit;
    
    const query = `
      SELECT bo_idx, subject, content, regdt 
      FROM HM_BOARD_NOTICE 
      WHERE content LIKE ? 
      ORDER BY bo_idx DESC 
      LIMIT ? OFFSET ?;
    `;
    
    connection.query(query, [`%${searchTerm}%`, limit, offset], (error, results) => {
      if (error) return callback(error);
      callback(null, results);
    });
  };

  const searchPostsByNick = (searchTerm, page, callback) => {
    const limit = 10;
    const offset = (page - 1) * limit;
    
    const query = `
      SELECT bo_idx, subject, content, regdt 
      FROM HM_BOARD_NOTICE 
      WHERE mem_nick LIKE ? 
      ORDER BY bo_idx DESC 
      LIMIT ? OFFSET ?;
    `;
    
    connection.query(query, [`%${searchTerm}%`, limit, offset], (error, results) => {
      if (error) return callback(error);
      callback(null, results);
    });
  };

  const deleteMultiplePosts = (postIds, deldt, callback) => {
    const query = `
      UPDATE HM_BOARD_NOTICE
      SET deldt = ?
      WHERE bo_idx IN (?)
    `;
  
    connection.query(query, [deldt, postIds], (error, results) => {
      if (error) return callback(error);
      callback(null, results);
    });
  };

module.exports = {
  getNotices,
  getPostNoticeDetail,
  updatePostNoticeDetail,
  searchPostsBySubject,   
  searchPostsByContent,   
  searchPostsByNick,
  deleteMultiplePosts,
};
