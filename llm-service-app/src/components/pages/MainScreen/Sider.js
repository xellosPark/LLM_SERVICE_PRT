import React from 'react';
import './Sider.css'; // CSS 파일 임포트
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft,faArrowRight,faDesktop,faChartPie } from '@fortawesome/free-solid-svg-icons';



const Sider = ({ isCollapsed, onToggle, onItemClick }) => {
  const handleItemClick = (componentName) => {
    console.log(`🔹 handleItemClick 호출됨: ${componentName}`); // 버튼 클릭 시 호출 로그

    // 브라우저 히스토리에 상태 저장
    window.history.pushState({ component: componentName }, "", `/${componentName}`);
    console.log(`➡️ window.history.pushState: component = ${componentName}, URL = /${componentName}`); // pushState에 대한 로그

    // MainScreen의 상태 업데이트를 위한 콜백 호출
    onItemClick(componentName);
    console.log(`✔️ onItemClick 실행 완료: ${componentName}`); // onItemClick 완료 후 로그
};
  return (
    <aside className={`sider ${isCollapsed ? 'collapsed' : ''}`}>
      <ul className="sidemenu">
        <li onClick={() => onItemClick('DashBoard')} className="minimizeButton">
          <span className="custom-icon-size">
            <FontAwesomeIcon icon={faChartPie } />
          </span>
          {!isCollapsed && ' LLM Service'}
        </li>
        <li onClick={() => onItemClick('LLMOPS')} className="minimizeButton">
          <span className="custom-icon-size">
            <FontAwesomeIcon icon={faDesktop} />
          </span>
          {!isCollapsed && ' LLM Ops'}
        </li>
        {/* <li onClick={() => onItemClick('Sub3')} className="menuItem">Sub3</li> */}
        {/* <li onClick={() => onItemClick('Sub4')} className="menuItem">Sub4</li> */}
      </ul>
      

          {/* 최소화 버튼을 하단에 추가 */}
      <div onClick={onToggle} className="minimizeButton">
        <div className='mini-div'>
          <FontAwesomeIcon icon={isCollapsed ? faArrowRight : faArrowLeft} />
          {!isCollapsed &&   <span className="custom-icon-ssize"> 최소화</span>}
        </div>
        
      </div>
    </aside>
  );
};

export default Sider;