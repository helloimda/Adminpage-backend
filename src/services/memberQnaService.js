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

const postQnaAnswer = (meq_idx, rsubject, rcontent, callback) => {
    const query = `
        UPDATE HM_MEMBER_QNA
        SET rsubject = ?, rcontent = ?, isresponse = 'Y', rdt = NOW()
        WHERE meq_idx = ? AND deldt IS NULL;
    `;

    connection.query(query, [rsubject, rcontent, meq_idx], (error, results) => {
        if (error) {
            return callback(error, null);
        }
        callback(null, results);
    });
};

const getNotRespondedQnaPosts = (limit, offset, callback) => {
    const query = `
        SELECT 
            meq_idx, mem_idx, mem_id, subject, content, qtype, reason, isadult, 
            tmem_idx, tmem_id, rsubject, rcontent, rdt, vdt, cnt_img, cnt_view, 
            isview, isresponse, regdt
        FROM 
            HM_MEMBER_QNA 
        WHERE 
            isresponse = 'N' AND deldt IS NULL
        ORDER BY 
            regdt DESC
        LIMIT ? OFFSET ?;
    `;

    connection.query(query, [limit, offset], (error, results) => {
        if (error) {
            return callback(error, null, null);
        }

        // 전체 게시글 수를 조회
        const countQuery = `
            SELECT COUNT(*) as total 
            FROM HM_MEMBER_QNA 
            WHERE isresponse = 'N' AND deldt IS NULL;
        `;

        connection.query(countQuery, (countError, countResults) => {
            if (countError) {
                return callback(countError, null, null);
            }
            const total = countResults[0].total;
            callback(null, results, total);
        });
    });
};

const getRespondedQnaPosts = (limit, offset, callback) => {
    const query = `
        SELECT 
            meq_idx, mem_idx, mem_id, subject, content, qtype, reason, isadult, 
            tmem_idx, tmem_id, rsubject, rcontent, rdt, vdt, cnt_img, cnt_view, 
            isview, isresponse, regdt 
        FROM 
            HM_MEMBER_QNA 
        WHERE 
            isresponse = 'Y' AND deldt IS NULL
        ORDER BY 
            regdt DESC
        LIMIT ? OFFSET ?;
    `;

    connection.query(query, [limit, offset], (error, results) => {
        if (error) {
            return callback(error, null, null);
        }

        // 전체 답변된 게시글 수를 조회
        const countQuery = `
            SELECT COUNT(*) as total 
            FROM HM_MEMBER_QNA 
            WHERE isresponse = 'Y' AND deldt IS NULL;
        `;

        connection.query(countQuery, (countError, countResults) => {
            if (countError) {
                return callback(countError, null, null);
            }
            const total = countResults[0].total;
            callback(null, results, total);
        });
    });
};

const getQnaDetail = (meq_idx, callback) => {
    const query = `
        SELECT 
            meq_idx, mem_idx, mem_id, subject, content, qtype, reason, isadult, 
            tmem_idx, tmem_id, rsubject, rcontent, rdt, vdt, cnt_img, cnt_view, 
            isview, isresponse, regdt
        FROM 
            HM_MEMBER_QNA 
        WHERE 
            meq_idx = ? AND deldt IS NULL;
    `;

    connection.query(query, [meq_idx], (error, results) => {
        if (error) {
            return callback(error, null);
        }
        if (results.length === 0) {
            return callback(new Error('해당 Q&A 게시글을 찾을 수 없습니다.'), null);
        }
        callback(null, results[0]);
    });
};

const getQnaImages = (meq_idx, callback) => {
    const query = `
        SELECT 
            file_name, file_url
        FROM 
            HM_MEMBER_QNA_IMG
        WHERE 
            meq_idx = ? AND deldt IS NULL;
    `;

    connection.query(query, [meq_idx], (error, results) => {
        if (error) {
            return callback(error, null);
        }
        callback(null, results);
    });
};


module.exports = {
    getQnaPosts,
    getQnaPostsCount,
    postQnaAnswer,
    getNotRespondedQnaPosts,
    getRespondedQnaPosts,
    getQnaImages,
    getQnaDetail,
};
