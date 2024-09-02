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


module.exports = {
    getGoodsByBoIdx,
    getGoodsCountByBoIdx,
    getBadsByBoIdx,
    getBadsCountByBoIdx,
};
