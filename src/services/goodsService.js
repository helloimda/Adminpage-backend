const connection = require('../config/db'); // 데이터베이스 연결 설정 파일

const getGoodsByBoIdx = (bo_idx, limit, offset, callback) => {
    const query = `
        SELECT mbg_idx, mem_idx, bo_idx, content, regdt 
        FROM HM_MEMBER_BOARD_GOOD 
        WHERE bo_idx = ?
        LIMIT ? OFFSET ?;
    `;
    connection.query(query, [bo_idx, limit, offset], (error, results) => {
        if (error) {
            return callback(error, null);
        }
        callback(null, results);
    });
};

const getGoodsCountByBoIdx = (bo_idx, callback) => {
    const query = `
        SELECT COUNT(*) as totalItems 
        FROM HM_MEMBER_BOARD_GOOD 
        WHERE bo_idx = ?;
    `;
    connection.query(query, [bo_idx], (error, results) => {
        if (error) {
            return callback(error, null);
        }
        callback(null, results[0].totalItems);
    });
};

const getBadsByBoIdx = (bo_idx, limit, offset, callback) => {
    const query = `
        SELECT mbb_idx, mem_idx, bo_idx, regdt 
        FROM HM_MEMBER_BOARD_BAD 
        WHERE bo_idx = ?
        LIMIT ? OFFSET ?;
    `;
    connection.query(query, [bo_idx, limit, offset], (error, results) => {
        if (error) {
            return callback(error, null);
        }
        callback(null, results);
    });
};

const getBadsCountByBoIdx = (bo_idx, callback) => {
    const query = `
        SELECT COUNT(*) as totalItems 
        FROM HM_MEMBER_BOARD_BAD 
        WHERE bo_idx = ?;
    `;
    connection.query(query, [bo_idx], (error, results) => {
        if (error) {
            return callback(error, null);
        }
        callback(null, results[0].totalItems);
    });
};

const getGoodsCommentsByBoIdxCmtIdx = (bo_idx, cmt_idx, limit, offset, callback) => {
    const query = `
        SELECT mbg_idx, mem_idx, bo_idx, cmt_idx, regdt
        FROM HM_MEMBER_BOARD_COMMENT_GOOD
        WHERE bo_idx = ? AND cmt_idx = ?
        ORDER BY regdt DESC
        LIMIT ? OFFSET ?;
    `;
    connection.query(query, [bo_idx, cmt_idx, limit, offset], (error, results) => {
        if (error) {
            return callback(error, null);
        }
        callback(null, results);
    });
};

const getGoodsCommentsCountByBoIdxCmtIdx = (bo_idx, cmt_idx, callback) => {
    const query = `
        SELECT COUNT(*) as count
        FROM HM_MEMBER_BOARD_COMMENT_GOOD
        WHERE bo_idx = ? AND cmt_idx = ?;
    `;
    connection.query(query, [bo_idx, cmt_idx], (error, results) => {
        if (error) {
            return callback(error, null);
        }
        callback(null, results[0].count);
    });
};

const getGoodGoodsByGdIdx = (gd_idx, limit, offset, callback) => {
    const query = `
        SELECT gdg_idx, mem_idx, gd_idx, regdt
        FROM HM_MEMBER_GOODS_GOOD
        WHERE gd_idx = ?
        ORDER BY regdt DESC
        LIMIT ? OFFSET ?;
    `;
    connection.query(query, [gd_idx, limit, offset], (error, results) => {
        if (error) {
            return callback(error, null);
        }
        callback(null, results);
    });
};

const getGoodGoodsCountByGdIdx = (gd_idx, callback) => {
    const query = `
        SELECT COUNT(*) as count
        FROM HM_MEMBER_GOODS_GOOD
        WHERE gd_idx = ?;
    `;
    connection.query(query, [gd_idx], (error, results) => {
        if (error) {
            return callback(error, null);
        }
        callback(null, results[0].count);
    });
};

const getUserByMemIdx = (mem_idx, callback) => {
    const query = `
        SELECT mem_id, mem_nick
        FROM HM_MEMBER
        WHERE mem_idx = ?;
    `;
    connection.query(query, [mem_idx], (error, results) => {
        if (error) {
            return callback(error, null);
        }
        if (results.length === 0) {
            return callback(null, null); // 해당 mem_idx에 대한 데이터가 없음
        }
        callback(null, results[0]);
    });
};

module.exports = {
    getGoodsByBoIdx,
    getGoodsCountByBoIdx,
    getBadsByBoIdx,
    getBadsCountByBoIdx,
    getGoodsCommentsByBoIdxCmtIdx,
    getGoodsCommentsCountByBoIdxCmtIdx,
    getGoodGoodsByGdIdx,
    getGoodGoodsCountByGdIdx,
    getUserByMemIdx
};
