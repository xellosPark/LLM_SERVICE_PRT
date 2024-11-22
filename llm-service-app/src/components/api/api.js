import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import { useContext } from "react";
import { useHistory } from 'react-router-dom';
import { UserContext } from "../useContext/UserContext";

let logoutHandler = null; // 로그아웃 핸들러를 저장할 변수

// Axios 인스턴스 생성
const api = axios.create({
    baseURL: `http://165.244.190.28:5000` //`${process.env.REACT_APP_API_DEV}:${process.env.REACT_APP_API_PORT}`
});

export const setLogoutHandler = (logoutFn) => {
    logoutHandler = logoutFn; // 로그아웃 핸들러를 설정
};

// Access Token 갱신 함수
const refreshAccessToken = async () => {
    
    //const history = useHistory
    console.log('재발급 진행');

    const ip = `http://165.244.190.28:5000`;//`${process.env.REACT_APP_API_DEV}:${process.env.REACT_APP_API_PORT}`;
    const refreshToken = localStorage.getItem('refreshToken');
    try {
        const response = await axios.post(`${ip}/api/auth/token`, { token: refreshToken });
        const { accessToken } = response.data;

        // 새로운 Access Token 저장
        localStorage.setItem('accessToken', accessToken);

        return accessToken;
    } catch (error) {
        console.log('error1', logoutHandler);
        if (logoutHandler) logoutHandler();  // 로그아웃 핸들러 호출
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
                // Refresh token이 만료되었을 때, logout 호출
                console.log('error2', logoutHandler);
                
                if (logoutHandler) logoutHandler();
                return Promise.reject(error);  // 로그인 페이지로 리디렉션 등의 처리 필요
            }
        }
        //return Promise.reject(error);
    }
);

export default api;