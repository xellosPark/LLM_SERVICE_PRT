import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/auth/LoginPage';
import MainScreen from './components/pages/MainScreen/MainScreen';
import Header from './components/Layouts/Header';

function App() {
  // 로그인 상태 관리
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 로그인 핸들러
  const handleLogin = (id, pw) => {
    if (id === '1111' && pw === '2222') {
      setIsAuthenticated(true); // 로그인 성공 시 상태 변경
    } else {
      alert("ID 또는 PW가 틀렸습니다.");
    }
  };

  return (
    <Router>
      <Header />
      <Routes>
        {/* 로그인 상태에 따른 라우팅 처리 */}
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/main" /> : <LoginPage onLogin={handleLogin} />}
        />
        <Route
          path="/main"
          element={isAuthenticated ? <MainScreen /> : <Navigate to="/" />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;