import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './SidebarLayout.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft,faArrowRight,faDesktop,faChartPie } from '@fortawesome/free-solid-svg-icons'

function SidebarLayout() {
  const [isMinimized, setIsMinimized] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <aside className={`sidebar ${isMinimized ? 'minimized' : ''}`}>
      <div className="menu">
        <Link to="/service/mail-compliance" className={`menu-item ${location.pathname.startsWith(`/service/mail-compliance`) || location.pathname.startsWith(`/service/pie-chabot`)
                                                        || location.pathname === `/` ? 'menu-focus' : ''}`}>
        <span className="custom-icon-size">
            <FontAwesomeIcon icon={faChartPie } />
          </span>
          <span className="sider-text">{!isMinimized && 'LLM Service'}</span>
        </Link>
        <Link to="/ops" className={`menu-item ${location.pathname.startsWith(`/ops`) ? 'menu-focus' : ''}`}>
        <span className="custom-icon-size">
            <FontAwesomeIcon icon={faDesktop} />
          </span>
          <span className="sider-text">{!isMinimized && 'LLM Ops'}</span>
        </Link>
        {/* <Link to="/sidebar/view4" className="menu-item">
          <span className="custom-icon-size">
            <FontAwesomeIcon icon={faDesktop} />
          </span>
          <span className="text">view4</span>
        </Link> */}
      </div>
      {/* 하단 최소화 버튼 */}
      <div className="bottom-toggle">
        <span onClick={toggleSidebar} className="toggle-text">
        <FontAwesomeIcon icon={isMinimized ? faArrowRight : faArrowLeft} />
          {!isMinimized && <span className="toggle-icon-size"> 최소화</span>}
        </span>
      </div>
    </aside>
  );
}

export default SidebarLayout;