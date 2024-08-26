const memberQnaService = require('../services/memberQnaService');

const getQnaPosts = (req, res) => {
    const page = parseInt(req.params.page) || 1;
    const limit = 10; // 한 페이지에 보여줄 게시글 수
    const offset = (page - 1) * limit;

    memberQnaService.getQnaPosts(limit, offset, (error, results) => {
        if (error) {
            console.error('Q&A 게시글 불러오기 실패:', error.message);
            return res.status(500).send('Q&A 게시글을 불러오는 중 오류가 발생했습니다.');
        }

        memberQnaService.getQnaPostsCount((error, total) => {
            if (error) {
                console.error('Q&A 게시글 수 조회 실패:', error.message);
                return res.status(500).send('Q&A 게시글 수를 조회하는 중 오류가 발생했습니다.');
            }

            const totalPages = Math.ceil(total / limit);
            const pagination = {
                currentPage: page,
                totalPages: totalPages,
                previousPage: page > 1 ? page - 1 : null,
                nextPage: page < totalPages ? page + 1 : null,
            };

            res.json({ data: results, pagination: pagination });
        });
    });
};

module.exports = {
    getQnaPosts,
};
