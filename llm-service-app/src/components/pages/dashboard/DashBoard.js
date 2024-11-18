import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Link를 react-router-dom에서 가져오기
import LLMTable from './LLMTable';
import './DashBoard.css'
import axios from 'axios';
import api from '../../api/api';
import CreateInspection from './CreateInspection';
import { BsChevronRight } from "react-icons/bs";
import newbutton from '../../../logos/createnewcheck.png'

const DashBoard = ({ subPage }) => {
  const [showCreateInspection, setShowCreateInspection] = useState(false);
  const [activePage, setActivePage] = useState('DashBoard'); // 초기 상태는 DashBoard
  const [isActivePage, setIsActivePage] = useState(false);

  const handleItemClick = (page) => {
    setActivePage(page); // 선택된 페이지로 상태 변경
  };

  const handleCreate = () => {
    setShowCreateInspection(true);
    setIsActivePage(true);
  };

  useEffect(()=> {
    if (subPage === 'Default') {
      setShowCreateInspection(false);
      setIsActivePage(false);
    }
  },[subPage])

  return (
    <div className="content">
      {/* 네비게이션 바 */}
      <div className="navigation-bar">
        <div className="navigation-title">
          {isActivePage === false ? (
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
          ) : (
            <>
              <button onClick={() => handleItemClick('DashBoard')} className="nav-item-create">
                Mail Compliance 점검
              </button>
              <BsChevronRight className="nav-item-create-header" />
              <div className="nav-item-create-active">신규 점검 생성</div>
            </>
          )}
        </div>
      </div>

      {/* 메인 콘텐츠 영역 */}
      {/* <div id="sub1-main">
        <div className="sub1-main" style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div>
            {showCreateInspection === false && (
              <>
                <div className="newaddbutton" onClick={handleCreate}>
                  <div>
                    <button className="icon-button-add">
                      <img src={newbutton} alt="add function icon" />
                      신규 점검 생성
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div> */}

      {/* 메인 콘텐츠 영역 */}
      <div id="sub1-main">
        <div className="sub1-main" style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div>
            {showCreateInspection === false && (
              <>
                <div className="newaddbutton" onClick={handleCreate}>
                  <div>
                    <Link to="/MailCompliance/Create" className="icon-button-add">
                      <img src={newbutton} alt="add function icon" />
                      신규 점검 생성
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* LLMTable 또는 CreateInspection 조건부 렌더링 */}
        <div className="body-content">
          {showCreateInspection ? <CreateInspection setIsActivePage={setIsActivePage} /> : <LLMTable handleItemClick={handleItemClick} />}
        </div>
      </div>
    </div>
  );
};

export default DashBoard;