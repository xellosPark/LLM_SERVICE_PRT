import React from 'react';
import './Sider.css'; // CSS 파일 임포트
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

const Sider = ({ isCollapsed, onToggle, onItemClick }) => {
  return (
    <aside className={`sider ${isCollapsed ? 'collapsed' : ''}`}>
      <ul className="sidemenu">
        <li onClick={() => onItemClick('Sub1')} className="menuItem">Service</li>
        <li onClick={() => onItemClick('Sub2')} className="menuItem">Sub2</li>
        <li onClick={() => onItemClick('Sub3')} className="menuItem">Sub3</li>
        <li onClick={() => onItemClick('Sub4')} className="menuItem">Sub4</li>
      </ul>
       {/* 최소화 버튼을 하단에 추가 */}
      <div onClick={onToggle} className="minimizeButton">
      <FontAwesomeIcon icon={isCollapsed ? faArrowRight : faArrowLeft} />
      {!isCollapsed && <span>최소화</span>}
      </div>
    </aside>
  );
};

export default Sider;