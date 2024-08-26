const connection = require('../config/db');

const getReportsList = (limit, offset, callback) => {
    const query = `
        SELECT 
            mem_idx, mem_id, bo_idx, content, regdt
        FROM 
            HM_BOARD_DECLARE
        ORDER BY 
            regdt DESC
        LIMIT ? OFFSET ?;
    `;

    connection.query(query, [limit, offset], (error, results) => {
        if (error) {
            return callback(error, null);
        }
        callback(null, results);
    });
};

const getReportsCount = (callback) => {
    const query = `
        SELECT 
            COUNT(*) as totalItems 
        FROM 
            HM_BOARD_DECLARE;
    `;

    connection.query(query, (error, results) => {
        if (error) {
            return callback(error, null);
        }
        callback(null, results[0].totalItems);
    });
};

const getReportedPostsCount = (callback) => {
    const query = `
        SELECT 
            d.bo_idx,  -- 'd.'로 명시하여 모호성 제거
            d.content, 
            COUNT(*) AS report_count,
            (SELECT COUNT(*) FROM HM_BOARD_DECLARE WHERE bo_idx = d.bo_idx) AS total_report_count
        FROM 
            HM_BOARD_DECLARE d
        JOIN 
            HM_BOARD b ON d.bo_idx = b.bo_idx
        WHERE 
            b.deldt IS NULL
        GROUP BY 
            d.bo_idx, d.content  -- 'd.'로 명시하여 모호성 제거
        ORDER BY 
            d.bo_idx, report_count DESC;
    `;

    connection.query(query, (error, results) => {
        if (error) {
            return callback(error, null);
        }
        callback(null, results);
    });
};

module.exports = {
    getReportsList,
    getReportsCount,
    getReportedPostsCount,
};
