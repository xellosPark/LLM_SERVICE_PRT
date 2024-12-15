import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/auth/LoginPage';
import Header from './components/Layouts/Header';
import { setLogoutHandler } from './components/api/api';
import { UserContext } from './components/useContext/UserContext';
import DashBoard from './components/pages/dashboard/DashBoard';
import PIEChatbot from './components/pages/dashboard/PIEChatbot';
import LLMOPS from './components/pages/dashboard/LLMOPS';
import CreateInspection from './components/pages/dashboard/CreateInspection';
import EvalDashBoard from './components/pages/dashboard/EvalDashBoard';
import EvalDashBoardFinal from './components/pages/dashboard/EvalDashBoardFinal';
import SidebarLayout from './components/Layouts/SidebarLayout';

function AppWithLocation({ isAuthenticated, handleLogin, handleLogout }) {
  const [timeRemaining, setTimeRemaining] = useState(1800); // 초기 30분 (1800초)
  const [timer, setTimer] = useState(null);
  const [lastActionTime, setLastActionTime] = useState(Date.now()); // 마지막 입력 시간

  // 사용자의 키보드 입력을 추적하는 함수
  const handleUserAction = () => {
    setLastActionTime(Date.now()); // 입력이 있을 때마다 시간을 갱신
  };

  // 타이머 갱신 함수
  const updateTimer = () => {
    const timerset = (60 * 30);
    const elapsedTime = Math.floor((Date.now() - lastActionTime) / 1000);
    const remainingTime = timerset - elapsedTime;

    if (remainingTime <= 0) {
      handleLogout();
      clearInterval(timer);
      setTimeRemaining(timerset);
    } else {
      setTimeRemaining(remainingTime);
    }
  };

  useEffect(() => {
    const handleKeyDown = () => handleUserAction();
    const handleMouseActivity = () => handleUserAction();
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleMouseActivity);

    const intervalId = setInterval(updateTimer, 1000);
    setTimer(intervalId);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleMouseActivity);

    };
  }, [lastActionTime]);


  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return (
    <>

      {/* 헤더 표시 */}
      {isAuthenticated && <Header onLogout={handleLogout} timeRemaining={`${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`} />}
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
    if (user_id === '1111' && user_password === '2222') {
      setIsAuthenticated(true);
      sessionStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('activeComponent', 'DashBoard');
    } else {
      alert("ID 또는 PW가 틀렸습니다.");
    }
  };

  useEffect(() => {
    const savedAuthState = sessionStorage.getItem('isAuthenticated');
    if (savedAuthState === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    setLogoutHandler(logout);
  }, [logout])

  const handleLogout = () => {
    setIsAuthenticated(false);
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