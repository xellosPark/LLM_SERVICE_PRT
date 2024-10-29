import api from './api'

export const Login = async (email, password) => {
    try {
        const ip = `http://165.244.190.28:5000`;
        const response = await api.post(`${ip}/api/auth/login`, { email, password });
    
        const { accessToken, refreshToken, user } = response.data;
        console.log('login', ip, response.data);
        
        return response.data;
      } catch (error) {
        return undefined;
      }
}