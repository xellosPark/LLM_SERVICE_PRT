import { useRef, useState } from "react";
import './EvalDashBoard.css'
import EvaluationTable from "./EvaluationTable";

const EvalDashBoard = () => {
  const [activeTab, setActiveTab] = useState('Tab1');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // 각각의 테이블에 맞는 초기 컬럼 너비
  const [firstTableWidths, setFirstTableWidths] = useState([50, 150, 80]);
  const [secondTableWidths, setSecondTableWidths] = useState([50, 120]);
  
  return (
    <div style={{margin: '10px',}}>
      <div className="tab-buttons">
        <button className={activeTab === 'Tab1' ? 'active' : ''}
          onClick={() => handleTabClick('Tab1')}>High Risk - 기술 자료 요청</button>
        <button className={activeTab === 'Tab2' ? 'active' : ''}
          onClick={() => handleTabClick('Tab2')}>High Risk - 일반 자료 요청</button>
        <button className={activeTab === 'Tab3' ? 'active' : ''}
          onClick={() => handleTabClick('Tab3')}>High Risk - 자료 요청 없음</button>
      </div>

      <div className="tab-wrapper">
        {
          activeTab === 'Tab1' && (
            <>
            <div className="tab-container">
              <img src="https://img.icons8.com/?size=45&id=80613&format=png&color=000000" alt="tab1" />
              <div className="tab-title">Portential Risk
                 <div className="tab-title-span">300건 / 800건</div>
              </div>
            </div>
            
            <div className="flex-row table-direct">
              <div className="table-section">
                <EvaluationTable />
              </div>
            </div>
            </>
          )}

        {activeTab === 'Tab2' && (
          <>
            <div>Portential Risk 300건 / 800건</div>
            <div className="flex-row table-direct">
              <div className="table-section">
                <EvaluationTable />
              </div>
            </div>
          </>
        )}

        {activeTab === 'Tab3' && (
          <>
            <div>No Risk 400건 / 800건</div>
            <div className="flex-row table-direct">
              <div className="table-section">
                <EvaluationTable />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EvalDashBoard;