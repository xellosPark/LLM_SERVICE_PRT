import axios from "axios";

const api = axios.create({
  baseURL: "http://165.244.190.28:5000", // 기본 서버 URL
  headers: {
    "Content-Type": "application/json", // 기본 Content-Type 설정
  },
});

export const Login = async (email, password) => {
  try {
    const ip = `http://165.244.190.28:5000`;
    const response = await api.post(`${ip}/api/auth/login`, { email, password });

    console.log('login successful', response.data);

    return response.data;
  } catch (error) {
    console.error("로그인 실패:", error);
    return undefined;
  }
};