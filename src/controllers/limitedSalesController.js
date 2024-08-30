const limitedSalesService = require('../services/limitedSalesService');

const getLimitedSales = async (req, res) => {
    try {
        const page = parseInt(req.params.page) || 1;
        const limit = 10; // 한 페이지당 10개의 결과를 보여줌
        const offset = (page - 1) * limit;

        const results = await new Promise((resolve, reject) => {
            limitedSalesService.getLimitedSalesList(limit, offset, (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });

        const totalItems = await new Promise((resolve, reject) => {
            limitedSalesService.getLimitedSalesCount((error, totalItems) => {
                if (error) return reject(error);
                resolve(totalItems);
            });
        });

        const totalPages = Math.ceil(totalItems / limit);
        const previousPage = page > 1 ? page - 1 : null;
        const nextPage = page < totalPages ? page + 1 : null;

        res.json({
            data: results,
            pagination: {
                previousPage,
                nextPage,
                currentPage: page,
                totalPages,
            },
        });
    } catch (error) {
        console.error('getLimitedSales Controller error :', error.message);
        res.status(500).send('getLimitedSales Controller error');
    }
};

const getLimitedSalesByCategory = (req, res) => {
    try{
        const brand = req.params.brand;
        const type = req.params.type;
        const page = parseInt(req.params.page) || 1;
        const limit = 10;  // 한 페이지당 10개의 결과를 보여줌
        const offset = (page - 1) * limit;

        limitedSalesService.getLimitedSalesByCategory(brand, type, limit, offset, (error, results) => {
            if (error) {
                console.error('리미티드 세일즈 카테고리 리스트 불러오기 실패:', error.message);
                return res.status(500).send('리미티드 세일즈 카테고리 리스트를 불러오는 중 오류가 발생했습니다.');
            }

            // 전체 아이템 수를 조회하여 페이지네이션 정보를 추가
            limitedSalesService.getLimitedSalesCountByCategory(brand, type, (error, totalItems) => {
                if (error) {
                    console.error('리미티드 세일즈 카테고리 수 조회 실패:', error.message);
                    return res.status(500).send('리미티드 세일즈 카테고리 수를 조회하는 중 오류가 발생했습니다.');
                }

                const totalPages = Math.ceil(totalItems / limit);
                const previousPage = page > 1 ? page - 1 : null;
                const nextPage = page < totalPages ? page + 1 : null;

                res.json({
                    data: results,
                    pagination: {
                        previousPage,
                        nextPage,
                        currentPage: page,
                        totalPages,
                    },
                });
            });
        });
    }catch(error){
        console.error('getLimitedSalesByCategory Controller error :', error.message);
        res.status(500).send('getLimitedSalesByCategory Controller error');
    }
};

const getBrandListByBtype = (req, res) => {
    try{
        limitedSalesService.getBrandListByBtype((error, results) => {
            if (error) {
                console.error('브랜드 리스트 불러오기 실패:', error.message);
                return res.status(500).send('브랜드 리스트를 불러오는 중 오류가 발생했습니다.');
            }
    
            res.json({
                data: results,
            });
        });
    }catch(error){
        console.error('getBrandListByBtype Controller error :', error.message);
        res.status(500).send('getBrandListByBtype Controller error');
    }
};

const deleteLimitedSale = (req, res) => {
    try{
        const gd_idx = req.params.gd_idx;

        limitedSalesService.deleteLimitedSale(gd_idx, (error, results) => {
            if (error) {
                console.error('게시글 삭제 실패:', error.message);
                return res.status(500).send('게시글을 삭제하는 중 오류가 발생했습니다.');
            }

            res.json({ message: '게시글이 성공적으로 삭제되었습니다.' });
        });
    }catch(err){
        console.error('deleteLimitedSale Controller error :', error.message);
        res.status(500).send('deleteLimitedSale Controller error');
    }
};

const searchGoodsByName = (req, res) => {
    try{
        const gd_name = req.params.gd_name;
        const page = parseInt(req.query.page) || 1;
        const limit = 10;  // 한 페이지당 10개의 결과를 보여줌
        const offset = (page - 1) * limit;

        limitedSalesService.searchGoodsByName(gd_name, limit, offset, (error, results) => {
            if (error) {
                console.error('상품 검색 실패:', error.message);
                return res.status(500).send('상품 검색 중 오류가 발생했습니다.');
            }

            // 전체 아이템 수를 조회하여 페이지네이션 정보를 추가
            limitedSalesService.getGoodsCountByName(gd_name, (error, totalItems) => {
                if (error) {
                    console.error('상품 수 조회 실패:', error.message);
                    return res.status(500).send('상품 수를 조회하는 중 오류가 발생했습니다.');
                }

                const totalPages = Math.ceil(totalItems / limit);
                const previousPage = page > 1 ? page - 1 : null;
                const nextPage = page < totalPages ? page + 1 : null;

                res.json({
                    data: results,
                    pagination: {
                        previousPage,
                        nextPage,
                        currentPage: page,
                        totalPages,
                    },
                });
            });
        });
    }catch(err){
        console.error('searchGoodsByName Controller error :', error.message);
        res.status(500).send('searchGoodsByName Controller error');
    }
};

const searchGoodsByMember = (req, res) => {
    try{
        const mem_id = req.params.mem_id;
        const page = parseInt(req.query.page) || 1;
        const limit = 10;  // 한 페이지당 10개의 결과를 보여줌
        const offset = (page - 1) * limit;

        limitedSalesService.searchGoodsByMember(mem_id, limit, offset, (error, results) => {
            if (error) {
                console.error('회원별 상품 검색 실패:', error.message);
                return res.status(500).send('회원별 상품 검색 중 오류가 발생했습니다.');
            }

            // 전체 아이템 수를 조회하여 페이지네이션 정보를 추가
            limitedSalesService.getGoodsCountByMember(mem_id, (error, totalItems) => {
                if (error) {
                    console.error('회원별 상품 수 조회 실패:', error.message);
                    return res.status(500).send('회원별 상품 수를 조회하는 중 오류가 발생했습니다.');
                }

                const totalPages = Math.ceil(totalItems / limit);
                const previousPage = page > 1 ? page - 1 : null;
                const nextPage = page < totalPages ? page + 1 : null;

                res.json({
                    data: results,
                    pagination: {
                        previousPage,
                        nextPage,
                        currentPage: page,
                        totalPages,
                    },
                });
            });
        });
    }catch(err){
        console.error('searchGoodsByMember Controller error :', error.message);
        res.status(500).send('searchGoodsByMember Controller error');
    }
};

const getGoodsDetail = (req, res) => {
    try{
        const gd_idx = req.params.gd_idx;

        limitedSalesService.getGoodsDetail(gd_idx, (error, goods) => {
            if (error) {
                console.error('상품 정보 조회 중 오류 발생:', error);
                return res.status(500).json({ error: '상품 정보를 불러오는 중 오류가 발생했습니다.' });
            }

            res.json({
                data: goods,
            });
        });
    }catch(err){
        console.error('getGoodsDetail Controller error :', error.message);
        res.status(500).send('getGoodsDetail Controller error');
    }
};


module.exports = {
    getLimitedSales,
    getLimitedSalesByCategory,
    getBrandListByBtype,
    deleteLimitedSale,
    searchGoodsByName,
    searchGoodsByMember,
    getGoodsDetail,
};
