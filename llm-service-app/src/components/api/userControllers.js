import api from './api'

export const Login = async (email, password) => {
    try {
        const ip = `http://127.0.0.1:4000`;
        const response = await api.post(`${ip}/api/auth/login`, { email, password });
    
        const { accessToken, refreshToken, user } = response.data;
        console.log('login', ip, response.data);
        
        return response.data;
      } catch (error) {
        return undefined;
      }
}