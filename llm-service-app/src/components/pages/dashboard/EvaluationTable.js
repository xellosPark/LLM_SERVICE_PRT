import { useRef, useState } from "react";
import Pagination from "../Pagination/Pagination";
import './EvaluationTable.css'

const EvaluationTable = () => {
    const columns = [
        { key: 'id', label: 'Id', minWidth: '20', },
        { key: 'mainContent', label: '본문', minWidth: '90', },
        { key: 'content', label: '판단 근거 문장', minWidth: '100', },
        { key: 'blenk', label: '', minWidth: '20', },
        { key: 'complianceRisk', label: 'Compliance Risk', minWidth: '150', },
        { key: 'result', label: '평가 기록(선택)', minWidth: '120', },
    ];

    const datas = [
        { id: 1, mainContent: 'Table 첫번째 데이터', content: '데이터1', complianceRisk: 'true', result: '데이터1', },
        { id: 2, mainContent: 'Table 두번째 데이터', content: '데이터2', complianceRisk: 'true', result: '데이터2', },
        { id: 3, mainContent: 'Table 세번째 데이터', content: '데이터3', complianceRisk: 'false', result: '데이터3', },
        { id: 4, mainContent: 'Table 네번째 데이터', content: '데이터4', complianceRisk: 'true', result: '데이터4', },
    ];

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
        newData[index].result = event.target.value;
        setData(newData);
      };

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(15);

    // 현재 페이지에 맞는 데이터를 계산
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = value.slice(indexOfFirstItem, indexOfLastItem);

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
        <div className="eval-table-container">
            <div className="eval-section">
                <table className='eval-table'>
                    <thead>
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    ref={(el) => {
                                        if (el) columnRefs.current[column.key] = el;
                                    }}
                                    style={{ width: `${columnWidths[column.key]}px`, position: 'relative' }}
                                >
                                    <div className="table-th">
                                        <div>{column.label}</div>
                                        {
                                        column.key === 'complianceRisk' && <div className="risk-th-button" type='button' onClick={() => alert(`Action on row: ${column.id}`)}>적용</div>
                                    }
                                    </div>
                                    <div
                                        onMouseDown={(e) => startResizing(e, column)}
                                        style={{
                                            position: "absolute",
                                            right: 0,
                                            top: 0,
                                            width: "2px",
                                            height: "100%",
                                            cursor: "col-resize",
                                        }}
                                    />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((item, index) => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>
                                    {item.mainContent}
                                </td>
                                <td>
                                    {item.content}
                                </td>
                                <td>{item.blenk}</td>
                                <td>
                                    <button className="risk-td-button" style={{backgroundColor: item.complianceRisk === 'true' ? 'red' : 'gray' }}>Risk</button>
                                </td>
                                <td>
                                <input className="eval-td-textarea"
                                    value={item.result}
                                    onChange={(event) => handleChange(index, event)}
                                    placeholder="Type something here..." />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div>
            <div>
        <Pagination
          postsPerPage={itemsPerPage} // 페이지 당 포스트 수
          totalPosts={datas.length} // 전체 포스트 수
          paginate={(pageNumber) => setCurrentPage(pageNumber)} // 페이지 번호를 변경하는 함수
          currentPage={currentPage} // 현재 페이지 번호
        />
      </div>
            </div>
        </div>
    );
};

export default EvaluationTable;