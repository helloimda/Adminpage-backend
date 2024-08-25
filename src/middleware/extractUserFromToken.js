const axios = require('axios');

const extractUserFromToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(403).json({ message: '토큰이 제공되지 않았습니다.' });
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

    try {
        const response = await axios.post('https://api.hituru.com:22443/v1.0/admin/tokenCheck', { token });

        if (response.data && response.data.success && response.data.data) {
            console.log('미들웨어에서 추출된 사용자 정보:', response.data.data);  // 사용자 정보 로깅
            req.user = {
                mem_id: response.data.data.mem_id,
                mem_idx: response.data.data.mem_idx,
                mem_nick: response.data.data.mem_nick,
                mem_profile_url: response.data.data.mem_profile_url,
                isadmin: response.data.data.isadmin,
            };
            next();
        } else {
            return res.status(403).json({ message: '사용자 정보를 확인할 수 없습니다.' });
        }
    } catch (error) {
        console.error('토큰 검증 중 오류 발생:', error.message);
        return res.status(500).json({ message: '토큰 검증 중 오류가 발생했습니다.', error: error.message });
    }
};

module.exports = extractUserFromToken;
