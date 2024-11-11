import { useState, useEffect } from "react";
import './EvalDashBoard.css';
import EvaluationTable from "./EvaluationTable";
import { LoadResultFile, SendEvalData } from "../../api/evaluationController";
import { Navigate, useNavigate } from 'react-router-dom';
import { LoadChecksRow } from "../../api/DBControllers";

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
  const [riskCount, setRiskCount] = useState({});
  const [movedRisk, setMovedRisk] = useState({});
  const navigate = useNavigate();

  // 컴포넌트가 마운트될 때 로컬 저장소에서 데이터 불러오기
  useEffect(() => {
    const job_id = localStorage.getItem('Job_Id');
    setJobId(job_id);
    const evalStart = localStorage.getItem('Evaluation_Start');
    if (evalStart === 'true') {
      console.log('한번만 들어오냐?');

      localStorage.setItem('Evaluation_Start', false);
      fetchAllSheetData();
    } else {
      const storedData = localStorage.getItem('allSheetData');
      if (storedData) {
        
        setAllSheetData(JSON.parse(storedData));
        console.log('로컬 저장소에서 불러온 모든 시트 데이터:', JSON.parse(storedData));
      }
    }

    LoadChecksRowData(job_id);
  }, []); // 빈 배열로 의존성을 설정하여 컴포넌트 마운트 시 한 번만 실행

  const LoadChecksRowData = async (job_id) => {
    const data = await LoadChecksRow(job_id);
    
    await setRiskCount({
      risk: data[0].risk_num,
      potential: data[0].potential_risk_num,
      no_risk: data[0].no_risk_num,
      keyword_filtered_num: data[0].keyword_filtered_num
    });

    await movedRows();
  }

  // 모든 시트의 데이터를 가져오는 함수
  const fetchAllSheetData = async () => {
    const jobId = localStorage.getItem('Job_Id');
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
        const rowsWithRiskLabel = result.rows.map((row, rowIndex) => {
          const rowWithLabel = [...row]; // 기존 행 복사
          let riskLabel;
          let headerLabel;

          // 현재 시트에 따라 riskLabel 설정
          if (sheet === 'High Risk - 기술 자료 요청') {
            riskLabel = 'Risk';
            headerLabel = 'from_high_risk';
          } else if (sheet === 'Potential Risk - 일반 자료 요청') {
            riskLabel = 'No Risk';
            headerLabel = 'from_potential_risk';
          } else if (sheet === 'No Risk - 자료 요청 없음') {
            riskLabel = 'No Risk';
            headerLabel = 'from_no_risk';
          } else {
            riskLabel = 'Unknown';
            headerLabel = 'Unknown';
          }

          rowWithLabel.push(riskLabel); // riskLabel 추가
          rowWithLabel.push("None"); // riskLabel 추가
          rowWithLabel.push(rowIndex + 1); // 인덱스 추가, 1부터 시작
          rowWithLabel.push(headerLabel);
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

  const movedRows = () => {
    const data = {
      risk: {},
      potential: {},
      no_risk: {},
      m_risk: {},
      m_potential : {},
      m_no_risk : {},
    };
    const allSheetData = JSON.parse(localStorage.getItem('allSheetData'));

    if (allSheetData && Array.isArray(allSheetData)) {
      // 각 requestType을 순회하며 해당 데이터를 필터링합니다.
      requestTypes.forEach((requestType, index) => {
          // 현재 requestType에 해당하는 데이터를 allSheetData에서 찾습니다.
          const tabData = allSheetData.find(data => data.sheet === requestType.request);

          if (tabData && tabData.rows) {
              // Tab3의 경우 12번째 인덱스를, 나머지의 경우 13번째 인덱스를 사용하여 "move" 값을 필터링합니다.
              const itemIndex = requestType.level === 'No Risk' ? 12 : 13;
              const filteredItems = tabData.rows.filter(row => row[itemIndex] === "move");

              if (filteredItems.length > 0) {
                const label =  requestType.level === 'No Risk' ? 'no_risk' : requestType.level === 'High Risk' ? 'risk' : 'potential';
                console.log('movedRows ', requestType.level, filteredItems);
                data[label] = filteredItems.length;
              }
          }
          
          const mRist = LoadMoveVal();
          data['m_risk'] = mRist.from_high_risk ? Object.keys(mRist.from_high_risk).length : 0;
          data['m_potential'] = mRist.from_potential_risk ? Object.keys(mRist.from_potential_risk).length : 0;
          data['m_no_risk'] = mRist.from_no_risk ? Object.keys(mRist.from_no_risk).length : 0;
      }

      )};
      console.log('moved ', data);
      
      setMovedRisk(data);
  }

  // 선택된 탭과 일치하는 데이터를 필터링하는 함수
  const getTabData = (tabName) => {
    const tabMapping = {
      'Tab1': 'High Risk - 기술 자료 요청',
      'Tab2': 'Potential Risk - 일반 자료 요청',
      'Tab3': 'No Risk - 자료 요청 없음'
    };
    return allSheetData.find(data => data.sheet === tabMapping[tabName]); // 선택된 탭에 해당하는 데이터 반환
  };

   // 전역에서 사용할 moveItemsArray 선언
let moveItemsArray = [];


const LoadMoveVal = () => {
   // 로컬스토리지에서 allSheetData 가져오기
  const allSheetData = JSON.parse(localStorage.getItem('allSheetData'));

  // 결과를 저장할 변수
  let itemsToMove = [];
  console.log(`${"init"}에 유효한 데이터가 없습니다.`);

  // 전역에서 사용할 moveItemsArray 선언
  moveItemsArray = [];
  console.log(`${"init"}에 유효한 데이터가 없습니다.`);

  if (allSheetData && Array.isArray(allSheetData)) {
      // 각 requestType을 순회하며 해당 데이터를 필터링합니다.
      requestTypes.forEach((requestType, index) => {
          // 현재 requestType에 해당하는 데이터를 allSheetData에서 찾습니다.
          const tabData = allSheetData.find(data => data.sheet === requestType.request);

          if (tabData && tabData.rows) {
              // Tab3의 경우 12번째 인덱스를, 나머지의 경우 13번째 인덱스를 사용하여 "move" 값을 필터링합니다.
              const itemIndex = requestType.level === 'No Risk' ? 12 : 13;
              const filteredItems = tabData.rows.filter(row => row[itemIndex] === "move");

              // 필터링된 항목을 한국어로 콘솔에 출력합니다.
              console.log(`"${requestType.level}"에서 이동할 항목:`); 
              console.log('filteredItems', filteredItems);
              

              if (filteredItems.length > 0) {
                  filteredItems.forEach((item, itemIndex) => {
                      // console.log(`아이템 ${itemIndex + 1}:`, item); // 각 "move" 항목을 출력합니다.
                      
                      moveItemsArray.push(item); // "move" 항목을 배열에 추가합니다.
                  });
              } else {
                  console.log(`"${requestType.level}"에 'move' 값이 있는 항목이 없습니다.`);
              }

              // 전체 결과에 추가합니다.
              itemsToMove = itemsToMove.concat(filteredItems);
          } else {
              console.log(`"${requestType.level}"에 유효한 데이터가 없습니다.`);
          }
      });
  } else {
      console.log("allSheetData가 로컬 스토리지에 존재하지 않거나 배열 형식이 아닙니다.");
  }

  // 최종적으로 모든 "move" 항목이 moveItemsArray에 저장됩니다.
  console.log("전체 'move' 항목:", moveItemsArray);

  const groupedData = {
    from_high_risk: {},
    from_potential_risk: {},
    from_no_risk: {},
  };

  moveItemsArray.forEach(item => {
    // 요소 중에 그룹 키에 해당하는 값을 찾기
    const groupKey = item.find(val => ["from_high_risk", "from_potential_risk", "from_no_risk"].includes(val));
    
    if (groupKey && groupedData[groupKey]) {
      if (groupKey === 'from_no_risk'){
        const id = item[11];
        const title = item[3];
        groupedData[groupKey][id] = title;
      } else {
        const id = item[14];
        const title = item[3];
        groupedData[groupKey][id] = title; // 해당하는 그룹 키 배열에 추가
      }
    }
  });
  console.log('groupData', groupedData);
  return groupedData;
}

  const handleEvalEnd = async () => {
    const movedValue = LoadMoveVal();
    const data = {
      service_name: "mail_compliance_check", 
      job_id: jobId, 
      user: "nakyeongkim", 
      evaluation_type: "new", 
      keyword_filtered_num: 243, 
      data_request_system_xlsx_name: "자료현황_1721372445487.xlsx", 
      change_list: {
        from_high_risk : movedValue.from_high_risk,
        from_potential_risk : movedValue.from_potential_risk,
        from_no_risk : movedValue.from_no_risk,
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

  const formatData = (value) => {
    return typeof value === 'object' && Object.keys(value).length === 0 ? 0 : value;
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
                <div className="tab-title-span">{ 
                  activeTab === 'Tab1' ? `${riskCount?.risk + formatData(movedRisk?.risk) - formatData(movedRisk?.m_risk)} / ${riskCount.keyword_filtered_num}` : 
                  activeTab === 'Tab2' ? `${riskCount?.potential - formatData(movedRisk?.m_potential)} / ${riskCount.keyword_filtered_num}` : 
                  `${riskCount?.no_risk + formatData(movedRisk?.no_risk) - formatData(movedRisk?.m_no_risk)} / ${riskCount.keyword_filtered_num}`}</div>
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
                    movedRows={movedRows}
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