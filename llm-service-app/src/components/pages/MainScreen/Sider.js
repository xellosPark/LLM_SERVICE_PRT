import React from 'react';
import './Sider.css'; // CSS 파일 임포트
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

const Sider = ({ isCollapsed, onToggle, onItemClick }) => {
  return (
    <aside className={`sider ${isCollapsed ? 'collapsed' : ''}`}>
      <ul className="sidemenu">
        <li onClick={() => onItemClick('DashBoard')} className="menuItem">{isCollapsed === true ? (<div style={{backgroundColor: 'white'}}><img className="thumbnail" width={40} src={process.env.PUBLIC_URL + `/llmservice_icon.png`} alt='LLM Service'></img></div>) : <p>LLM Service</p>}</li>
        <li onClick={() => onItemClick('LLMOPS')} className="menuItem">LLM Ops</li>
        {/* <li onClick={() => onItemClick('Sub3')} className="menuItem">Sub3</li> */}
        {/* <li onClick={() => onItemClick('Sub4')} className="menuItem">Sub4</li> */}
      </ul>
       {/* 최소화 버튼을 하단에 추가 */}
      <div onClick={onToggle} className="minimizeButton">
      <FontAwesomeIcon icon={isCollapsed ? faArrowRight : faArrowLeft} />
      {!isCollapsed && <span> 최소화</span>}
      </div>
    </aside>
  );
};

export default Sider;