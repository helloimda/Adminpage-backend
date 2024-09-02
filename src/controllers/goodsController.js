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

const getGoodsCommentsByBoIdxCmtIdx = (req, res) => {
    const bo_idx = req.params.bo_idx;
    const cmt_idx = req.params.cmt_idx;
    const page = parseInt(req.params.page) || 1; // 요청된 페이지 번호, 기본값은 1
    const limit = parseInt(req.query.limit) || 10; // 페이지당 항목 수, 기본값은 10
    const offset = (page - 1) * limit;

    goodsService.getGoodsCommentsByBoIdxCmtIdx(bo_idx, cmt_idx, limit, offset, (error, results) => {
        if (error) {
            console.error('게시물 댓글 좋아요 리스트 불러오기 실패:', error.message);
            return res.status(500).send('게시물 댓글 좋아요 리스트를 불러오는 중 오류가 발생했습니다.');
        }

        goodsService.getGoodsCommentsCountByBoIdxCmtIdx(bo_idx, cmt_idx, (error, totalItems) => {
            if (error) {
                console.error('게시물 댓글 좋아요 수 조회 실패:', error.message);
                return res.status(500).send('게시물 댓글 좋아요 수를 조회하는 중 오류가 발생했습니다.');
            }

            const totalPages = Math.ceil(totalItems / limit);
            const previousPage = page > 1 ? page - 1 : null;
            const nextPage = page < totalPages ? page + 1 : null;
                //json totalitem
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

const getGoodGoodsByGdIdx = (req, res) => {
    const gd_idx = req.params.gd_idx;
    const page = parseInt(req.params.page) || 1; // 요청된 페이지 번호, 기본값은 1
    const limit = parseInt(req.query.limit) || 10; // 페이지당 항목 수, 기본값은 10
    const offset = (page - 1) * limit;

    goodsService.getGoodGoodsByGdIdx(gd_idx, limit, offset, (error, results) => {
        if (error) {
            console.error('좋아요 리스트 불러오기 실패:', error.message);
            return res.status(500).send('좋아요 리스트를 불러오는 중 오류가 발생했습니다.');
        }

        goodsService.getGoodGoodsCountByGdIdx(gd_idx, (error, totalItems) => {
            if (error) {
                console.error('좋아요 수 조회 실패:', error.message);
                return res.status(500).send('좋아요 수를 조회하는 중 오류가 발생했습니다.');
            }

            const totalPages = Math.ceil(totalItems / limit);
            const previousPage = page > 1 ? page - 1 : null;
            const nextPage = page < totalPages ? page + 1 : null;

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

const getUserByMemIdx = (req, res) => {
    const mem_idx = req.params.mem_idx;

    goodsService.getUserByMemIdx(mem_idx, (error, user) => {
        if (error) {
            console.error('회원 정보 불러오기 실패:', error.message);
            return res.status(500).send('회원 정보를 불러오는 중 오류가 발생했습니다.');
        }

        if (!user) {
            return res.status(404).send('해당 회원을 찾을 수 없습니다.');
        }

        res.json({
            mem_id: user.mem_id,
            mem_nick: user.mem_nick,
        });
    });
};

module.exports = {
    getGoodsByBoIdx,
    getBadsByBoIdx,
    getGoodsCommentsByBoIdxCmtIdx,
    getGoodGoodsByGdIdx,
    getUserByMemIdx,
};
