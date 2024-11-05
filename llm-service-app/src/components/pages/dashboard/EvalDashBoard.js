

import { useState, useEffect } from "react";
import './EvalDashBoard.css';
import EvaluationTable from "./EvaluationTable";
import { LoadResultFile, SendEvalData } from '../../api/evaluationController';
import { Navigate, useNavigate } from 'react-router-dom';

const requestTypes = [
  { level: 'High Risk', request: '기술 자료 요청' },
  { level: 'Potential Risk', request: '일반 자료 요청' },
  { level: 'No Risk', request: '자료 요청 없음' },
];

const EvalDashBoard = ({handleItemClick}) => {
  const [activeTab, setActiveTab] = useState('Tab1'); // 현재 활성 탭 상태
  const [allSheets, setAllSheets] = useState([]);
  const [sheetNames, setSheetNames] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState(''); // 선택된 시트 상태
  const [headers, setHeaders] = useState([]); // 테이블 헤더 상태
  const [rows, setRows] = useState([]); // 테이블 데이터 상태
  const [error, setError] = useState(null); // 에러 상태
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [jobId, setJobId] = useState('');
  const navigate = useNavigate();

  // `selectedSheet`가 변경될 때 데이터를 가져옴
  useEffect(() => {
    const evalStart = localStorage.getItem('Evaluation_Start');
    //if (selectedSheet) {
    //  console.log('Selected sheet:', selectedSheet); // 선택된 시트 로그 출력
    if (evalStart === 'true') {
      console.log('한번만 들어오냐?');

      localStorage.setItem('Evaluation_Start', false);
      fetchSheetData(); // 데이터 가져오기 함수 호출
    } else if (evalStart === 'false') {
      // 로컬 스토리지에서 데이터를 불러오기
      const job_id = localStorage.getItem('Job_Id');
      setJobId(job_id);
      const storedData = localStorage.getItem('ExcelData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setAllSheets(parsedData.allSheets);
        setSheetNames(parsedData.sheetNames);
        setHeaders(parsedData.allSheets[parsedData.selectedSheet].headers);
        setRows(parsedData.allSheets[parsedData.selectedSheet].rows);
        setSelectedSheet(parsedData.selectedSheet);
        return; // 데이터가 이미 있으므로 API 요청 생략
      }
    }
    //}
  }, []);

  // 특정 시트의 데이터를 가져오는 함수
  const fetchSheetData = async () => {
    const job_id = localStorage.getItem('Job_Id');
    
    if (!job_id) {
      setError('Job Id가 참조 되지 않았습니다. 메인 화면으로 이동 후 다시 평가하기로 들어와 주시길 바랍니다');
      return;
    }

    setJobId(job_id);

    try {
      setLoading(true);
      setError(null);
      //console.log('Selected sheet 현제:', selectedSheet); // 선택된 시트 로그 출력

      const result = await LoadResultFile(job_id);
      console.log('fetchSheetData', result);
      
      if (result === undefined) {
        alert('파일을 가져오지 못했습니다 메인화면으로 이동하여 다시 진행해 주세요');
        return;
      }
      

      // 서버에서 반환된 모든 시트 데이터를 설정
      setAllSheets(result.allSheets);
      setSheetNames(result.sheetNames);

      // 기본적으로 첫 번째 시트의 데이터를 설정
      if (result.sheetNames.length > 0) {
        const firstSheetName = result.sheetNames[0];
        setHeaders(result.allSheets[firstSheetName].headers);
        setRows(result.allSheets[firstSheetName].rows);
        setSelectedSheet(firstSheetName); // 선택된 시트 상태 설정

        // 데이터를 localStorage에 저장
        localStorage.setItem('ExcelData', JSON.stringify({
          allSheets: result.allSheets,
          sheetNames: result.sheetNames,
          selectedSheet: firstSheetName,
        }));
      }


    } catch (err) {
      setError(err.message);
      console.error('Error fetching sheet data:', err);
    } finally {
      setLoading(false);
    }
  };

  // 탭 클릭 시 시트 데이터 가져오기 및 탭 설정
  const handleTabClick = (tab, sheetName) => {
    setActiveTab(tab);
    setSelectedSheet(sheetName); // 선택된 시트 설정

    console.log('Active tab set to:', tab); // 활성 탭 설정 로그 출력
    console.log('Selected sheet set to:', sheetName); // 선택된 시트 설정 로그 출력
  };

  // 시트 변경 시 호출되는 핸들러 함수
  const handleSheetChange = (tab, sheetName) => {
    if (allSheets[sheetName]) {
      setActiveTab(tab);
      setHeaders(allSheets[sheetName].headers);
      setRows(allSheets[sheetName].rows);
      setSelectedSheet(sheetName);
    }
  };

  const handleEvalEnd = async () => {
    const data = {
      service_name: 'mail_compliance_check',
      job_id: jobId,
      user: 'jaeyeong.lee',
      evaluation_type: 'new',
      data_request_system_xlsx_name: '자료현황_1721372445487.xlsx',
      change_list: {
        from_high_risk: {142: '[사외메일] NAV', },
        from_potential_risk: {11: 'ESST 음극 NN', },
        from_no_risk: {7 : 'Re : [제안서 ', },
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
          onClick={() => handleSheetChange('Tab1', 'High Risk - 기술 자료 요청')}
        >
          High Risk - 기술 자료 요청
        </button>
        <button
          className={activeTab === 'Tab2' ? 'active' : ''}
          onClick={() => handleSheetChange('Tab2', 'Potential Risk - 일반 자료 요청')}
        >
          Potential Risk - 일반 자료 요청
        </button>
        <button
          className={activeTab === 'Tab3' ? 'active' : ''}
          onClick={() => handleSheetChange('Tab3', 'No Risk - 자료 요청 없음')}
        >
          No Risk - 자료 요청 없음
        </button>
      </div>

      <div className="tab-wrapper">
        {activeTab === 'Tab1' && (
          <>
            <div className="tab-container">
              <img src="https://img.icons8.com/?size=45&id=80613&format=png&color=000000" alt="tab1" />
              <div className="tab-title">High Risk
                <div className="tab-title-span">300건 / 800건</div>
              </div>
            </div>
            <div className="flex-row table-direct">
              <div className="table-section">
                {/* Passing tabName as a prop */}
                <EvaluationTable headers={headers} rows={rows} tabName="Tab1" />
              </div>
            </div>
          </>
        )}
        {activeTab === 'Tab2' && (
          <>
            <div className="tab-container">
              <img src="https://img.icons8.com/?size=45&id=80613&format=png&color=000000" alt="tab2" />
              <div className="tab-title">Potential Risk
                <div className="tab-title-span">300건 / 800건</div>
              </div>
            </div>
            <div className="flex-row table-direct">
              <div className="table-section">
                {/* Passing tabName as a prop */}
                <EvaluationTable headers={headers} rows={rows} tabName="Tab2" />
              </div>
            </div>
          </>
        )}
        {activeTab === 'Tab3' && (
          <>
            <div className="tab-container">
              <img src="https://img.icons8.com/?size=45&id=80613&format=png&color=000000" alt="tab2" />
              <div className="tab-title">Potential Risk
                <div className="tab-title-span">300건 / 800건</div>
              </div>
            </div>
            <div className="flex-row table-direct">
              <div className="table-section">
                {/* Passing tabName as a prop */}
                <EvaluationTable headers={headers} rows={rows} tabName="Tab3" />
              </div>
            </div>
          </>
        )}
      </div>
      <button onClick={() => handleEvalEnd()}> 평가완료</button>
    </div>
  );
};

export default EvalDashBoard;


