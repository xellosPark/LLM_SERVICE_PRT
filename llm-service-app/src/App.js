import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from './components/auth/LoginPage';
import MainScreen from './components/pages/MainScreen/MainScreen';
import Header from './components/Layouts/Header';
import api, { setLogoutHandler } from './components/api/api';
import { UserContext, UserProvider } from './components/useContext/UserContext';
import { Login } from './components/api/userControllers';
import DashBoard from './components/pages/dashboard/DashBoard';
import PIEChatbot from './components/pages/dashboard/PIEChatbot';
import LLMOPS from './components/pages/dashboard/LLMOPS';
import CreateInspection from './components/pages/dashboard/CreateInspection';
import EvalDashBoard from './components/pages/dashboard/EvalDashBoard';
import EvalDashBoardFinal from './components/pages/dashboard/EvalDashBoardFinal';
import SidebarLayout from './components/Layouts/SidebarLayout';

function AppWithLocation({ isAuthenticated, handleLogin, handleLogout }) {
  const location = useLocation();
  //const [activePage, setActivePage] = useState('main'); // activePage 상태 관리

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
      {/* 헤더 표시 */}
      {isAuthenticated && <Header onLogout={handleLogout} />}
      {/* 사이드바 표시 */}
      <div style={{ display: 'flex' }}>
        {isAuthenticated && <SidebarLayout />}
        {/* 라우트 설정 */}
        <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <Navigate to={"/service/mail-compliance"} /> : <LoginPage onLogin={handleLogin} />}
          />
          <Route
            path="/service/mail-compliance"
            element={isAuthenticated ? <DashBoard /> : <Navigate to="/" />}
          />
          <Route
            path='/service/pie-chabot'
            element={isAuthenticated ? <PIEChatbot /> : <Navigate to="/" />}
          />
          <Route
            path='/ops'
            element={isAuthenticated ? <LLMOPS /> : <Navigate to="/" />}
          />
          <Route
            path='/service/mail-compliance/new'
            element={isAuthenticated ? <CreateInspection /> : <Navigate to="/" />}
          />
          <Route
            path='/service/mail-compliance/evaluation/:id'
            element={isAuthenticated ? <EvalDashBoard /> : <Navigate to="/" />}
          />
          <Route
            path='/service/mail-compliance/evaluation/result/:id'
            element={isAuthenticated ? <EvalDashBoardFinal /> : <Navigate to="/" />}
          />
          <Route
            path='/service/*'
            element={isAuthenticated ? <SidebarLayout /> : <Navigate to="/" />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { login, logout } = useContext(UserContext);
  const handleLogin = async (user_id, user_password) => {
    console.log('로그인', user_id, user_password);
    // const loginData = await Login(email, password);

    // if (loginData === undefined)
    //   console.log('로그인 실패');

    // const { accessToken, refreshToken, user } = loginData;
    // setIsAuthenticated(true); // 로그인 성공 시 상태 변경
    // localStorage.setItem('accessToken', accessToken);
    // localStorage.setItem('refreshToken', refreshToken);
    // localStorage.setItem('isAuthenticated', 'true'); // 로그인 상태 로컬 스토리지에 저장
    // localStorage.setItem('activeComponent', 'DashBoard');
    // login(user);

    if (user_id === '1111' && user_password === '2222') {
      setIsAuthenticated(true); // 로그인 성공 시 상태 변경
      //localStorage.setItem('isAuthenticated', 'true'); // 로그인 상태 로컬 스토리지에 저장
      sessionStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('activeComponent', 'DashBoard'); // 로그인 시 기본적으로 Sub1 로드
    } else {
      alert("ID 또는 PW가 틀렸습니다.");
    }

    // try {
    //   const ip = `${process.env.REACT_APP_API_DEV}:${process.env.REACT_APP_API_PORT}`;
    //   const ip2 = 'http://165.244.190.28:5000';
    //   console.log(ip);

    //   const response = await api.post(`${ip2}/api/auth/login`, { user_id, user_password });
    //   const { accessToken, refreshToken } = response.data;
    //   setIsAuthenticated(true);
    //   localStorage.setItem('isAuthenticated', 'true'); // 로그인 상태 로컬 스토리지에 저장
    //   localStorage.setItem('activeComponent', 'DashBoard'); // 로그인 시 기본적으로 Sub1 로드
    //   // Access Token과 Refresh Token을 저장
    //   localStorage.setItem('accessToken', accessToken);
    //   localStorage.setItem('refreshToken', refreshToken);

    // console.log('Login successful');
    // } catch (error) {
    //   if (error.status === 400) {
    //     alert('아이디나 비밀번호가 다릅니다 다시 로그인 해주세요');
    //   }
    //   console.error('Error during login:', error);
    //   console.error(`${error.data}`);
    // }
  };

  useEffect(() => {
    //const savedAuthState = localStorage.getItem('isAuthenticated');
    const savedAuthState = sessionStorage.getItem('isAuthenticated');
    if (savedAuthState === 'true') {
      setIsAuthenticated(true); // 로컬 스토리지에 저장된 상태가 true이면 로그인 상태 유지
    }
  }, []);

  useEffect(() => {
    setLogoutHandler(logout);
  }, [logout])

  const handleLogout = () => {
    setIsAuthenticated(false);
    // localStorage.removeItem('isAuthenticated'); // 로컬 스토리지에서 로그인 상태 제거
    // localStorage.removeItem('lastPath'); // 로컬 스토리지에서 마지막 경로 제거
    // localStorage.removeItem('activeComponent'); // 로컬 스토리지에서 마지막 상태 제거
    // localStorage.removeItem('accessToken');
    // localStorage.removeItem('refreshToken');
    logout();
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