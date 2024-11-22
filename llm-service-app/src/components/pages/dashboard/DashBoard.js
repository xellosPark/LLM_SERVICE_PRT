import React, { useEffect, useState } from 'react';
import LLMTable from './LLMTable';
import './DashBoard.css'
import axios from 'axios';
import api from '../../api/api';
import CreateInspection from './CreateInspection';
import newbutton from '../../../logos/createnewcheck.png'
import { Link } from 'react-router-dom';

const DashBoard = () => {

  useEffect(() => {
    //console.log('한번만 들어오냐?');

  }, [])

  return (
    <div className='content'>
      {/* 네비게이션 바 */}
      <div className="dashboard-navigation-bar">
        <div className="dashboard-navigation-title">
          {/* Mail Compliance Check 버튼 */}
          <Link
            to="/service/mail-compliance"
            className="nav-item active"
          >
            Mail Compliance 점검
          </Link>
        </div>

        <div className="dashboard-separator"></div>

        <div className="dashboard-navigation-title-sub">
          {/* PIE Chatbot 버튼 */}
          <Link
            to="/service/pie-chabot"
            className="nav-item PIEChatbot"
          >
            PIE 챗봇
          </Link>
        </div>

      </div>
      {/* 메인 콘텐츠 영역 */}
      <div id='dashboard-main'>
        <div className='dashboard-main' style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div>
            <div className="dashboard-newaddbutton">
              <div>
                {/* 하단 버튼 */}
                <Link to="/service/mail-compliance/new" className='dashboard-icon-button-add'>
                  <img src={newbutton} alt="add function icon" />
                  신규 점검 생성
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* Conditionally render LLMTable or CreateInspection */}
        <div className="dashboard-body-content">
          <LLMTable />
        </div>
      </div>
    </div>
  );
};

export default DashBoard;