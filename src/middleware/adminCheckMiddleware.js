const axios = require('axios');

const adminCheckMiddleware = async (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(403).json({ message: '토큰이 제공되지 않았습니다.' });
    }

    // 'Bearer '를 분리하여 토큰만 추출
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

    try {
        // API로 토큰을 검증하는 요청을 보냅니다.
        const response = await axios.post('https://api.hituru.com:22443/v1.0/admin/tokenCheck', { token });

        // API 응답이 성공적이고, isadmin이 'Y'인 경우
        if (response.data && response.data.success && response.data.data && response.data.data.isadmin === 'Y') {
            next(); // 관리자인 경우 다음 미들웨어 또는 라우트 핸들러로 진행
        } else {
            // 관리자가 아닌 경우 또는 실패한 경우
            return res.status(403).json({ message: '관리자 권한이 없습니다.' });
        }
    } catch (error) {
        console.error('토큰 검증 중 오류 발생:', error.message);
        return res.status(500).json({ message: '토큰 검증 중 오류가 발생했습니다.', error: error.message });
    }
};

module.exports = adminCheckMiddleware;
