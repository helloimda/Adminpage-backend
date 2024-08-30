const memberQnaService = require('../services/memberQnaService');

const getQnaPosts = (req, res) => {
    try{
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
    }catch(err){
        console.error('getQnaPosts Controller error :', error.message);
        res.status(500).send('getQnaPosts Controller error');
    }
};

const postQnaAnswer = (req, res) => {
    try{
        const meq_idx = req.params.meq_idx; // 수정된 부분
        const { rsubject, rcontent } = req.body;

        memberQnaService.postQnaAnswer(meq_idx, rsubject, rcontent, (error, results) => {
            if (error) {
                console.error('문의 답변 등록 실패:', error.message);
                return res.status(500).send('문의 답변을 등록하는 중 오류가 발생했습니다.');
            }

            res.json({ message: '문의 답변이 성공적으로 등록되었습니다.' });
        });
    }catch{
        console.error('postQnaAnswer Controller error :', error.message);
        res.status(500).send('postQnaAnswer Controller error');
    }
};

const getNotRespondedQnaPosts = (req, res) => {
    try{
        const page = parseInt(req.params.page) || 1;
        const limit = 10;  // 한 페이지당 10개의 결과를 보여줌
        const offset = (page - 1) * limit;
    
        memberQnaService.getNotRespondedQnaPosts(limit, offset, (error, results, total) => {
            if (error) {
                console.error('미답변 Q&A 게시글 불러오기 실패:', error.message);
                return res.status(500).send('미답변 Q&A 게시글을 불러오는 중 오류가 발생했습니다.');
            }
    
            const totalPages = Math.ceil(total / limit);
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
    }catch(err){
        console.error('getNotRespondedQnaPosts Controller error :', error.message);
        res.status(500).send('getNotRespondedQnaPosts Controller error');
    }
};

const getRespondedQnaPosts = (req, res) => {
    try{
        const page = parseInt(req.params.page) || 1;
        const limit = 10;  // 한 페이지당 10개의 결과를 보여줌
        const offset = (page - 1) * limit;
    
        memberQnaService.getRespondedQnaPosts(limit, offset, (error, results, total) => {
            if (error) {
                console.error('답변된 Q&A 게시글 불러오기 실패:', error.message);
                return res.status(500).send('답변된 Q&A 게시글을 불러오는 중 오류가 발생했습니다.');
            }
    
            const totalPages = Math.ceil(total / limit);
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
    }catch(err){
        console.error('getRespondedQnaPosts Controller error :', error.message);
        res.status(500).send('getRespondedQnaPosts Controller error');
    }
};

const getQnaDetail = (req, res) => {
    try{
        const meq_idx = req.params.meq_idx;

        memberQnaService.getQnaDetail(meq_idx, (error, qnaDetail) => {
            if (error) {
                console.error('Q&A 게시글 상세 정보 불러오기 실패:', error.message);
                return res.status(500).send('Q&A 게시글 상세 정보를 불러오는 중 오류가 발생했습니다.');
            }
    
            // 이미지 정보도 함께 조회
            memberQnaService.getQnaImages(meq_idx, (imgError, images) => {
                if (imgError) {
                    console.error('Q&A 게시글 이미지 불러오기 실패:', imgError.message);
                    return res.status(500).send('Q&A 게시글 이미지를 불러오는 중 오류가 발생했습니다.');
                }
    
                qnaDetail.images = images; // 이미지 정보를 추가
                res.json(qnaDetail);
            });
        });
    }catch{
        console.error('getQnaDetail Controller error :', error.message);
        res.status(500).send('getQnaDetail Controller error');
    }
};

module.exports = {
    getQnaPosts,
    postQnaAnswer,
    getNotRespondedQnaPosts,
    getRespondedQnaPosts,
    getQnaDetail,
};
