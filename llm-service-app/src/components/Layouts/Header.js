import React, { useContext } from 'react';
import './Header.css';
import lightLogo from '../../logos/prai-gen_logo_line.png';
import { UserContext } from '../useContext/UserContext';
import { useNavigate } from 'react-router-dom';

function Header({ onLogout, timeRemaining }) {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const handleClickLogo = () => {
    navigate('/service/mail-compliance'); // 메인 페이지로 이동
  };

  return (
    <header className="header light-mode">
      <div className="llm-logo">
        <button className="llm-logo-button" onClick={handleClickLogo}>
          <img
            alt="LG LOGO"
            src={lightLogo}
            className="logo-light-mode"
          />
        </button>
      </div>
      <div className="user-section">
        <div className="header-timer">{timeRemaining}</div>
        <label className="Huserinfo">
          {/* 사용자 정보 표시 */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon-half-human"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 12c2.761 0 5-2.239 5-5S14.761 2 12 2 7 4.239 7 7s2.239 5 5 5zm-7 8v-1a5 5 0 015-5h4a5 5 0 015 5v1a2 2 0 01-2 2H7a2 2 0 01-2-2z"
            />
          </svg>
          <span>{user ? user.name : '이재영 님'}</span>
        </label>
        <button className="NewlogOut-button" onClick={onLogout}>
          로그아웃
        </button>
      </div>
    </header>
  );
}

export default Header;