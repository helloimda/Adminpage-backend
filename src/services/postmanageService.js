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
      SET deldt = ?
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
      WHERE pidx = ?
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
      SET deldt = ?
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
          WHERE bof_idx = ?
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
      SET deldt = ?
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
  };