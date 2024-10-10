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
       
        {/* <label className="userinfo">
      
          <svg xmlns="http://www.w3.org/2000/svg" className="icon-image" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A7.962 7.962 0 0012 20a7.962 7.962 0 006.879-2.196M15 10a3 3 0 11-6 0 3 3 0 016 0zM4 15a8 8 0 1116 0v1a4 4 0 01-4 4H8a4 4 0 01-4-4v-1z" />
          </svg>

           
        
          <span className="userinfo-text">UbiSam</span>
        </label> */}
        {/* 로그아웃 버튼에 onClick 이벤트 추가 */}
        {/* <button
          className={`logout-button ${isDarkMode ? 'dark-mode' : ''}`}
          onClick={onLogout}
        >
          로그아웃
        </button> */}
        <label className="Huserinfo">
          {/* 반쪽 사람 아이콘 */}
          <svg xmlns="http://www.w3.org/2000/svg" className="icon-half-human" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12c2.761 0 5-2.239 5-5S14.761 2 12 2 7 4.239 7 7s2.239 5 5 5zm-7 8v-1a5 5 0 015-5h4a5 5 0 015 5v1a2 2 0 01-2 2H7a2 2 0 01-2-2z" />
          </svg>

          {/* 텍스트 콘텐츠 */}
          {
            user ? (
              <span className={`${isDarkMode ? 'dark-mode' : ''}`}>{user.name}</span>
            ) : (
              <span className={`${isDarkMode ? 'dark-mode' : ''}`}>UbiSam</span>
            )
          } 
    </label>
    
        <button className="NewlogOut-button" onClick={onLogout}>
          {/* 로그인 아이콘 */}
          {/* <svg xmlns="http://www.w3.org/2000/svg" className="icon-lock" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 11h14a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a2 2 0 012-2z" />
          </svg> */}
          {/* 로그아웃 아이콘 */}
          <svg xmlns="http://www.w3.org/2000/svg" className="icon-lock" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
          </svg>


          {/* 로그인 텍스트 */}
          <span className="NewlogOut-text">LOGOUT</span>

          {/* 화살표 아이콘 */}
          {/* <svg xmlns="http://www.w3.org/2000/svg" className="icon-arrow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg> */}
        </button>
      </div>
    </header>
  );
}

export default Header;