import React, { useEffect, useState } from 'react';
import './PIEChatbot.css'; // Create a CSS file for this component if needed
import { Link } from 'react-router-dom';

function PIEChatbot() {
  const [activePage, setActivePage] = useState('PIEChatbot'); // 초기 상태는 DashBoard
  const handleItemClick = (page) => {
    setActivePage(page); // 선택된 페이지로 상태 변경
  };

  return (
    <div className="content">
      {/* 네비게이션 바 */}
      <div className="navigation-bar">
        <div className="navigation-title">
          <>
            {/* Mail Compliance Check 버튼 */}
            <Link
              to="/sidebar/DashBoard"
              className={`nav-item ${activePage === 'DashBoard' ? 'active' : ''}`}
              onClick={() => handleItemClick('DashBoard')}
            >
              Mail Compliance 점검
            </Link>

            <div className="separator"></div>

            {/* PIE Chatbot 버튼 */}
            <Link
              to="/sidebar/PIEChatbot"
              className={`nav-item ${activePage === 'PIEChatbot' ? 'active' : ''}`}
              onClick={() => handleItemClick('PIEChatbot')}
            >
              PIE 챗봇
            </Link>
          </>
        </div>
      </div>

      <div className="piechatbot-container">
      <h1>TBD</h1>
    </div>
    </div>
  );
}

export default PIEChatbot;