const connection = require('../config/db');

const getReportsList = (limit, offset, callback) => {
    const query = `
        SELECT 
            d.mem_idx, d.mem_id, d.bo_idx, d.content, d.regdt
        FROM 
            HM_BOARD_DECLARE d
        JOIN 
            HM_BOARD b ON d.bo_idx = b.bo_idx
        WHERE 
            b.deldt IS NULL
        ORDER BY 
            d.regdt DESC
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

const getMemberReportsList = (limit, offset, callback) => {
    const query = `
        SELECT 
            d.mem_idx, d.mem_id, d.gd_idx, d.content, d.regdt
        FROM 
            HM_MEMBER_GOODS_DECLARE d
        JOIN 
            HM_MEMBER m ON d.mem_id = m.mem_id
        WHERE 
            m.deldt IS NULL
        ORDER BY 
            d.regdt DESC
        LIMIT ? OFFSET ?;
    `;

    connection.query(query, [limit, offset], (error, results) => {
        if (error) {
            return callback(error, null);
        }
        callback(null, results);
    });
};

const getMemberReportsCount = (callback) => {
    const query = `
        SELECT 
            COUNT(*) as totalItems
        FROM 
            HM_MEMBER_GOODS_DECLARE d
        JOIN 
            HM_MEMBER m ON d.mem_id = m.mem_id
        WHERE 
            m.deldt IS NULL;
    `;

    connection.query(query, (error, results) => {
        if (error) {
            return callback(error, null);
        }
        callback(null, results[0].totalItems);
    });
};

const countMemberReports = (callback) => {
    const query = `
        SELECT 
            d.gd_idx,
            d.content,
            COUNT(*) AS report_count,
            COUNT(*) OVER (PARTITION BY d.gd_idx) AS total_report_count
        FROM 
            HM_MEMBER_GOODS_DECLARE d
        JOIN 
            HM_MEMBER m ON d.mem_idx = m.mem_idx
        WHERE 
            m.deldt IS NULL
        GROUP BY 
            d.gd_idx, d.content
        ORDER BY 
            d.gd_idx, report_count DESC;
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
    getMemberReportsList,
    getMemberReportsCount,
    countMemberReports,
};
