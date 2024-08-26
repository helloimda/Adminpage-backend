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

    connection.query(query, [limit, offset], (error, salesResults) => {
        if (error) {
            return callback(error, null);
        }

        // 모든 판매 상품에 대해 이미지 로딩
        const salesWithImages = salesResults.map(sale => {
            return new Promise((resolve, reject) => {
                const imgQuery = `
                    SELECT file_name, file_url
                    FROM HM_IMG
                    WHERE pidx = ? AND ttype = 'GOODS' AND deldt IS NULL;
                `;

                connection.query(imgQuery, [sale.gd_idx], (imgError, imgResults) => {
                    if (imgError) {
                        return reject(imgError);
                    }
                    sale.images = imgResults;
                    resolve(sale);
                });
            });
        });

        // 모든 이미지 로딩 완료 후 결과 반환
        Promise.all(salesWithImages)
            .then(results => callback(null, results))
            .catch(error => callback(error, null));
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

const getLimitedSalesByCategory = (brand, type, limit, offset, callback) => {
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
            brand_str = ? AND btype = ? AND deldt IS NULL 
        ORDER BY 
            regdt DESC 
        LIMIT ? OFFSET ?;
    `;

    connection.query(query, [brand, type, limit, offset], (error, results) => {
        if (error) {
            return callback(error, null);
        }

        // 모든 판매 상품에 대해 이미지 로딩
        const salesWithImages = results.map(sale => {
            return new Promise((resolve, reject) => {
                const imgQuery = `
                    SELECT file_name, file_url
                    FROM HM_IMG
                    WHERE pidx = ? AND ttype = 'GOODS' AND deldt IS NULL;
                `;

                connection.query(imgQuery, [sale.gd_idx], (imgError, imgResults) => {
                    if (imgError) {
                        return reject(imgError);
                    }
                    sale.images = imgResults;
                    resolve(sale);
                });
            });
        });

        // 모든 이미지 로딩 완료 후 결과 반환
        Promise.all(salesWithImages)
            .then(results => callback(null, results))
            .catch(error => callback(error, null));
    });
};

const getLimitedSalesCountByCategory = (brand, type, callback) => {
    const query = `
        SELECT 
            COUNT(*) as totalItems 
        FROM 
            HM_GOODS 
        WHERE 
            brand_str = ? AND btype = ? AND deldt IS NULL;
    `;

    connection.query(query, [brand, type], (error, results) => {
        if (error) {
            return callback(error, null);
        }
        callback(null, results[0].totalItems);
    });
};

module.exports = {
    getLimitedSalesList,
    getLimitedSalesCount,
    getLimitedSalesByCategory,
    getLimitedSalesCountByCategory,
};
