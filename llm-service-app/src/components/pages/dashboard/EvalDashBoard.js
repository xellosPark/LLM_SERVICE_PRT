import { useState, useEffect } from "react";
import './EvalDashBoard.css';
import EvaluationTable from "./EvaluationTable";
import { LoadResultFile, SendEvalData } from "../../api/evaluationController";
import { Navigate, useNavigate } from 'react-router-dom';

// 요청 유형 정의 (한글)
const requestTypes = [
  { level: 'High Risk', request: 'High Risk - 기술 자료 요청', riskLabel: 'Risk' },
  { level: 'Potential Risk', request: 'Potential Risk - 일반 자료 요청', riskLabel: 'No Risk' },
  { level: 'No Risk', request: 'No Risk - 자료 요청 없음', riskLabel: 'No Risk' },
];

const EvalDashBoard = () => {
  const [activeTab, setActiveTab] = useState('Tab1'); // 현재 활성 탭 상태
  const [allSheetData, setAllSheetData] = useState([]); // 모든 시트 데이터 상태
  const [error, setError] = useState(null); // 에러 상태
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [jobId, setJobId] = useState('');
  const navigate = useNavigate();

  // 컴포넌트가 마운트될 때 로컬 저장소에서 데이터 불러오기
  useEffect(() => {
    const evalStart = localStorage.getItem('Evaluation_Start');
    if (evalStart === 'true') {
      console.log('한번만 들어오냐?');

      localStorage.setItem('Evaluation_Start', false);
      fetchAllSheetData();
    } else {
      const storedData = localStorage.getItem('allSheetData');
      if (storedData) {
        const job_id = localStorage.getItem('Job_Id');
        setJobId(job_id);
        setAllSheetData(JSON.parse(storedData));
        console.log('로컬 저장소에서 불러온 모든 시트 데이터:', JSON.parse(storedData));
      }
    }
  }, []); // 빈 배열로 의존성을 설정하여 컴포넌트 마운트 시 한 번만 실행

  // 모든 시트의 데이터를 가져오는 함수
  const fetchAllSheetData = async () => {
    const jobId = localStorage.getItem('Job_Id');
    setJobId(jobId);
    const sheets = requestTypes.map(type => type.request); // 요청 유형에 따른 시트 이름 배열 생성
    const allData = []; // 모든 시트 데이터를 저장할 배열

    try {
      setLoading(true); // 로딩 상태 설정
      setError(null); // 에러 초기화
      console.log('모든 시트 데이터 가져오기 시작'); // 데이터 가져오기 시작 로그

      for (const sheet of sheets) {
        console.log(`"${sheet}" 시트에서 데이터 가져오는 중`); // 각 시트의 데이터 가져오기 로그
        const result = await LoadResultFile(jobId, sheet);
        

        //const result = await responce.json();

        // 각 행의 마지막에 riskLabel 추가
        const rowsWithRiskLabel = result.rows.map(row => {
          const rowWithLabel = [...row]; // 기존 행 복사
          let riskLabel;

          // 현재 시트에 따라 riskLabel 설정
          if (sheet === 'High Risk - 기술 자료 요청') {
            riskLabel = 'Risk';
          } else if (sheet === 'Potential Risk - 일반 자료 요청') {
            riskLabel = 'No Risk';
          } else if (sheet === 'No Risk - 자료 요청 없음') {
            riskLabel = 'No Risk';
          } else {
            riskLabel = 'Unknown';
          }

          rowWithLabel.push(riskLabel); // riskLabel 추가
          rowWithLabel.push("None"); // riskLabel 추가
          return rowWithLabel;
        });
        console.log(`"${sheet}" 시트의 모든 행에 리스크 레이블이 추가되었습니다.`, rowsWithRiskLabel); // 해당 시트 완료 로그
        allData.push({ sheet, headers: result.headers, rows: rowsWithRiskLabel });
      }

      // 로컬 스토리지에 데이터 저장
      localStorage.setItem('allSheetData', JSON.stringify(allData));
      setAllSheetData(allData);
      console.log('Risk 라벨이 포함된 모든 시트 데이터:', allData); // 전체 데이터 로그 출력

    } catch (err) {
      setError(err.message); // 에러 메시지 설정
      console.error('모든 시트 데이터를 가져오는 동안 오류가 발생했습니다:', err); // 에러 로그 출력
    } finally {
      setLoading(false); // 로딩 상태 해제
    }
  };

  // 탭 클릭 시 탭 설정 함수
  const handleTabClick = (tab) => {
    setActiveTab(tab); // 활성 탭 설정
    console.log(`활성 탭이 "${tab}"로 설정되었습니다`); // 활성 탭 로그
  };

  // 선택된 탭과 일치하는 데이터를 필터링하는 함수
  const getTabData = (tabName) => {
    const tabMapping = {
      'Tab1': 'High Risk - 기술 자료 요청',
      'Tab2': 'Potential Risk - 일반 자료 요청',
      'Tab3': 'No Risk - 자료 요청 없음'
    };
    return allSheetData.find(data => data.sheet === tabMapping[tabName]); // 선택된 탭에 해당하는 데이터 반환
  };

  const handleEvalEnd = async () => {
    const data = {
      service_name: 'mail_compliance_check',
      job_id: jobId,
      user: 'jaeyeong.lee',
      evaluation_type: 'new',
      data_request_system_xlsx_name: '자료현황_1721372445487.xlsx',
      change_list: {
        from_high_risk: { 142: '[사외메일] NAV', },
        from_potential_risk: { 11: 'ESST 음극 NN', },
        from_no_risk: { 7: 'Re : [제안서 ', },
      }
    };
    console.log('eval send', data);


    const result = await SendEvalData(data);
    console.log('SendEvalData result', result);

    if (result.status === 204) {
      console.log('여기 들어오냐');
      localStorage.setItem('activeComponent', 'DashBoard');
      //handleItemClick('DashBoard');
      navigate('/'); // 메인 페이지로 이동
    }
  }

  return (
    <div style={{ margin: '10px' }}>
      <div className="tab-buttons">
        <button
          className={activeTab === 'Tab1' ? 'active' : ''}
          onClick={() => handleTabClick('Tab1')}
        >
          High Risk - 기술 자료 요청
        </button>
        <button
          className={activeTab === 'Tab2' ? 'active' : ''}
          onClick={() => handleTabClick('Tab2')}
        >
          Potential Risk - 일반 자료 요청
        </button>
        <button
          className={activeTab === 'Tab3' ? 'active' : ''}
          onClick={() => handleTabClick('Tab3')}
        >
          No Risk - 자료 요청 없음
        </button>
        {/* <button onClick={fetchAllSheetData}>모든 시트 데이터 가져오기</button> */}
      </div>

      <div className="tab-wrapper">
        {['Tab1', 'Tab2', 'Tab3'].includes(activeTab) && (
          <>
            <div style={{display: 'flex', justifyContent:'space-between', maxWidth: '1700px'}}>
            <div className="tab-container">
              <img src="https://img.icons8.com/?size=45&id=80613&format=png&color=000000" alt="tab" />

              <div className="tab-title">
                {activeTab === 'Tab1' && 'High Risk'}
                {activeTab === 'Tab2' && 'Potential Risk'}
                {activeTab === 'Tab3' && 'No Risk'}
                <div className="tab-title-span">300건 / 800건</div>
              </div>
            </div>
            <div>
              <button 
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#d9534f',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  marginLeft: '15px'
              }}
              
              onClick={() => handleEvalEnd()}> 평가완료</button>
            </div>
            </div>
            

              
            <div className="flex-row table-direct">
              <div className="table-section">
                {/* 선택된 탭에 맞는 데이터 필터링 */}
                {getTabData(activeTab) ? (
                  <EvaluationTable
                    // headers={getTabData(activeTab).headers}
                    // rows={getTabData(activeTab).rows}
                    tabName={activeTab}
                  />
                 ) : (
                  <div>데이터를 불러오는 중이거나 데이터가 없습니다.</div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      
      {error && <div className="error">{error}</div>}
      {loading && <div className="loading">로딩 중...</div>}
    </div>
  );
};

export default EvalDashBoard;