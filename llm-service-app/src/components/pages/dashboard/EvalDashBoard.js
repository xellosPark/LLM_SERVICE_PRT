import { useRef, useState } from "react";
import './EvalDashBoard.css'
import EvaluationTable from "./EvaluationTable";

const datas = [
  { id: 1, mainContent: 'Table 첫번째 데이터', content: '데이터1', complianceRisk: 'true', result: '데이터1', },
  { id: 2, mainContent: 'Table 두번째 데이터', content: '데이터2', complianceRisk: 'true', result: '데이터2', },
  { id: 3, mainContent: 'Table 세번째 데이터', content: '데이터3', complianceRisk: 'false', result: '데이터3', },
  { id: 4, mainContent: 'Table 네번째 데이터', content: '데이터4', complianceRisk: 'true', result: '데이터4', },
];

// 테이블 1, 2 컬럼 정의
const firstTableColumns = [
  { key: 'id', label: 'Id' },
  { key: 'mainContent', label: '본문' },
  { key: 'content', label: '판단 근거 문장' },
];
const secondTableColumns = [
  { key: 'complianceRisk', label: 'Compliance Risk' },
  { key: 'result', label: '평가 기록(선택)' },
];

const ResizableTable = ({ columns, data, onEdit, showButton }) => {

  const [columnWidths, setColumnWidths] = useState({
    id: 10,
    mainContent: 100,
    content: 150,
    blenk: 20,
    complianceRisk: 150,
    result: 120,
  });

  const [value, setData] = useState(datas);

  const handleChange = (index, event) => {
    const newData = [...value];
    newData[index].result = event.target.value; // name 필드를 텍스트로 입력
    setData(newData);
  };
  // columnRefs를 빈 객체로 초기화합니다.
  const columnRefs = useRef({});
  const resizingState = useRef({ startX: 0, startWidth: 0 });

  const startResizing = (e, column) => {
    // 현재 열의 너비와 클릭 위치 간의 차이 보정
    const boundingRect = columnRefs.current[column.key].getBoundingClientRect();
    const diff = e.clientX - boundingRect.right;

    resizingState.current.startX = e.clientX;
    resizingState.current.startWidth = columnRefs.current[column.key].offsetWidth;
    resizingState.current.diff = diff;

    const onMouseMove = (moveEvent) => {
      // 보정된 위치에서 너비 계산
      const newWidth =
        resizingState.current.startWidth + (moveEvent.clientX - resizingState.current.startX) - resizingState.current.diff;

      setColumnWidths((prevWidths) => ({
        ...prevWidths,
        [column.key]: newWidth > column.minWidth ? newWidth : column.minWidth,
      }));
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return (
    <table className='eval-table'>
      <thead>
        <tr>
          {columns.map((col, index) => (
            <th key={col.key}>
              {/* style={{ width: `${columnWidths[index]}px` }}> */}
              <div className="table-th">
                <div>{col.label}</div>
                {
                  showButton && col.key === 'complianceRisk' && (
                    <div className="risk-th-button" type='button' onClick={() => alert(`Action on row: ${col.id}`)}>적용</div>
                  )
                }
              </div>

              {/* <div
                onMouseDown={(e) => startResizing(e, col)}
                style={{
                  display: 'inline-block',
                  width: '5px',
                  height: '100%',
                  cursor: 'col-resize',
                  marginLeft: '5px'
                }}
              
              >
              </div> */}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {value.map((row, rowindex) => (
          <tr key={row.id}>
            {columns.map((col, index) => (
              <td key={index}>
                {
                  col.key === 'result' ?
                    <input className="eval-td-textarea"
                      value={row[col.key]}
                      onChange={(event) => handleChange(rowindex, event)}
                      placeholder="Type something here..." /> : col.key === 'complianceRisk' ?
                      <button className="risk-td-button" style={{ backgroundColor: row[col.key] === 'true' ? 'red' : 'gray' }}>Risk</button> : <div>{row[col.key]}</div>
                }
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};


const EvalDashBoard = () => {
  const [activeTab, setActiveTab] = useState('Tab1');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // 각각의 테이블에 맞는 초기 컬럼 너비
  const [firstTableWidths, setFirstTableWidths] = useState([50, 150, 80]);
  const [secondTableWidths, setSecondTableWidths] = useState([50, 120]);
  
  return (
    <div className="eval-container">
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
              <div>High Risk 100건 / 800건</div>
              <div className="flex-row table-direct">
                <div className="table-section">
                  {/* <EvaluationTable /> */}
                  <ResizableTable
                    columns={firstTableColumns}
                    data={datas}
                    columnWidths={firstTableWidths}
                    setColumnWidths={setFirstTableWidths}
                    showButton={false} />
                </div>
                <div className="table-section">
                  <ResizableTable
                    columns={secondTableColumns}
                    data={datas}
                    columnWidths={secondTableWidths}
                    setColumnWidths={setSecondTableWidths}
                    showButton={true} />
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
                {/* <ResizableTable
                  columns={firstTableColumns}
                  data={datas}
                  columnWidths={firstTableWidths}
                  setColumnWidths={setFirstTableWidths}
                  showButton={false} />
              </div>
              <div className="table-section">
                <ResizableTable
                  columns={secondTableColumns}
                  data={datas}
                  columnWidths={secondTableWidths}
                  setColumnWidths={setSecondTableWidths}
                  showButton={true} /> */}
              </div>
            </div>
          </>
        )}

        {activeTab === 'Tab3' && (
          <>
            <div>No Risk 400건 / 800건</div>
            <div className="flex-row table-direct">
              <div className="table-section">
                {/* <EvaluationTable /> */}
                <ResizableTable
                  columns={firstTableColumns}
                  data={datas}
                  columnWidths={firstTableWidths}
                  setColumnWidths={setFirstTableWidths}
                  showButton={false} />
              </div>
              <div className="table-section">
                <ResizableTable
                  columns={secondTableColumns}
                  data={datas}
                  columnWidths={secondTableWidths}
                  setColumnWidths={setSecondTableWidths}
                  showButton={true} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EvalDashBoard;