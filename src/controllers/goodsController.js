const goodsService = require('../services/goodsService');

const getGoodsByBoIdx = (req, res) => {
    const bo_idx = req.params.bo_idx;
    const page = parseInt(req.params.page) || 1; // 페이지 번호는 params에서 가져옴
    const limit = parseInt(req.query.limit) || 10; // 페이지당 항목 수, 기본값은 10
    const offset = (page - 1) * limit;

    goodsService.getGoodsByBoIdx(bo_idx, limit, offset, (error, results) => {
        if (error) {
            console.error('게시물 불러오기 실패:', error.message);
            return res.status(500).send('게시물 불러오기 중 오류가 발생했습니다.');
        }

        goodsService.getGoodsCountByBoIdx(bo_idx, (error, totalItems) => {
            if (error) {
                console.error('게시물 수 조회 실패:', error.message);
                return res.status(500).send('게시물 수 조회 중 오류가 발생했습니다.');
            }

            const totalPages = Math.ceil(totalItems / limit);
            const previousPage = page > 1 ? page - 1 : null;
            const nextPage = page < totalPages ? page + 1 : null;
            //json totalItems,
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


const getBadsByBoIdx = (req, res) => {
    const bo_idx = req.params.bo_idx;
    const page = parseInt(req.params.page) || 1; // 페이지 번호는 params에서 가져옴
    const limit = parseInt(req.query.limit) || 10; // 페이지당 항목 수, 기본값은 10
    const offset = (page - 1) * limit;

    goodsService.getBadsByBoIdx(bo_idx, limit, offset, (error, results) => {
        if (error) {
            console.error('BAD 게시물 불러오기 실패:', error.message);
            return res.status(500).send('BAD 게시물 불러오기 중 오류가 발생했습니다.');
        }

        goodsService.getBadsCountByBoIdx(bo_idx, (error, totalItems) => {
            if (error) {
                console.error('BAD 게시물 수 조회 실패:', error.message);
                return res.status(500).send('BAD 게시물 수 조회 중 오류가 발생했습니다.');
            }

            const totalPages = Math.ceil(totalItems / limit);
            const previousPage = page > 1 ? page - 1 : null;
            const nextPage = page < totalPages ? page + 1 : null;
            //json totalItems,
            res.json({
                data: results,
                pagination: {
                    totalPages,
                    previousPage,
                    nextPage,
                    currentPage: page,
                },
            });
        });
    });
};


module.exports = {
    getGoodsByBoIdx,
    getBadsByBoIdx,
};
