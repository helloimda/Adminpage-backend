const reportManageService = require('../services/reportManageService');

const getReports = (req, res) => {
    const page = parseInt(req.params.page) || 1;
    const limit = 10;  // 한 페이지당 10개의 결과를 보여줌
    const offset = (page - 1) * limit;

    reportManageService.getReportsList(limit, offset, (error, results) => {
        if (error) {
            console.error('신고된 게시글 리스트 불러오기 실패:', error.message);
            return res.status(500).send('신고된 게시글 리스트를 불러오는 중 오류가 발생했습니다.');
        }

        // 전체 신고 수를 조회하여 페이지네이션 정보를 추가
        reportManageService.getReportsCount((error, totalItems) => {
            if (error) {
                console.error('신고된 게시글 수 조회 실패:', error.message);
                return res.status(500).send('신고된 게시글 수를 조회하는 중 오류가 발생했습니다.');
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

const getReportedPostsCount = (req, res) => {
    reportManageService.getReportedPostsCount((error, results) => {
        if (error) {
            console.error('신고된 게시글 카운팅 실패:', error.message);
            return res.status(500).send('신고된 게시글을 카운팅하는 중 오류가 발생했습니다.');
        }
        res.json(results);
    });
};

const getMemberReports = (req, res) => {
    const page = parseInt(req.params.page) || 1;
    const limit = 10; // 페이지당 10개의 결과를 출력
    const offset = (page - 1) * limit;

    reportManageService.getMemberReportsList(limit, offset, (error, results) => {
        if (error) {
            console.error('신고된 회원 게시글 리스트 불러오기 실패:', error.message);
            return res.status(500).send('신고된 회원 게시글 리스트를 불러오는 중 오류가 발생했습니다.');
        }

        // 전체 아이템 수를 조회하여 페이지네이션 정보를 추가
        reportManageService.getMemberReportsCount((error, totalItems) => {
            if (error) {
                console.error('신고된 회원 게시글 수 조회 실패:', error.message);
                return res.status(500).send('신고된 회원 게시글 수를 조회하는 중 오류가 발생했습니다.');
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

const countMemberReports = (req, res) => {
    reportManageService.countMemberReports((error, results) => {
        if (error) {
            console.error('멤버 신고 카운트 조회 실패:', error.message);
            return res.status(500).json({ message: '멤버 신고 카운트를 조회하는 중 오류가 발생했습니다.' });
        }

        res.json(results);
    });
};

module.exports = {
    getReports,
    getReportedPostsCount,
    getMemberReports,
    countMemberReports,
};
