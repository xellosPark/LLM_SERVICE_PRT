import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import { useHistory } from 'react-router-dom';

// Axios 인스턴스 생성
const api = axios.create({
    baseURL: `${process.env.REACT_APP_API_DEV}:${process.env.REACT_APP_API_PORT}`
});

// Access Token 갱신 함수
const refreshAccessToken = async () => {
    //const history = useHistory
    console.log('재발급 진행');

    const ip = `${process.env.REACT_APP_API_DEV}:${process.env.REACT_APP_API_PORT}`;
    const refreshToken = localStorage.getItem('refreshToken');
    try {
        const response = await axios.post(`${ip}/api/auth/token`, { token: refreshToken });
        const { accessToken } = response.data;

        // 새로운 Access Token 저장
        localStorage.setItem('accessToken', accessToken);

        return accessToken;
    } catch (error) {
        localStorage.removeItem('isAuthenticated'); // 로컬 스토리지에서 로그인 상태 제거
        localStorage.removeItem('lastPath'); // 로컬 스토리지에서 마지막 경로 제거
        localStorage.removeItem('activeComponent'); // 로컬 스토리지에서 마지막 상태 제거
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        //history.push('/login');
        //console.error('Error refreshing access token:', error);
        throw error;
    }
};

// Axios 요청 인터셉터 설정
api.interceptors.request.use(
    async (config) => {
        const accessToken = localStorage.getItem('accessToken');

        // 로그인 또는 토큰 갱신 요청이면 Authorization 헤더 추가 안함
        if (config.url.includes('/auth/login') || config.url.includes('/auth/token')) {
            return config;
        }

        // Access Token이 있을 경우, 토큰 만료 여부 확인
        if (accessToken) {
            try {
                const decoded = jwtDecode(accessToken);
                const currentTime = Date.now() / 1000;

                // 토큰이 만료되었으면 Access Token 갱신
                if (decoded.exp < currentTime) {
                    const newAccessToken = await refreshAccessToken();
                    config.headers['Authorization'] = `Bearer ${newAccessToken}`;
                } else {
                    config.headers['Authorization'] = `Bearer ${accessToken}`;
                }
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Axios 응답 인터셉터 설정
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Access Token이 만료된 경우
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const newAccessToken = await refreshAccessToken();
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return api(originalRequest);  // 원래 요청을 다시 시도
            } catch (error) {
                //console.error('Refresh token expired or invalid:', error);
                return Promise.reject(error);  // 로그인 페이지로 리디렉션 등의 처리 필요
            }
        }
        //return Promise.reject(error);
    }
);

export default api;