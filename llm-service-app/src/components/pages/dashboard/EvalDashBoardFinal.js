import { useState, useEffect } from "react";
import './EvalDashBoard.css';
import EvaluationTable from "./EvaluationTableFinal";
import { LoadResultFile, SendEvalData } from "../../api/evaluationController";
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { LoadChecksRow, LoadEvaluationRow, LoadFilesTable } from "../../api/DBControllers";
import { BsChevronRight } from "react-icons/bs";

const requestTypes = [
  { level: 'High Risk', request: 'High Risk - 기술 자료 요청', riskLabel: 'Risk' },
  { level: 'Potential Risk', request: 'No Risk - 일반 자료 요청', riskLabel: 'No Risk' },
  { level: 'No Risk', request: 'No Risk - 자료 요청 없음', riskLabel: 'No Risk' },
  { level: '최종', request: '최종 Risk', riskLabel: 'none' },
];

const EvalDashBoardFinal = () => {
  const location = useLocation();
  const { id } = useParams();
  const data = location.state;

  const [activeTab, setActiveTab] = useState('Tab4');
  const [allSheetData, setAllSheetData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [jobId, setJobId] = useState('');
  const [riskCount, setRiskCount] = useState({});
  const [movedRisk, setMovedRisk] = useState({});
  const navigate = useNavigate();
  const [isTab4Visible, setIsTab4Visible] = useState(true);
  const [failMessage, setFailMessage] = useState('');
  const [isLoadFail, setIsLoadFail] = useState(false);
  const [rowData, setRowData] = useState(null);

  useEffect(() => {
    if (data === null || data === undefined) {
      const job_id = sessionStorage.getItem('Job_Id');
      setJobId(job_id);
      console.log('Final 데이터 Job_id', job_id);
    } else {
      sessionStorage.setItem('Job_Id', data.job_id);
      setJobId(data.job_id);
      console.log('Final 데이터 Job_id', data.job_id);
    }
    fetchAllSheetData();
  }, []);

  const LoadChecksRowData = async (job_id) => {
    const dataChecks = await LoadChecksRow(job_id);
    const dataEval = await LoadEvaluationRow(job_id);
    setRowData(dataChecks);

    await setRiskCount({
      risk: dataEval[0]?.risk_num ? dataEval[0]?.risk_num : 0,
      potential: dataEval[0]?.potential_risk_num ? dataEval[0]?.potential_risk_num : 0,
      no_risk: dataEval[0]?.no_risk_num ? dataEval[0]?.no_risk_num : 0,
      keyword_filtered_num: dataChecks[0]?.keyword_filtered_num ? dataChecks[0]?.keyword_filtered_num : 0
    });

    await movedRows();
  }

  const fetchAllSheetData = async () => {
    const jobId = sessionStorage.getItem('Job_Id');
    const sheets = requestTypes.map(type => type.request);
    const allData = [];

    try {
      setLoading(true);
      setError(null);
      console.log('모든 시트 데이터 가져오기 시작');

      for (const sheet of sheets) {
        console.log(`"${sheet}" 시트에서 데이터 가져오는 중`);
        const result = await LoadResultFile(jobId, sheet, 'evaluations');

        let data = null;
        if (result.status >= 200 && result.status < 300) {
          data = result.data;
          setIsLoadFail(false);
        } else if (result.status >= 300 && result.status < 400) {
          setFailMessage('데이터가 없습니다.');
          console.error('평가 결과 Excel File Load Error', result);
          setIsLoadFail(true);
          return;
        } else if (result.status >= 400 && result.status < 500) {
          setFailMessage('데이터가 없습니다.');
          console.error('평가 결과 Excel File Load Error', result);
          setIsLoadFail(true);
          return;
        } else if (result.status >= 500 && result.status < 600) {
          setFailMessage('데이터가 없습니다.');
          console.error('평가 결과 Excel File Load Error', result);
          setIsLoadFail(true);
          return;
        } else {
          setFailMessage('데이터가 없습니다.');
          console.error('평가 결과 Excel File Load Error', result);
          setIsLoadFail(true);
          return;
        }

        const rowsWithRiskLabel = data.rows.map((row, rowIndex) => {
          const rowWithLabel = [...row];
          let riskLabel;
          let headerLabel;

          // 현재 시트에 따라 riskLabel 설정
          if (sheet === 'High Risk - 기술 자료 요청') {
            riskLabel = 'Risk';
            headerLabel = 'from_high_risk';
          } else if (sheet === 'No Risk - 일반 자료 요청') {
            riskLabel = 'No Risk';
            headerLabel = 'from_potential_risk';
          } else if (sheet === 'No Risk - 자료 요청 없음') {
            riskLabel = 'No Risk';
            headerLabel = 'from_no_risk';
          }
          if (sheet !== '최종 Risk') {
            rowWithLabel.unshift(headerLabel);
            rowWithLabel.unshift("None");
            rowWithLabel.unshift(riskLabel);
            rowWithLabel.unshift(sheet);
            rowWithLabel.unshift(rowIndex + 1);
          }

          return rowWithLabel;
        });
        allData.push({ sheet, headers: data.headers, rows: rowsWithRiskLabel });
      }

      sessionStorage.setItem('allSheetFinal', JSON.stringify(allData));
      setAllSheetData(allData);
      console.log('Risk 라벨이 포함된 모든 시트 데이터:', allData);
    } catch (err) {
      setError(err.message);
      console.error('모든 시트 데이터를 가져오는 동안 오류가 발생했습니다:', err);
    } finally {
      setLoading(false);
    }
    LoadChecksRowData(jobId);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const movedRows = () => {
    const data = {
      risk: {},
      potential: {},
      no_risk: {},
      m_risk: {},
      m_potential: {},
      m_no_risk: {},
    };
    const allSheetData = JSON.parse(sessionStorage.getItem('allSheetFinal'));

    if (allSheetData && Array.isArray(allSheetData)) {
      requestTypes.forEach((requestType, index) => {
        const tabData = allSheetData.find(data => data.sheet === requestType.request);

        if (tabData && tabData.rows) {
          const itemIndex = 3;
          const filteredItems = tabData.rows.filter(row => row[itemIndex] === "move");

          if (filteredItems.length > 0) {
            const label = requestType.level === 'No Risk' ? 'no_risk' : requestType.level === 'High Risk' ? 'risk' : 'potential';
            console.log('movedRows ', requestType.level, filteredItems);
            data[label] = filteredItems.length;
          }
        }

        const mRist = LoadMoveVal();
        data['m_risk'] = mRist.from_high_risk ? Object.keys(mRist.from_high_risk).length : 0;
        data['m_potential'] = mRist.from_potential_risk ? Object.keys(mRist.from_potential_risk).length : 0;
        data['m_no_risk'] = mRist.from_no_risk ? Object.keys(mRist.from_no_risk).length : 0;
      })
    };
    setMovedRisk(data);
  }
  
  const getTabData = (tabName) => {
    const tabMapping = {
      'Tab1': 'High Risk - 기술 자료 요청',
      'Tab2': 'No Risk - 일반 자료 요청',
      'Tab3': 'No Risk - 자료 요청 없음',
      "Tab4": "최종 Risk"
    };
    return allSheetData.find(data => data.sheet === tabMapping[tabName]);
  };

  let moveItemsArray = [];
  const LoadMoveVal = () => {
    const allSheetData = JSON.parse(sessionStorage.getItem('allSheetFinal'));

    let itemsToMove = [];
    moveItemsArray = [];

    if (allSheetData && Array.isArray(allSheetData)) {
      requestTypes.forEach((requestType, index) => {
        const tabData = allSheetData.find(data => data.sheet === requestType.request);

        if (tabData && tabData.rows) {
          const itemIndex = 3;
          const filteredItems = tabData.rows.filter(row => row[itemIndex] === "move");

          if (filteredItems.length > 0) {
            filteredItems.forEach((item, itemIndex) => {
              moveItemsArray.push(item);
            });
          }

          itemsToMove = itemsToMove.concat(filteredItems);
        }
      });
    } else {
      console.log("allSheetData가 세션 스토리지에 존재하지 않거나 배열 형식이 아닙니다.");
    }

    console.log("전체 'move' 항목:", moveItemsArray);

    const groupedData = {
      from_high_risk: {},
      from_potential_risk: {},
      from_no_risk: {},
    };

    moveItemsArray.forEach(item => {
      const groupKey = item.find(val => ["from_high_risk", "from_potential_risk", "from_no_risk"].includes(val));

      if (groupKey && groupedData[groupKey]) {
        const id = item[0] - 1;
        const title = item[8];
        groupedData[groupKey][id] = title.slice(0, 10);
      }
    });
    console.log('groupData', groupedData);
    return groupedData;
  }

  const handleEvalEnd = async () => {
    const isCheckMove = handleMove();
    if (isCheckMove === true) {
      return;
    }

    const fileData = await LoadFilesTable(jobId);
    if (fileData.length <= 0) {
      alert(`선택한 Job_id : ${jobId}  fils 정보가 이상합니다.`);
      return;
    }

    const movedValue = LoadMoveVal();
    const data = {
      service_name: "mail_compliance_check",
      job_id: jobId,
      user: "jaeyeong.lee",
      evaluation_type: "modification",
      keyword_filtered_num: riskCount.keyword_filtered_num,
      data_request_system_xlsx_name: fileData[0].data_request_system_xlsx_name || "",
      change_list: {
        from_high_risk: movedValue.from_high_risk,
        from_potential_risk: movedValue.from_potential_risk,
        from_no_risk: movedValue.from_no_risk,
      }
    };
    console.log('eval send', data);

    const result = await SendEvalData(data);
    console.log('SendEvalData result', result);

    if (result.status >= 200 && result.status < 300) {
      navigate('/service/mail-compliance');
    } else if (result.status >= 300 && result.status < 400) {
        console.error('AiCore2 Edit Error', result);
    } else if (result.status >= 400 && result.status < 500) {
        console.error('AiCore2 Edit Error', result);
    } else if (result.status >= 500 && result.status < 600) {
        console.error('AiCore2 Edit Error', result);
    } else {
        console.error('AiCore2 Edit Error', result);
        alert('AiCore2 Edit 중 에러가 발생했습니다.');
    }
  }

  const handleEdit = async () => {
    if (isTab4Visible === false) {
      setIsTab4Visible(true);
    } else {
      setIsTab4Visible(false);
      setActiveTab('Tab1');
    }
  }

  const handleMove = () => {
    const storedData = sessionStorage.getItem('allSheetData');

    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        const dataArray = Array.isArray(parsedData) ? parsedData : Object.values(parsedData);
        let moveFound = false;

        dataArray.forEach((sheetData, index) => {
          const movedData = sheetData.rows.filter((data) => data[3] === "None" &&
           ((data[1] === "High Risk - 기술 자료 요청" && data[2] === "No Risk") || (data[1] !== "High Risk - 기술 자료 요청" && data[2] === "Risk")));

           const revertData = sheetData.rows.filter((data) => data[3] === "move" &&
           ((data[1] === "High Risk - 기술 자료 요청" && data[2] === "Risk") || (data[1] !== "High Risk - 기술 자료 요청" && data[2] === "No Risk")));

          if (movedData.length > 0 || revertData.length > 0) {
            moveFound = true;
            return
          }
        });

        if (moveFound) {
          alert('적용되지 않은 수정 사항이 있습니다. 수정 사항 취소/반영 후 평가 완료 버튼을 눌러주세요.');
        }
        return moveFound;
      } catch (error) {
        console.error('데이터 파싱 중 오류 발생:', error);
      }
    }
  };

  const formatData = (value) => {
    return typeof value === 'object' && Object.keys(value).length === 0 ? 0 : value;
  }

  return (
    <div className="eval-content">
      {/* 네비게이션 바 */}
      <div className="eval-navigation-bar">
        <div className="eval-navigation-title">
          {/* Mail Compliance Check 버튼 */}
          <Link
            to="/service/mail-compliance"
            className="nav-item active"
          >
            Mail Compliance 점검
          </Link>
          <BsChevronRight className="nav-item-eval-header" />
          <div className="nav-item-eval-active">평가 결과</div>
        </div>
      </div>

      <div style={{ margin: '10px' }}>
        <div className="tab-buttons">
          {isTab4Visible && (
            <button
              className={activeTab === 'Tab4' ? 'active' : ''}
              onClick={() => handleTabClick('Tab4')}
            >
              최종 Risk
            </button>
          )}
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
            No Risk - 일반 자료 요청
          </button>
          <button
            className={activeTab === 'Tab3' ? 'active' : ''}
            onClick={() => handleTabClick('Tab3')}
          >
            No Risk - 자료 요청 없음
          </button>
        </div>

        <div className="tab-wrapper">
          {['Tab1', 'Tab2', 'Tab3', 'Tab4'].includes(activeTab) && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '1700px' }}>
                {
                  <div className="tab-container">
                    <div className="tab-title">
                      {activeTab === 'Tab1' && ''} {/* High Risk */}
                      {activeTab === 'Tab2' && ''} {/* Potential Risk */}
                      {activeTab === 'Tab3' && ''} {/* No Risk */}
                      {activeTab === 'Tab4' && ''} {/* 최종 */}

                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontSize: '25px', fontWeight: 'bold', color: 'black', marginTop: '-4px' }}>{
                          activeTab === 'Tab1' || activeTab === 'Tab4' ? `${riskCount?.risk + formatData(movedRisk?.risk) - formatData(movedRisk?.m_risk)}` :
                            activeTab === 'Tab2' ? `${riskCount?.potential - formatData(movedRisk?.m_potential)}` :
                              activeTab === 'Tab3' ? `${riskCount?.no_risk + formatData(movedRisk?.no_risk) - formatData(movedRisk?.m_no_risk)}` :
                                ''
                        }
                        </span>
                        <div className="tab-title-span" style={{ marginLeft: '8px' }}>
                          {/* 전체 수치 표시 */}
                          {` / ${riskCount.keyword_filtered_num}`}
                        </div>
                      </div>
                    </div>
                  </div>
                  // )
                }
              </div>

              <div className="table-section">
                {/* 선택된 탭에 맞는 데이터 필터링 */}
                {
                  isLoadFail === true ? <div className="table-state-section">{failMessage}</div> :
                    getTabData(activeTab) ? (
                      <EvaluationTable
                        tabName={activeTab}
                        movedRows={movedRows}
                        handleEvalEnd={handleEvalEnd}
                        handleEdit={handleEdit}
                        isTab4Visible={isTab4Visible}
                        rowData={rowData}
                        id={id}
                      />
                    ) : (
                      <div className="table-state-section">데이터를 불러오는 중입니다.</div>
                    )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>

  );
};

export default EvalDashBoardFinal;