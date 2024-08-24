const connection = require('../config/db');

const getNotices = (page, limit, callback) => {
  const offset = (page - 1) * limit;

  const query = `
    SELECT bo_idx, mem_id, subject, cnt_view, regdt
    FROM HM_BOARD_NOTICE
    WHERE deldt IS NULL
    ORDER BY regdt DESC
    LIMIT ? OFFSET ?;
  `;

  connection.query(query, [limit, offset], (error, results) => {
    if (error) return callback(error);
    callback(null, results);
  });
};

const getNoticesCount = (callback) => {
  const query = `
    SELECT COUNT(*) AS totalNotices
    FROM HM_BOARD_NOTICE
    WHERE deldt IS NULL;
  `;

  connection.query(query, (error, results) => {
    if (error) return callback(error);
    callback(null, results[0].totalNotices);
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
        WHERE bo_idx = ? AND deldt IS NULL
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
    SELECT bo_idx, mem_id, subject, cnt_view, cnt_star, cnt_good, cnt_bed, cnt_comment, regdt
    FROM HM_BOARD_NOTICE 
    WHERE subject LIKE ? 
    AND deldt IS NULL
    ORDER BY bo_idx DESC 
    LIMIT ? OFFSET ?;
  `;
  
  connection.query(query, [`%${searchTerm}%`, limit, offset], (error, results) => {
    if (error) return callback(error);
    callback(null, results);
  });
};

const getTotalCountBySubject = (searchTerm, callback) => {
  const query = `
    SELECT COUNT(*) AS total 
    FROM HM_BOARD_NOTICE 
    WHERE subject LIKE ? 
    AND deldt IS NULL
  `;
  
  connection.query(query, [`%${searchTerm}%`], (error, results) => {
    if (error) return callback(error);
    callback(null, results[0].total);
  });
};

const searchPostsByContent = (searchTerm, page, callback) => {
  const limit = 10;
  const offset = (page - 1) * limit;
  
  const query = `
    SELECT bo_idx, mem_id, subject, cnt_view, cnt_star, cnt_good, cnt_bed, cnt_comment, regdt 
    FROM HM_BOARD_NOTICE 
    WHERE content LIKE ? 
    AND deldt IS NULL
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
    SELECT bo_idx, mem_id, subject, cnt_view, cnt_star, cnt_good, cnt_bed, cnt_comment, regdt 
    FROM HM_BOARD_NOTICE 
    WHERE mem_id LIKE ? 
    AND deldt IS NULL
    ORDER BY bo_idx DESC 
    LIMIT ? OFFSET ?;
  `;
  
  connection.query(query, [`%${searchTerm}%`, limit, offset], (error, results) => {
    if (error) return callback(error);
    callback(null, results);
  });
};


  const deletePost = (postId, deldt, callback) => {
    console.log(`Deleting post with ID: ${postId}, deldt: ${deldt}`); // 로그 추가

    const query = `
      UPDATE HM_BOARD_NOTICE
      SET deldt = ?, isdel = 'Y'
      WHERE bo_idx = ?
    `;

    connection.query(query, [deldt, postId], (error, results) => {
        if (error) return callback(error);
        callback(null, results);
    });
};



const getGeneralPosts = (page, limit, callback) => {
  const offset = (page - 1) * limit;

  const query = `
      SELECT bo_idx, mem_id, subject, cnt_view, cnt_star, cnt_good, cnt_bad, cnt_comment, regdt
      FROM HM_BOARD 
      WHERE deldt IS NULL
      ORDER BY regdt DESC 
      LIMIT ? OFFSET ?;
  `;

  connection.query(query, [limit, offset], (error, results) => {
      if (error) return callback(error);
      callback(null, results);
  });
};
const getGeneralPostsCount = (callback) => {
  const query = `
      SELECT COUNT(*) AS total
      FROM HM_BOARD 
      WHERE deldt IS NULL;
  `;

  connection.query(query, (error, results) => {
      if (error) return callback(error);
      const totalPosts = results[0].total;
      callback(null, totalPosts);
  });
};
const getGeneralPostDetail = (bo_idx, callback) => {
  const query = `
    SELECT bo_idx, mem_idx, mem_id, ca_idx, cd_subtag, brand_idx, cal_idx, subject, content, link, tags, newsdt, cnt_view, cnt_star, avg_star, cnt_good, cnt_bad, cnt_comment, cnt_bookmark, cnt_img, istemp, popdt, regdt
    FROM HM_BOARD
    WHERE bo_idx = ? AND deldt IS NULL
  `;

  connection.query(query, [bo_idx], (error, results) => {
    if (error) return callback(error);
    if (results.length === 0) return callback(new Error('해당 게시글을 찾을 수 없습니다.'));

    const postDetail = results[0];

    // 이미지를 가져오는 쿼리
    const imgQuery = `
      SELECT img_idx, file_name, file_url
      FROM HM_IMG
      WHERE pidx = ? AND deldt IS NULL
    `;

    connection.query(imgQuery, [bo_idx], (imgError, imgResults) => {
      if (imgError) return callback(imgError);

      // 이미지가 있는 경우 postDetail에 images 배열로 추가
      postDetail.images = imgResults.length > 0 ? imgResults : [];

      callback(null, postDetail);
    });
  });
};


  
  const deleteGeneralPost = (postId, deldt, callback) => {
    const query = `
      UPDATE HM_BOARD
      SET deldt = ?, isdel = 'Y'
      WHERE bo_idx = ? AND deldt IS NULL
    `;
  
    connection.query(query, [deldt, postId], (error, results) => {
        if (error) return callback(error);
        callback(null, results);
    });
};

  
const searchGeneralPostsBySubject = (searchTerm, page, limit, callback) => {
  const offset = (page - 1) * limit;

  const query = `
    SELECT bo_idx, mem_id, subject, cnt_view, cnt_star, cnt_good, cnt_bad, cnt_comment, regdt
    FROM HM_BOARD
    WHERE subject LIKE ? AND deldt IS NULL
    ORDER BY regdt DESC
    LIMIT ? OFFSET ?;
  `;

  connection.query(query, [`%${searchTerm}%`, limit, offset], (error, results) => {
    if (error) return callback(error);
    callback(null, results);
  });
};
const getGeneralPostsCountBySubject = (searchTerm, callback) => {
  const query = `
      SELECT COUNT(*) AS total
      FROM HM_BOARD
      WHERE subject LIKE ? AND deldt IS NULL;
  `;

  connection.query(query, [`%${searchTerm}%`], (error, results) => {
      if (error) return callback(error);
      callback(null, results[0].total);
  });
};

  
const searchGeneralPostsByContent = (searchTerm, page, limit, callback) => {
  const offset = (page - 1) * limit;

  const query = `
    SELECT bo_idx, mem_id, subject, cnt_view, cnt_star, cnt_good, cnt_bad, cnt_comment, regdt 
    FROM HM_BOARD 
    WHERE content LIKE ? AND deldt IS NULL
    ORDER BY bo_idx DESC 
    LIMIT ? OFFSET ?;
  `;

  connection.query(query, [`%${searchTerm}%`, limit, offset], (error, results) => {
      if (error) return callback(error);
      callback(null, results);
  });
};


  
const getGeneralPostsCountByContent = (searchTerm, callback) => {
  const query = `
    SELECT COUNT(*) AS total 
    FROM HM_BOARD 
    WHERE content LIKE ? AND deldt IS NULL
  `;

  connection.query(query, [`%${searchTerm}%`], (error, results) => {
      if (error) return callback(error);
      callback(null, results[0].total);
  });
};
const searchGeneralPostsByNick = (searchTerm, page, limit, callback) => {
  const offset = (page - 1) * limit;

  const query = `
    SELECT b.bo_idx, b.mem_id, m.mem_nick, b.subject, b.cnt_view, b.cnt_star, b.cnt_good, b.cnt_bad, b.cnt_comment, b.regdt
    FROM HM_BOARD b
    JOIN HM_MEMBER m ON b.mem_id = m.mem_id
    WHERE m.mem_nick LIKE ? AND b.deldt IS NULL
    ORDER BY b.bo_idx DESC 
    LIMIT ? OFFSET ?;
  `;

  connection.query(query, [`%${searchTerm}%`, limit, offset], (error, results) => {
      if (error) return callback(error);
      callback(null, results);
  });
};


const getFraudPostsCount = (callback) => {
  const query = `
      SELECT COUNT(*) AS total
      FROM HM_BOARD_FRAUD
      WHERE deldt IS NULL;
  `;

  connection.query(query, (error, results) => {
      if (error) return callback(error);
      callback(null, results[0].total);
  });
};
const getFraudPosts = (page, limit, callback) => {
  const offset = (page - 1) * limit;

  const query = `
      SELECT bof_idx, mem_id, bof_type, gd_name, damage_dt, damage_type, cnt_view, regdt
      FROM HM_BOARD_FRAUD
      WHERE deldt IS NULL
      ORDER BY regdt DESC
      LIMIT ? OFFSET ?;
  `;

  connection.query(query, [limit, offset], (error, results) => {
      if (error) return callback(error);
      callback(null, results);
  });
};
  
  const getFraudPostDetail = (bof_idx, callback) => {
    const query = `
      SELECT bof_idx, mem_id, bof_type, gd_name, content, account_num, account_bank, msg_type, 
             msg_id, damage_amount, damage_dt, damage_type, hp, sex, email, url, cnt_img, 
             cnt_view, regdt
      FROM HM_BOARD_FRAUD
      WHERE bof_idx = ? AND deldt IS NULL
    `;
  
    connection.query(query, [bof_idx], (error, results) => {
      if (error) return callback(error);
      if (results.length === 0) return callback(new Error('해당 게시글을 찾을 수 없습니다.'));
      
      const postDetail = results[0];
  
      // cnt_img가 1개 이상이면 이미지 정보 조회
      if (postDetail.cnt_img > 0) {
        const imageQuery = `
          SELECT file_name, file_url
          FROM HM_BOARD_FRAUD_IMG
          WHERE bof_idx = ? AND deldt IS NULL
        `;
        
        connection.query(imageQuery, [bof_idx], (imgError, imgResults) => {
          if (imgError) return callback(imgError);
          
          // 이미지 정보를 postDetail에 추가
          postDetail.images = imgResults;
          
          callback(null, postDetail);
        });
      } else {
        // 이미지가 없는 경우 바로 결과 반환
        callback(null, postDetail);
      }
    });
  };
  
  
  
  const deleteFraudPost = (postId, deldt, callback) => {
    const query = `
      UPDATE HM_BOARD_FRAUD
      SET deldt = ?, isdel = 'Y'
      WHERE bof_idx = ? AND deldt IS NULL
    `;
  
    connection.query(query, [deldt, postId], (error, results) => {
      if (error) return callback(error);
      callback(null, results);
    });
  };
  
  const searchFraudPostsByGoodName = (searchTerm, page, limit, callback) => {
    const offset = (page - 1) * limit;

    const query = `
        SELECT bof_idx, mem_id, bof_type, gd_name, damage_dt, damage_type, cnt_view, regdt
        FROM HM_BOARD_FRAUD 
        WHERE gd_name LIKE ? AND deldt IS NULL
        ORDER BY bof_idx DESC 
        LIMIT ? OFFSET ?;
    `;

    connection.query(query, [`%${searchTerm}%`, limit, offset], (error, results) => {
        if (error) return callback(error);
        callback(null, results);
    });
};

  
  const searchFraudPostsByMemId = (searchTerm, page, limit, callback) => {
    const offset = (page - 1) * limit;

    console.log(`Searching for mem_id like: ${searchTerm}`);
    console.log(`Page: ${page}, Limit: ${limit}, Offset: ${offset}`);

    const query = `
        SELECT bof_idx, mem_id, bof_type, gd_name, damage_dt, damage_type, cnt_view, regdt
        FROM HM_BOARD_FRAUD 
        WHERE mem_id LIKE ? AND deldt IS NULL
        ORDER BY bof_idx DESC 
        LIMIT ? OFFSET ?;
    `;

    connection.query(query, [`%${searchTerm}%`, limit, offset], (error, results) => {
        if (error) {
            console.error('Database query error:', error);
            return callback(error);
        }
        console.log('Query results:', results);
        callback(null, results);
    });
};

  const getFraudPostsCountByMemId = (searchTerm, callback) => {
    const query = `
      SELECT COUNT(*) AS total
      FROM HM_BOARD_FRAUD 
      WHERE mem_id LIKE ? AND deldt IS NULL;
    `;
  
    connection.query(query, [`%${searchTerm}%`], (error, results) => {
      if (error) return callback(error);
      callback(null, results[0].total);
    });
  };
  const getCommentsByPostId = (bo_idx, callback) => {
    const query = `
        SELECT cmt_idx, bo_idx, pcmt_idx, mem_idx, mem_id, content, isbest, isAnonymous, cnt_star, cnt_good, cnt_bad, onum, regdt
        FROM HM_BOARD_COMMENT
        WHERE bo_idx = ? AND deldt IS NULL
        ORDER BY regdt ASC
    `;

    connection.query(query, [bo_idx], (error, results) => {
        if (error) return callback(error);
        callback(null, results);
    });
};
const getFraudCommentsByPostId = (bof_idx, callback) => {
  const query = `
      SELECT bofc_idx, bof_idx, pbofc_idx, mem_idx, mem_id, content, isAnonymous, regdt
      FROM HM_BOARD_FRAUD_COMMENT
      WHERE bof_idx = ? AND deldt IS NULL
      ORDER BY regdt ASC
  `;

  connection.query(query, [bof_idx], (error, results) => {
      if (error) return callback(error);
      callback(null, results);
  });
};

const deleteComment = (cmt_idx, deldt, callback) => {
  const query = `
      UPDATE HM_BOARD_COMMENT
      SET isdel = 'Y', deldt = ?
      WHERE cmt_idx = ? AND isdel = 'N'
  `;

  connection.query(query, [deldt, cmt_idx], (error, results) => {
      if (error) return callback(error);
      callback(null, results);
  });
};

const deleteFraudComment = (bofc_idx, deldt, callback) => {
  const query = `
      UPDATE HM_BOARD_FRAUD_COMMENT
      SET isdel = 'Y', deldt = ?
      WHERE bofc_idx = ? AND isdel = 'N'
  `;

  connection.query(query, [deldt, bofc_idx], (error, results) => {
      if (error) return callback(error);
      callback(null, results);
  });
};

const createNoticePost = (mem_idx, mem_id, subject, content, tags, istemp, regdt, callback) => {
  // bo_idx의 최대값을 가져와서 +1한 값을 사용
  const queryGetMaxIdx = 'SELECT MAX(bo_idx) AS maxBoIdx FROM HM_BOARD_NOTICE';

  connection.query(queryGetMaxIdx, (error, results) => {
      if (error) return callback(error);

      const newBoIdx = results[0].maxBoIdx ? results[0].maxBoIdx + 1 : 1;

      const queryInsert = `
          INSERT INTO HM_BOARD_NOTICE (bo_idx, mem_idx, mem_id, subject, content, tags, istemp, regdt, cnt_view, isdel)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 'N')
      `;

      const values = [newBoIdx, mem_idx, mem_id, subject, content, tags, istemp, regdt];

      connection.query(queryInsert, values, (error, results) => {
          if (error) return callback(error);
          callback(null, results);
      });
  });
};

const deleteNoticeImage = (bo_idx, img_idx, deldt, callback) => {
  const query = `
      UPDATE HM_BOARD_NOTICE_IMG
      SET isdel = 'Y', deldt = ?
      WHERE bo_idx = ? AND img_idx = ? AND isdel = 'N'
  `;

  connection.query(query, [deldt, bo_idx, img_idx], (error, results) => {
      if (error) return callback(error);
      if (results.affectedRows === 0) return callback(new Error('이미지를 찾을 수 없거나 이미 삭제되었습니다.'));
      callback(null, results);
  });
};


const getCommentsWithPagination = (limit, offset, callback) => {
  const query = `
      SELECT cmt_idx, bo_idx, pcmt_idx, mem_idx, mem_id, ca_idx, brand_idx, content, isbest, 
             isAnonymous, cnt_star, cnt_good, cnt_bad, istemp, onum, regdt
      FROM HM_BOARD_COMMENT
      WHERE deldt IS NULL
      ORDER BY regdt DESC
      LIMIT ? OFFSET ?;
  `;

  connection.query(query, [limit, offset], (error, results) => {
      if (error) return callback(error);
      callback(null, results);
  });
};

const getCommentCount = (callback) => {
  const query = `
      SELECT COUNT(*) AS totalComments
      FROM HM_BOARD_COMMENT
      WHERE deldt IS NULL;
  `;

  connection.query(query, (error, results) => {
      if (error) return callback(error);
      callback(null, results[0].totalComments);
  });
};

const getCommentsByPostWithPagination = (bo_idx, limit, offset, callback) => {
  const query = `
      SELECT cmt_idx, bo_idx, pcmt_idx, mem_idx, mem_id, ca_idx, brand_idx, content, isbest, 
             isAnonymous, cnt_star, cnt_good, cnt_bad, istemp, onum, regdt
      FROM HM_BOARD_COMMENT
      WHERE bo_idx = ? AND deldt IS NULL
      ORDER BY regdt DESC
      LIMIT ? OFFSET ?;
  `;

  connection.query(query, [bo_idx, limit, offset], (error, results) => {
      if (error) return callback(error);
      callback(null, results);
  });
};

const getCommentCountByPost = (bo_idx, callback) => {
  const query = `
      SELECT COUNT(*) AS totalComments
      FROM HM_BOARD_COMMENT
      WHERE bo_idx = ? AND deldt IS NULL;
  `;

  connection.query(query, [bo_idx], (error, results) => {
      if (error) return callback(error);
      callback(null, results[0].totalComments);
  });
};

const getFraudComments = (offset, limit, callback) => {
  const query = `
      SELECT bofc_idx, bof_idx, pbofc_idx, mem_idx, mem_id, content, isAnonymous, regdt
      FROM HM_BOARD_FRAUD_COMMENT
      WHERE deldt IS NULL
      ORDER BY bofc_idx DESC
      LIMIT ? OFFSET ?;
  `;

  connection.query(query, [limit, offset], (error, results) => {
      if (error) return callback(error);
      callback(null, results);
  });
};

const getFraudCommentsCount = (callback) => {
  const query = `
      SELECT COUNT(*) AS totalComments
      FROM HM_BOARD_FRAUD_COMMENT
      WHERE deldt IS NULL;
  `;

  connection.query(query, (error, results) => {
      if (error) return callback(error);
      callback(null, results[0].totalComments);
  });
};

const getFraudCommentsByPost = (bof_idx, offset, limit, callback) => {
  const query = `
      SELECT bofc_idx, bof_idx, pbofc_idx, mem_idx, mem_id, content, isAnonymous, regdt
      FROM HM_BOARD_FRAUD_COMMENT
      WHERE bof_idx = ? AND deldt IS NULL
      ORDER BY bofc_idx DESC
      LIMIT ? OFFSET ?;
  `;

  connection.query(query, [bof_idx, limit, offset], (error, results) => {
      if (error) return callback(error);
      callback(null, results);
  });
};

const getFraudCommentsCountByPost = (bof_idx, callback) => {
  const query = `
      SELECT COUNT(*) AS totalComments
      FROM HM_BOARD_FRAUD_COMMENT
      WHERE bof_idx = ? AND deldt IS NULL;
  `;

  connection.query(query, [bof_idx], (error, results) => {
      if (error) return callback(error);
      callback(null, results[0].totalComments);
  });
};

const searchCommentsByNickname = (mem_id, limit, offset, callback) => {
  const query = `
    SELECT cmt_idx, bo_idx, pcmt_idx, mem_idx, mem_id, ca_idx, brand_idx, content, isbest, isAnonymous, cnt_star, cnt_good, cnt_bad, istemp, onum, regdt
    FROM HM_BOARD_COMMENT
    WHERE mem_id LIKE ? AND deldt IS NULL
    ORDER BY regdt DESC
    LIMIT ? OFFSET ?;
  `;

  connection.query(query, [`%${mem_id}%`, limit, offset], (error, results) => {
    if (error) return callback(error);
    callback(null, results);
  });
};

const getCommentsCountByNickname = (mem_id, callback) => {
  const query = `
    SELECT COUNT(*) AS totalComments
    FROM HM_BOARD_COMMENT
    WHERE mem_id LIKE ? AND deldt IS NULL;
  `;

  connection.query(query, [`%${mem_id}%`], (error, results) => {
    if (error) return callback(error);
    callback(null, results[0].totalComments);
  });
};

const searchCommentsByContent = (content, limit, offset, callback) => {
  const query = `
    SELECT cmt_idx, bo_idx, pcmt_idx, mem_idx, mem_id, ca_idx, brand_idx, content, isbest, isAnonymous, cnt_star, cnt_good, cnt_bad, istemp, onum, regdt
    FROM HM_BOARD_COMMENT
    WHERE content LIKE ? AND deldt IS NULL
    ORDER BY regdt DESC
    LIMIT ? OFFSET ?;
  `;

  connection.query(query, [`%${content}%`, limit, offset], (error, results) => {
    if (error) return callback(error);
    callback(null, results);
  });
};

const getCommentsCountByContent = (content, callback) => {
  const query = `
    SELECT COUNT(*) AS totalComments
    FROM HM_BOARD_COMMENT
    WHERE content LIKE ? AND deldt IS NULL;
  `;

  connection.query(query, [`%${content}%`], (error, results) => {
    if (error) return callback(error);
    callback(null, results[0].totalComments);
  });
};

const searchFraudCommentsByNickname = (mem_id, limit, offset, callback) => {
  const query = `
    SELECT bofc_idx, bof_idx, pbofc_idx, mem_idx, mem_id, content, isAnonymous, regdt
    FROM HM_BOARD_FRAUD_COMMENT
    WHERE mem_id LIKE ? AND deldt IS NULL
    ORDER BY regdt DESC
    LIMIT ? OFFSET ?;
  `;

  connection.query(query, [`%${mem_id}%`, limit, offset], (error, results) => {
    if (error) return callback(error);
    callback(null, results);
  });
};

const getFraudCommentsCountByNickname = (mem_id, callback) => {
  const query = `
    SELECT COUNT(*) AS totalComments
    FROM HM_BOARD_FRAUD_COMMENT
    WHERE mem_id LIKE ? AND deldt IS NULL;
  `;

  connection.query(query, [`%${mem_id}%`], (error, results) => {
    if (error) return callback(error);
    callback(null, results[0].totalComments);
  });
};

const searchFraudCommentsByContent = (content, limit, offset, callback) => {
  const query = `
    SELECT bofc_idx, bof_idx, pbofc_idx, mem_idx, mem_id, content, isAnonymous, regdt
    FROM HM_BOARD_FRAUD_COMMENT
    WHERE content LIKE ? AND deldt IS NULL
    ORDER BY regdt DESC
    LIMIT ? OFFSET ?;
  `;

  connection.query(query, [`%${content}%`, limit, offset], (error, results) => {
    if (error) return callback(error);
    callback(null, results);
  });
};

const getFraudCommentsCountByContent = (content, callback) => {
  const query = `
    SELECT COUNT(*) AS total
    FROM HM_BOARD_FRAUD_COMMENT
    WHERE content LIKE ? AND deldt IS NULL;
  `;

  connection.query(query, [`%${content}%`], (error, results) => {
    if (error) return callback(error);
    callback(null, results[0].total);
  });
};

  module.exports = {
    getNotices,
    getNoticesCount,
    getPostNoticeDetail,
    updatePostNoticeDetail,
    searchPostsBySubject,
    getTotalCountBySubject,
    searchPostsByContent,
    searchPostsByNick,
    deletePost,
    getGeneralPosts,
    getGeneralPostsCount,
    getGeneralPostDetail,          
    deleteGeneralPost,  
    searchGeneralPostsBySubject, 
    getGeneralPostsCountBySubject,
    getGeneralPostsCountByContent,
    searchGeneralPostsByContent, 
    searchGeneralPostsByNick,   
    getFraudPosts,
    getFraudPostsCount,
    getFraudPostDetail,           
    deleteFraudPost,  
    searchFraudPostsByMemId,  
    getFraudPostsCountByMemId,  
    searchFraudPostsByGoodName, 
    getCommentsByPostId,
    getFraudCommentsByPostId,
    deleteComment,
    deleteFraudComment,
    createNoticePost,
    deleteNoticeImage,
    getCommentsWithPagination,
    getCommentCount,
    getCommentsByPostWithPagination,
    getCommentCountByPost,
    getFraudComments,
    getFraudCommentsCount,
    getFraudCommentsByPost,
    getFraudCommentsCountByPost,
    searchCommentsByNickname,
    getCommentsCountByNickname,
    searchCommentsByContent,
    getCommentsCountByContent,
    searchFraudCommentsByNickname,
    getFraudCommentsCountByNickname,
    searchFraudCommentsByContent,
    getFraudCommentsCountByContent,
  };