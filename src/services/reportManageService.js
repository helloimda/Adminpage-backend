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
            m.mem_idx, m.mem_id, COUNT(d.content) AS report_count
        FROM 
            HM_MEMBER m
        JOIN 
            HM_BOARD_DECLARE d ON m.mem_idx = d.mem_idx
        WHERE 
            m.deldt IS NULL
        GROUP BY 
            m.mem_idx, m.mem_id
        ORDER BY 
            report_count DESC;
    `;

    connection.query(query, (error, results) => {
        if (error) {
            return callback(error, null);
        }

        const totalReportsQuery = `
            SELECT 
                COUNT(d.content) AS total_reports
            FROM 
                HM_MEMBER m
            JOIN 
                HM_BOARD_DECLARE d ON m.mem_idx = d.mem_idx
            WHERE 
                m.deldt IS NULL;
        `;

        connection.query(totalReportsQuery, (totalError, totalResults) => {
            if (totalError) {
                return callback(totalError, null);
            }

            callback(null, {
                reportsByUser: results,
                totalReports: totalResults[0].total_reports,
            });
        });
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
