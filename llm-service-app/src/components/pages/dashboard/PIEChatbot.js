import React from 'react';
import './PIEChatbot.css';
import { Link } from 'react-router-dom';

function PIEChatbot() {
  return (
    <div className='pie-content'>
      {/* 네비게이션 바 */}
      <div className="piechatbot-navigation-bar">
        <div className="piechatbot-navigation-title">
          {/* Mail Compliance Check 버튼 */}
          <Link
            to="/service/mail-compliance"
            className="nav-item DashBoard"
          >
            Mail Compliance 점검
          </Link>
        </div>
        <div className="piechatbot-separator"></div>

        <div className="piechatbot-navigation-title-sub">
          {/* PIE Chatbot 버튼 */}
          <Link
            to="/service/pie-chabot"
            className="nav-item active"
          >
            PIE 챗봇
          </Link>
        </div>
      </div>
      <div className="piechatbot-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <h1>TBD</h1>
      </div>
    </div>

  );
}

export default PIEChatbot;