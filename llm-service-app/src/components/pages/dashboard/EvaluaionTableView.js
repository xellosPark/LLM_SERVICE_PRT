import React, { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react';
import Pagination from '../Pagination/Pagination';
import './EvaluationTable.css';


const ToggleButton = React.memo(({ isRisk, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <button
            onClick={(e) => {
                e.preventDefault();
                e.target.blur();
                onClick();
            }}
            onMouseEnter={() => setIsHovered(true)} // 마우스가 버튼 위에 있을 때
            onMouseLeave={() => setIsHovered(false)} // 마우스가 버튼을 떠날 때
            style={{
                width: '80px',
                height: '30px',
                color: 'white',
                backgroundColor: isRisk ? 'black' : '#A9A9A9',
                border: 'none',
                borderRadius: '10px',
                transition: 'background-color 0.3s ease, opacity 0.3s ease', // opacity 변화에 대한 부드러운 전환 효과 추가
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 'bold',
                boxShadow: isRisk ? '2px 2px 5px rgba(0, 0, 0, 0.5)' : '1px 1px 3px rgba(0, 0, 0, 0.3)',
                padding: '5px',
                opacity: isHovered ? 0.8 : 1, // 마우스 후버 시 투명도 조절
            }}
        >
            {isRisk ? 'Risk' : 'No Risk'}
        </button>
    );
});

const EvaluationTableView = ({ tabName, movedRows, handleEvalEnd, handleEdit, isTab4Visible }) => {
    const [datas, setDatas] = useState([]);
    const [buttonStates, setButtonStates] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [tooltip, setTooltip] = useState({ visible: false, content: '', top: 0, left: 0 });
    const tooltipRef = useRef(null);

    // Initial column widths, setting a default width of 100px for each column
    const [columnWidths, setColumnWidths] = useState({
        no: 5,
        complianceRisk: 110,
        default: 1
    });

    const tableRef = useRef(null);
    const columnRefs = useRef({});
    const resizingState = useRef({ startX: 0, startWidth: 0, containerWidth: 0 });

    const loadDatasFromLocalStorage = () => {
        const storedData = JSON.parse(localStorage.getItem('allSheetFinal')) || [];
        const currentSheetData = storedData.find(sheetData => {
            if (tabName === "Tab1") return sheetData.sheet === "High Risk - 기술 자료 요청";
            if (tabName === "Tab2") return sheetData.sheet === "Potential Risk - 일반 자료 요청";
            if (tabName === "Tab3") return sheetData.sheet === "No Risk - 자료 요청 없음";
            if (tabName === "Tab4") return sheetData.sheet === "최종 Risk";
            return false;
        });

        const requestedTitleIndex = currentSheetData.headers.findIndex(header => header === "자료요청 시스템 제목");
        const requestedTitleIndex2 = currentSheetData.headers.findIndex(header => header === "자료요청 시스템 사용 확률");

        if (currentSheetData) {
            const loadedData = tabName === "Tab4"
                ? currentSheetData.rows.map((row, index) => {
                    // Tab4일 경우의 로직
                    const rowData = { id: index + 1, no: index + 1 };

                    row.forEach((value, i) => {
                        // Tab4에서는 field0, field1... 형태로 row[i] 값을 저장
                        rowData[`field${i}`] = row[i] || '';
                    });

                    return rowData;
                })
                : currentSheetData.rows.map((row, index) => {
                    // Tab4가 아닐 경우의 기존 로직
                    const rowData = { id: index + 1, no: index + 1 };

                    row.forEach((value, i) => {
                        // field0, field1... 형태로 row[i+4] 값을 저장
                        rowData[`field${i}`] = row[i + 5] || '';
                    });

                    // 추가 필드 설정
                    rowData.complianceRisk = row[2] || '';
                    rowData.MoveColor = row[3] || '';

                    return rowData;
                });


            setDatas(loadedData);
            setButtonStates(loadedData.map(data => data.complianceRisk === 'Risk'));

            // "자료요청 시스템 제목" 열에 데이터가 있는지 확인
            const hasDataInRequestedTitleColumn = currentSheetData.rows.some(row => row[requestedTitleIndex] && row[requestedTitleIndex] !== '');
            const hasDataInRequestedTitleColumn2 = currentSheetData.rows.some(row => row[requestedTitleIndex2] && row[requestedTitleIndex2] !== '');

            if (currentSheetData.headers) {
                const initialWidths = currentSheetData.headers.reduce((acc, header, index) => {
                    if (currentSheetData.headers) {
                        const initialWidths = currentSheetData.headers.reduce((acc, header, index) => {
                            if (header === "본문") {
                                acc[`field${index}`] = 400; // "본문" 헤더는 너비를 400px로 설정
                            } else if (header === "판단 근거 문장") {
                                acc[`field${index}`] = 300; // "판단 근거 문장" 헤더는 너비를 300px로 설정
                            } else if (header === "No") {
                                acc[`field${index}`] = 5; // "판단 근거 문장" 헤더는 너비를 300px로 설정
                            } else if (header === "자료요청 시스템 제목") {
                                // 데이터 존재 여부에 따라 너비를 조건부로 설정
                                acc[`field${index}`] = hasDataInRequestedTitleColumn ? 100 : 1;
                            } else if (header === '자료요청 시스템 사용 확률') {
                                acc[`field${index}`] = hasDataInRequestedTitleColumn2 ? 100 : 1;
                            } else if (header === '자료요청 시스템 제목') {
                                acc[`field${index}`] = 100;
                            } else {
                                acc[`field${index}`] = columnWidths.default; // 기타 헤더는 기본 너비를 사용
                            }
                            return acc;
                        }, {});

                        if (tabName === 'Tab3') {
                            initialWidths.complianceRisk = 93;
                        } else {
                            initialWidths.complianceRisk = 150;
                        }
                        setColumnWidths(prev => ({ ...prev, ...initialWidths }));
                    }
                })
            }
        }
    };

    const getColumnsFromHeaders = (tabName) => {
        const storedData = JSON.parse(localStorage.getItem('allSheetFinal')) || [];
        const sheetMap = {
            "Tab1": "High Risk - 기술 자료 요청",
            "Tab2": "Potential Risk - 일반 자료 요청",
            "Tab3": "No Risk - 자료 요청 없음",
            "Tab4": "최종 Risk"
        };
        const currentSheetData = storedData.find(sheetData => sheetData.sheet === sheetMap[tabName]);

        const columns = [{ key: 'no', label: 'No' }];
        if (currentSheetData && currentSheetData.headers) {
            currentSheetData.headers.forEach((headerName, index) => {
                columns.push({
                    key: `field${index}`,
                    label: headerName
                });
            });
        }
        if (tabName !== "Tab4" && isTab4Visible === false) {
            columns.push({ key: 'complianceRisk', label: 'Compliance Risk' });
        }
        return columns;
    };

    const selectedColumns = getColumnsFromHeaders(tabName);

    useLayoutEffect(() => {
        loadDatasFromLocalStorage();
    }, [tabName]);

    const startResizing = (e, columnKey) => {
        // "ComplianceRisk" 열의 크기 조정을 비활성화
        if (columnKey === 'complianceRisk') {
            console.log("ComplianceRisk 열은 크기 조정이 비활성화되었습니다."); // 디버그: ComplianceRisk 열 무시
            return;
        }
    
        // 현재 테이블 너비를 계산
        const containerWidth = Object.values(columnWidths).reduce((total, width) => total + width, 0);
        console.log("현재 테이블 전체 너비:", containerWidth); // 디버그: 테이블 전체 너비 출력
    
        const startWidth = columnRefs.current[columnKey] ? columnRefs.current[columnKey].offsetWidth : 0;
        const columnRightEdge = columnRefs.current[columnKey].getBoundingClientRect().right;
         //     const startX = e.clientX;
    //     const offset = startX - columnRightEdge + 200; // 마우스 포인터와 열 경계선의 차이
        const startX = e.clientX + 150;
    
        console.log("열 시작 너비:", startWidth); // 디버그: 시작 너비 확인
        console.log("마우스 시작 X 좌표:", startX); // 디버그: 마우스 시작 X 좌표
    
        resizingState.current = { startX, startWidth, containerWidth };
    
        const onMouseMove = (moveEvent) => {
            const deltaX = moveEvent.clientX - resizingState.current.startX;
            const newWidth = Math.max(resizingState.current.startWidth + deltaX, 10); // 최소 너비 10px

            //'no'열의 최대 너비를 10px로 제한
            if (columnKey === 'no' && newWidth > 10) {
                newWidth = 10;
            }
            if (columnKey === 'complianceRisk' && newWidth > 150) {
                newWidth = 150;
            }
    
            console.log("마우스 이동 거리 (deltaX):", deltaX); // 디버그: 마우스 이동 거리 출력
            console.log("새로운 열 너비:", newWidth); // 디버그: 새로운 열 너비 출력
    
            setColumnWidths((prevWidths) => {
                const updatedWidths = { ...prevWidths, [columnKey]: newWidth };
                const totalResizableWidth = resizingState.current.containerWidth;
    
                console.log("조정 가능한 총 너비:", totalResizableWidth); // 디버그: 조정 가능한 총 너비 출력
    
                const scalingFactor = totalResizableWidth / Object.values(updatedWidths).reduce((a, b) => a + b);
                console.log("스케일링 비율:", scalingFactor); // 디버그: 스케일링 비율 확인
    
                Object.keys(updatedWidths).forEach(key => {
                    if (key !== 'no' && key !== 'complianceRisk') {
                        updatedWidths[key] *= scalingFactor;
                    }
                });
    
                console.log("업데이트된 열 너비:", updatedWidths); // 디버그: 업데이트된 열 너비 확인
    
                return updatedWidths;
            });
        };
    
        const onMouseUp = () => {
            console.log("마우스 업 이벤트 발생, 크기 조정 종료."); // 디버그: 마우스 업 이벤트 발생 확인
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };
    
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = datas.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleApplyAction = async () => {  // async 추가
        console.log("=== Apply 버튼 클릭됨 ===");
    
        // localStorage에서 데이터 가져오기
        let allSheetData = JSON.parse(localStorage.getItem('allSheetFinal')) || [];
        const highRiskSheetData = allSheetData.find(sheetData => sheetData.sheet === "High Risk - 기술 자료 요청");
        const noRiskSheetData = allSheetData.find(sheetData => sheetData.sheet === "No Risk - 자료 요청 없음");
        const potentialRiskSheetData = allSheetData.find(sheetData => sheetData.sheet === "Potential Risk - 일반 자료 요청");
    
        if (tabName === "Tab1") {
            // 기존 Tab1에서 No Risk로 이동하는 로직 (이전 코드 유지)
            if (highRiskSheetData && noRiskSheetData) {
                // Step 1: High Risk에서 No Risk로 이동할 항목 필터링
                const itemsToMove = highRiskSheetData.rows.filter(row => row[2] === 'No Risk');
                console.log("이동할 항목:", itemsToMove);
    
                // Step 2: High Risk 탭에서 이동할 항목 제거
                highRiskSheetData.rows = highRiskSheetData.rows.filter(row => row[2] !== 'No Risk');
                console.log("High Risk에서 제거된 후의 rows:", highRiskSheetData.rows);
    
               
                itemsToMove.forEach(item => {
                    const Movetype =  item[3];
                    item[3] = Movetype === 'move' ? 'None' : 'move';               // 원래 위치의 상태 초기화
                });
    
                noRiskSheetData.rows = [...itemsToMove, ...noRiskSheetData.rows];
                //console.log("No Risk 탭에 추가된 후의 rows:", noRiskSheetData.rows);
    
                // Step 4: localStorage에 업데이트된 allSheetData 저장
                localStorage.setItem('allSheetFinal', JSON.stringify(allSheetData));
    
                // Step 5: 상태를 재로딩하여 적용
                loadDatasFromLocalStorage();
    
                // Step 6: 500ms 대기
                await new Promise(resolve => setTimeout(resolve, 300)); // 대기 시간 추가
            } else {
                console.log("오류: 이동할 수 없습니다. 필수 데이터가 누락되었습니다.");
            }
    
        } else if (tabName === "Tab2") {
            // Tab2에서 High Risk로 이동하는 로직 추가
            if (potentialRiskSheetData && highRiskSheetData) {
                // Step 1: Potential Risk에서 High Risk로 이동할 항목 필터링
                const itemsToMove = potentialRiskSheetData.rows.filter(row => row[2] === 'Risk');
                console.log("Potential Risk에서 High Risk로 이동할 항목:", itemsToMove);
    
                // Step 2: Potential Risk 탭에서 이동할 항목 제거
                potentialRiskSheetData.rows = potentialRiskSheetData.rows.filter(row => row[2] !== 'Risk');
                console.log("Potential Risk에서 제거된 후의 rows:", potentialRiskSheetData.rows);
    
                // Step 3: 이동 항목을 High Risk 탭 상단에 추가하고, 배경색을 회색으로 설정
                itemsToMove.forEach(item => {
                    item[3] = 'move';     // 회색 배경을 위한 플래그 추가
                });
    
                highRiskSheetData.rows = [...itemsToMove, ...highRiskSheetData.rows];
                console.log("High Risk 탭에 추가된 후의 rows:", highRiskSheetData.rows);
    
                // Step 4: localStorage에 업데이트된 allSheetData 저장
                localStorage.setItem('allSheetFinal', JSON.stringify(allSheetData));
    
                // Step 5: 상태를 재로딩하여 적용
                loadDatasFromLocalStorage();
    
                // Step 6: 500ms 대기
                await new Promise(resolve => setTimeout(resolve, 500)); // 대기 시간 추가
            } else {
                console.log("오류: 이동할 수 없습니다. 필수 데이터가 누락되었습니다.");
            }

        } else if (tabName === "Tab3") {
             // Tab3 (No Risk)에서 High Risk로 이동하는 로직 추가
            if (noRiskSheetData && highRiskSheetData) {
                // Step 1: No Risk에서 High Risk로 이동할 항목 필터링
                const itemsToMove = noRiskSheetData.rows.filter(row => row[2] === 'Risk');
                //console.log("No Risk에서 High Risk로 이동할 항목:", itemsToMove);

                // Step 2: No Risk 탭에서 이동할 항목 제거
                noRiskSheetData.rows = noRiskSheetData.rows.filter(row => row[2] !== 'Risk');
                //console.log("No Risk에서 제거된 후의 rows:", noRiskSheetData.rows);

                // Step 3: 이동 항목을 High Risk 탭 상단에 추가하고, 배경색을 회색으로 설정
                itemsToMove.forEach(item => {
                    const Movetype =  item[3];
                    item[3] = Movetype === 'move' ? 'None' : 'move';
                });

                highRiskSheetData.rows = [...itemsToMove, ...highRiskSheetData.rows];
                //console.log("High Risk 탭에 추가된 후의 rows:", highRiskSheetData.rows);

                // Step 4: localStorage에 업데이트된 allSheetData 저장
                localStorage.setItem('allSheetFinal', JSON.stringify(allSheetData));

                // Step 5: 상태를 재로딩하여 적용
                loadDatasFromLocalStorage();

                // Step 6: 500ms 대기
                await new Promise(resolve => setTimeout(resolve, 500)); // 대기 시간 추가
            } else {
                console.log("오류: 이동할 수 없습니다. 필수 데이터가 누락되었습니다.");
            }
        }
        movedRows();
    };

    // 토글 기능: 버튼 포커스 제거와 debounce 추가로 깜빡임 최소화
    const handleToggle = useCallback((index) => {
        const actualIndex = indexOfFirstItem + index;
        setButtonStates((prevButtonStates) => {
            const updatedButtonStates = [...prevButtonStates];
            updatedButtonStates[actualIndex] = !updatedButtonStates[actualIndex];

            setDatas((prevDatas) => {
                const updatedDatas = prevDatas.map((data, dataIndex) => {
                    if (dataIndex === actualIndex) {
                        const newRiskStatus = updatedButtonStates[actualIndex] ? 'Risk' : 'No Risk';
                        return { ...data, complianceRisk: newRiskStatus };
                    }
                    return data;
                });

                // localStorage 동기화
                let allSheetData = JSON.parse(localStorage.getItem('allSheetFinal')) || [];
                allSheetData = allSheetData.map((sheetData) => {
                    if (tabName === "Tab1" && sheetData.sheet === "High Risk - 기술 자료 요청") {
                        sheetData.rows = sheetData.rows.map((row, rowIndex) => {
                            if (rowIndex === actualIndex) row[2] = updatedButtonStates[actualIndex] ? 'Risk' : 'No Risk';
                            return row;
                        });
                    } else if (tabName === "Tab2" && sheetData.sheet === "Potential Risk - 일반 자료 요청") {
                        sheetData.rows = sheetData.rows.map((row, rowIndex) => {
                            if (rowIndex === actualIndex) row[2] = updatedButtonStates[actualIndex] ? 'Risk' : 'No Risk';
                            return row;
                        });
                    } else if (tabName === "Tab3" && sheetData.sheet === "No Risk - 자료 요청 없음") {
                        sheetData.rows = sheetData.rows.map((row, rowIndex) => {
                            if (rowIndex === actualIndex) row[2] = updatedButtonStates[actualIndex] ? 'Risk' : 'No Risk';
                            return row;
                        });
                    }
                    return sheetData;
                });

                localStorage.setItem('allSheetFinal', JSON.stringify(allSheetData));
                //loadDatasFromLocalStorage();

                return updatedDatas;
            });

            return updatedButtonStates;
        });
    }, [tabName, indexOfFirstItem]);


    // 툴팁 표시 핸들러
    const handleColumnClick = (event, content) => {
        if (content === undefined || content === '') return;
        if (content === 'Risk' || content === 'No Risk') return;

        const clickY = event.clientY;
        const clickX = event.clientX;

        setTooltip({
            visible: true,
            content,
            top: clickY,
            left: clickX + 15,
        });
    };

    // 툴팁 숨기기 핸들러
    const hideTooltip = () => {
        setTooltip({ ...tooltip, visible: false });
    };

    // 테이블 외부 클릭 시 툴팁 숨기기
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                tooltipRef.current &&
                !tooltipRef.current.contains(event.target) && // 툴팁 외부 클릭 감지
                !tableRef.current.contains(event.target) // 테이블 외부 클릭 감지
            ) {
                hideTooltip(); // 툴팁 숨기기
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    return (
        <div>
            <div style={{ width: '1400px'}}> {/* Fixed width for the table container */}
                <table className="eval-table" ref={tableRef}>
                    <thead>
                        <tr>
                            {selectedColumns.map((column) => (
                                <th
                                    key={column.key}
                                    ref={(el) => {
                                        if (el) columnRefs.current[column.key] = el;
                                    }}
                                    style={{
                                        width: `${columnWidths[column.key] || columnWidths.default}px`,
                                        position: 'relative'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <span>{column.label}</span>
                                        {column.key === 'complianceRisk' && (
                                            <button
                                                style={{
                                                    padding: '4px 7px',
                                                    backgroundColor: '#E7E7E7',
                                                    border: 'none',
                                                    borderRadius: '25px',
                                                    cursor: 'pointer',
                                                    fontSize: '12px',
                                                    color: '#4D4D4D', 
                                                }}
                                                onClick={handleApplyAction}
                                            >
                                                적용
                                            </button>
                                        )}
                                        <div
                                            onMouseDown={(e) => startResizing(e, column.key)}
                                            style={{
                                                cursor: 'col-resize',
                                                position: 'absolute',
                                                right: 0,
                                                top: 0,
                                                width: '5px',
                                                height: '100%',
                                                backgroundColor: 'transparent'
                                            }}
                                        />
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((row, rowIndex) => (
                            <tr key={rowIndex} className={row.MoveColor === 'move' ? 'row-gray' : 'row-white'}>
                            {selectedColumns.map((column, colIndex) => (
                                <td
                                    key={colIndex}
                                    onClick={(e) => handleColumnClick(e, row[column.key])} // 각 셀 클릭 시 handleColumnClick 호출
                                >
                                    {column.key === 'complianceRisk' ? (
                                        <ToggleButton
                                            isRisk={buttonStates[indexOfFirstItem + rowIndex]}
                                            onClick={() => handleToggle(rowIndex)}
                                        />
                                    ) : (
                                        row[column.key]
                                    )}
                                </td>
                            ))}
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 툴팁 렌더링 */}
            {tooltip.visible && (
                <div
                    className="eval-tooltip"
                    ref={tooltipRef}
                    style={{ top: tooltip.top, left: tooltip.left, position: 'absolute' }}
                    onMouseLeave={hideTooltip} // 마우스를 툴팁 밖으로 옮기면 숨기기
                >
                    {tooltip.content}
                </div>
            )}

            {/* <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="pagination-container" style={{ textAlign: "center", flexGrow: 1 }}>
                    <Pagination postsPerPage={itemsPerPage} totalPosts={datas.length} paginate={paginate} currentPage={currentPage} />
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

                    onClick={isTab4Visible ? () => handleEdit() : () => handleEvalEnd()}>  {isTab4Visible ? '수정하기' : '평가완료'}
                    </button>
                </div>
            </div> */}

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="pagination-container" style={{ textAlign: "center", flexGrow: 1, marginTop: '20px' }}>
                    <Pagination postsPerPage={itemsPerPage} totalPosts={datas.length} paginate={paginate} currentPage={currentPage} />
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <div>
                    <button className="eval-button-run" onClick={isTab4Visible ? () => handleEdit() : () => handleEvalEnd()}>  {isTab4Visible ? '수정하기' : '평가 완료'}</button>
                </div>
            </div>
        </div>
    );
};

export default EvaluationTableView;
