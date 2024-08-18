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

const getPostDetail = (bo_idx, callback) => {
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

module.exports = {
  getNotices,
  getPostDetail,
};
