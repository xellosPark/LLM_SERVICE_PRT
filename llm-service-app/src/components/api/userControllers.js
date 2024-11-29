//import api from './api'

import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // 서버의 기본 URL
  headers: {
    "Content-Type": "application/json", // 모든 요청에 기본 Content-Type 설정
  },
});

export const Login = async (email, password) => {
    try {
        const ip = `http://localhost:5000`;
        const response = await api.post(`${ip}/api/auth/login`, { email, password });
    
        const { accessToken, refreshToken, user } = response.data;
        console.log('login', ip, response.data);
        
        return response.data;
      } catch (error) {
        return undefined;
      }
}