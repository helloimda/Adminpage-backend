const limitedSalesService = require('../services/limitedSalesService');

const getLimitedSales = (req, res) => {
    const page = parseInt(req.params.page) || 1;
    const limit = 10;  // 한 페이지당 10개의 결과를 보여줌
    const offset = (page - 1) * limit;

    limitedSalesService.getLimitedSalesList(limit, offset, (error, results) => {
        if (error) {
            console.error('리미티드 세일즈 리스트 불러오기 실패:', error.message);
            return res.status(500).send('리미티드 세일즈 리스트를 불러오는 중 오류가 발생했습니다.');
        }

        // 전체 아이템 수를 조회하여 페이지네이션 정보를 추가
        limitedSalesService.getLimitedSalesCount((error, totalItems) => {
            if (error) {
                console.error('리미티드 세일즈 수 조회 실패:', error.message);
                return res.status(500).send('리미티드 세일즈 수를 조회하는 중 오류가 발생했습니다.');
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
};

module.exports = {
    getLimitedSales,
};
