import React, { useContext, useState } from 'react';
import './Header.css'; // CSS 파일 불러오기
import lightLogo from '../../logos/lge_2d+lge_logo_kr_heritagered_grey_rgb.png';
import darkLogo from '../../logos/lge_2d+lge_logo_kr_heritagered_white_rgb.png';
import { UserContext } from '../useContext/UserContext';

function Header({ onLogout }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { user } = useContext(UserContext);

  // 테마 변경 함수
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <header className={`header ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <div id='llm-logo'>
        <img alt='LG LOGO' src={`${isDarkMode ? darkLogo : lightLogo}`}  className={`logo ${isDarkMode ? 'dark-mode' : 'light-mode'}`} />
      </div>
      <div className="user-section">
        {
          user ? (
            <span className={`user-name ${isDarkMode ? 'dark-mode' : ''}`}>{user.name}</span>
          ) : (
            <span className={`user-name ${isDarkMode ? 'dark-mode' : ''}`}>UbiSam</span>
          )
        } 
         {/* 로그아웃 버튼에 onClick 이벤트 추가 */}
         <button
          className={`logout-button ${isDarkMode ? 'dark-mode' : ''}`}
          onClick={onLogout}
        >
          로그아웃
        </button>
        <button onClick={toggleTheme} style={{ marginLeft: '10px' }}>
          {isDarkMode ? '라이트 모드' : '다크 모드'}
        </button>
      </div>
    </header>
  );
}

export default Header;