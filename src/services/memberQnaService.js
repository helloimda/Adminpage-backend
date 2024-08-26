const connection = require('../config/db');

const getQnaPosts = (limit, offset, callback) => {
    const query = `
        SELECT 
            meq_idx, mem_idx, mem_id, subject, content, qtype, reason, isadult, 
            tmem_idx, tmem_id, rsubject, rcontent, rdt, vdt, cnt_img, cnt_view, 
            isview, isresponse, regdt
        FROM 
            HM_MEMBER_QNA 
        WHERE 
            deldt IS NULL
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

const getQnaPostsCount = (callback) => {
    const query = `
        SELECT COUNT(*) AS total FROM HM_MEMBER_QNA WHERE deldt IS NULL;
    `;
    connection.query(query, (error, results) => {
        if (error) {
            return callback(error, null);
        }
        callback(null, results[0].total);
    });
};

module.exports = {
    getQnaPosts,
    getQnaPostsCount,
};
