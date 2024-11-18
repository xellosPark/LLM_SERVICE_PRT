import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SidebarLayout.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft,faArrowRight,faDesktop,faChartPie } from '@fortawesome/free-solid-svg-icons'

function SidebarLayout() {
  const [isMinimized, setIsMinimized] = useState(false);

  const toggleSidebar = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <aside className={`sidebar ${isMinimized ? 'minimized' : ''}`}>
      <div className="menu">
        <Link to="/sidebar/DashBoard" className="menu-item">
        <span className="custom-icon-size">
            <FontAwesomeIcon icon={faChartPie } />
          </span>
          <span className="text">LLM Service</span>
        </Link>
        <Link to="/sidebar/LLMOPS" className="menu-item">
        <span className="custom-icon-size">
            <FontAwesomeIcon icon={faChartPie } />
          </span>
          <span className="text">LLM Ops</span>
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
          {isMinimized ? '➡ ' : '⬅ 최소화'}
        </span>
      </div>
    </aside>
  );
}

export default SidebarLayout;
