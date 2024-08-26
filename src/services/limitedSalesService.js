const connection = require('../config/db');

const getLimitedSalesList = (limit, offset, callback) => {
    const query = `
        SELECT 
            gd_idx, cg_idx, ca_idx, brand_idx, brand_str, btype, mem_idx, mem_id, 
            gd_name, gd_num, gd_status, gd_view, isware, buy_price, price, 
            buy_place, buy_year, buy_month, condition_goods, condition_state, 
            isbox, iswarranty, isetc, component, content, isoffer, isexchange, 
            proposal, istemp, cnt_view, cnt_star, avg_star, cnt_good, cnt_bad, 
            cnt_bookmark, cnt_comment, cnt_img, cnt_pull, cnt_noteGroup, gddt, regdt 
        FROM 
            HM_GOODS 
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

const getLimitedSalesCount = (callback) => {
    const query = `
        SELECT 
            COUNT(*) as totalItems 
        FROM 
            HM_GOODS 
        WHERE 
            deldt IS NULL;
    `;

    connection.query(query, (error, results) => {
        if (error) {
            return callback(error, null);
        }
        callback(null, results[0].totalItems);
    });
};

module.exports = {
    getLimitedSalesList,
    getLimitedSalesCount,
};
