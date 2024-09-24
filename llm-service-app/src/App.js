import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from './components/auth/LoginPage';
import MainScreen from './components/pages/MainScreen/MainScreen';
import Header from './components/Layouts/Header';
import api from './components/api/api';

function AppWithLocation({ isAuthenticated, handleLogin, handleLogout }) {
  const location = useLocation();

  useEffect(() => {
    // 로그인 상태와 마지막 경로를 로컬 스토리지에 저장
    if (isAuthenticated) {
      localStorage.setItem('lastPath', location.pathname); // 현재 경로를 저장
    }

    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response.status === 401) {
          handleLogout();
          return Promise.reject(error);
        }
        return Promise.reject(error);
      }
    );

    // 컴포넌트 언마운트 시 인터셉터 제거
    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, [location, isAuthenticated]);

  return (
    <>
      {isAuthenticated && <Header onLogout={handleLogout} />}
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to={localStorage.getItem('lastPath') || "/main"} /> : <LoginPage onLogin={handleLogin} />}
        />
        <Route
          path="/main"
          element={isAuthenticated ? <MainScreen /> : <Navigate to="/" />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = async (id, pw) => {
    
    // if (id === '1111' && pw === '2222') {
    //   setIsAuthenticated(true); // 로그인 성공 시 상태 변경
    //   localStorage.setItem('isAuthenticated', 'true'); // 로그인 상태 로컬 스토리지에 저장
    //   localStorage.setItem('activeComponent', 'Sub1'); // 로그인 시 기본적으로 Sub1 로드
    // } else {
    //   alert("ID 또는 PW가 틀렸습니다.");
    // }
    
    try {
      const ip = `${process.env.REACT_APP_API_DEV}:${process.env.REACT_APP_API_PORT}`;
      const response = await api.post(`${ip}/api/auth/login`, { id, pw });
      const { accessToken, refreshToken } = response.data;
      setIsAuthenticated(true);
      localStorage.setItem('isAuthenticated', 'true'); // 로그인 상태 로컬 스토리지에 저장
      localStorage.setItem('activeComponent', 'Sub1'); // 로그인 시 기본적으로 Sub1 로드
      // Access Token과 Refresh Token을 저장
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

    console.log('Login successful');
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  useEffect(() => {
    const savedAuthState = localStorage.getItem('isAuthenticated');
    if (savedAuthState === 'true') {
      setIsAuthenticated(true); // 로컬 스토리지에 저장된 상태가 true이면 로그인 상태 유지
    }
  }, []);

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated'); // 로컬 스토리지에서 로그인 상태 제거
    localStorage.removeItem('lastPath'); // 로컬 스토리지에서 마지막 경로 제거
    localStorage.removeItem('activeComponent'); // 로컬 스토리지에서 마지막 상태 제거
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  return (
    <Router>
      <AppWithLocation
        isAuthenticated={isAuthenticated}
        handleLogin={handleLogin}
        handleLogout={handleLogout}
      />
    </Router>
  );
}

export default App;