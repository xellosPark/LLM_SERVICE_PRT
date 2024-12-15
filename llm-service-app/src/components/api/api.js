import axios from "axios";
import { jwtDecode } from 'jwt-decode';

let logoutHandler = null; // 로그아웃 핸들러를 저장할 변수

// Axios 인스턴스 생성
const api = axios.create({
    baseURL: "http://165.244.190.28:5000",
    headers: {
        "Content-Type": "application/json", // 기본 Content-Type 설정
    },
});

export const setLogoutHandler = (logoutFn) => {
    logoutHandler = logoutFn; // 로그아웃 핸들러를 설정
};

// Access Token 갱신 함수
const refreshAccessToken = async () => {

    const ip = `http://165.244.190.28:5000`;
    const refreshToken = localStorage.getItem('refreshToken');

    try {
        const response = await axios.post(`${ip}/api/auth/token`, { token: refreshToken });
        const { accessToken } = response.data;

        // 새로운 Access Token 저장
        localStorage.setItem('accessToken', accessToken);

        return accessToken;
    } catch (error) {
        console.log('error1', logoutHandler);
        if (logoutHandler) logoutHandler(); // 로그아웃 핸들러 호출
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

        if (accessToken) {
            try {
                const decoded = jwtDecode(accessToken);
                const currentTime = Date.now() / 1000;

                // 토큰 만료 여부 확인 및 갱신
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
                return api(originalRequest); // 원래 요청 재시도
            } catch (error) {
                console.log('error2', logoutHandler);
                if (logoutHandler) logoutHandler(); // 로그아웃 처리
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
);

export default api;