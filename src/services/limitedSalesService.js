const connection = require('../config/db');

const getLimitedSalesList = (limit, offset, callback) => {
    const query = `
        SELECT 
            gd_idx, btype, gd_name, gd_num, cnt_star, gd_status, price, regdt 
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

const getBrandListByBtype = (callback) => {
    const query = `
        SELECT 
            btype, 
            brand_name_ko, 
            brand_img
        FROM 
            HM_BRAND
        WHERE 
            deldt IS NULL
        ORDER BY 
            btype;
    `;

    connection.query(query, (error, results) => {
        if (error) {
            return callback(error, null);
        }

        const groupedResults = results.reduce((acc, curr) => {
            const { btype, brand_name_ko, brand_img } = curr;
            if (!acc[btype]) {
                acc[btype] = [];
            }
            acc[btype].push({ brand_name: brand_name_ko, brand_img });
            return acc;
        }, {});

        callback(null, groupedResults);
    });
};

const deleteLimitedSale = (gd_idx, callback) => {
    const query = `
        UPDATE HM_GOODS
        SET isdel = 'Y', deldt = NOW()
        WHERE gd_idx = ? AND deldt IS NULL;
    `;

    connection.query(query, [gd_idx], (error, results) => {
        if (error) {
            return callback(error, null);
        }

        if (results.affectedRows === 0) {
            return callback(new Error('존재하지 않거나 이미 삭제된 게시글입니다.'), null);
        }

        callback(null, results);
    });
};

const searchGoodsByName = (gd_name, limit, offset, callback) => {
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
            deldt IS NULL AND gd_name LIKE ?
        ORDER BY 
            regdt DESC 
        LIMIT ? OFFSET ?;
    `;

    connection.query(query, [`%${gd_name}%`, limit, offset], (error, results) => {
        if (error) {
            return callback(error, null);
        }

        // 각 상품에 대해 이미지 로드
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

        // 모든 이미지 로드가 완료되면 콜백 호출
        Promise.all(salesWithImages)
            .then(results => callback(null, results))
            .catch(error => callback(error, null));
    });
};

const searchGoodsByMember = (mem_id, limit, offset, callback) => {
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
            deldt IS NULL AND mem_id LIKE ?
        ORDER BY 
            regdt DESC 
        LIMIT ? OFFSET ?;
    `;

    connection.query(query, [`%${mem_id}%`, limit, offset], (error, results) => {
        if (error) {
            return callback(error, null);
        }

        // 각 상품에 대해 이미지 로드
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

        // 모든 이미지 로드가 완료되면 콜백 호출
        Promise.all(salesWithImages)
            .then(results => callback(null, results))
            .catch(error => callback(error, null));
    });
};

const getGoodsCountByMember = (mem_id, callback) => {
    const query = `
        SELECT 
            COUNT(*) as totalItems 
        FROM 
            HM_GOODS 
        WHERE 
            deldt IS NULL AND mem_id LIKE ?;
    `;

    connection.query(query, [`%${mem_id}%`], (error, results) => {
        if (error) {
            return callback(error, null);
        }
        callback(null, results[0].totalItems);
    });
};

const getGoodsCountByName = (gd_name, callback) => {
    const query = `
        SELECT 
            COUNT(*) as totalItems 
        FROM 
            HM_GOODS 
        WHERE 
            deldt IS NULL AND gd_name LIKE ?;
    `;

    connection.query(query, [`%${gd_name}%`], (error, results) => {
        if (error) {
            return callback(error, null);
        }
        callback(null, results[0].totalItems);
    });
};

const getGoodsDetail = (gd_idx, callback) => {
    const query = `
        SELECT gd_idx, cg_idx, ca_idx, brand_idx, brand_str, btype, mem_idx, mem_id, gd_name, gd_num, gd_status, gd_view, 
               isware, buy_price, price, buy_place, buy_year, buy_month, condition_goods, condition_state, isbox, 
               iswarranty, isetc, component, content, isoffer, isexchange, proposal, istemp, cnt_view, cnt_star, 
               avg_star, cnt_good, cnt_bad, cnt_bookmark, cnt_comment, cnt_img, cnt_pull, cnt_noteGroup, gddt, regdt
        FROM HM_GOODS
        WHERE gd_idx = ? AND isdel = 'N';
    `;

    connection.query(query, [gd_idx], (error, results) => {
        if (error) {
            return callback(error, null);
        }

        if (results.length === 0) {
            return callback(new Error('해당 상품을 찾을 수 없습니다.'), null);
        }

        const goodsDetail = results[0];

        // 이미지를 불러오는 쿼리
        const imgQuery = `
            SELECT file_name, file_url
            FROM HM_IMG
            WHERE pidx = ? AND ttype = 'GOODS' AND deldt IS NULL;
        `;

        connection.query(imgQuery, [gd_idx], (imgError, imgResults) => {
            if (imgError) {
                return callback(imgError, null);
            }

            goodsDetail.images = imgResults; // 상품 정보에 이미지 추가
            callback(null, goodsDetail);
        });
    });
};


module.exports = {
    getLimitedSalesList,
    getLimitedSalesCount,
    getLimitedSalesByCategory,
    getLimitedSalesCountByCategory,
    getBrandListByBtype,
    deleteLimitedSale,
    getGoodsCountByName,
    searchGoodsByName,
    searchGoodsByMember,
    getGoodsCountByMember,
    getGoodsDetail,
};
