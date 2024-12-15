import React, { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react';
import Pagination from '../Pagination/Pagination';
import './EvaluationTable.css';
import { Link } from 'react-router-dom';


const ToggleButton = React.memo(({ isRisk, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <button
            onClick={(e) => {
                e.preventDefault();
                e.target.blur();
                onClick();
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                width: '80px',
                height: '30px',
                color: 'white',
                backgroundColor: isRisk ? 'black' : '#A9A9A9',
                border: 'none',
                borderRadius: '10px',
                transition: 'background-color 0.3s ease, opacity 0.3s ease',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 'bold',
                boxShadow: isRisk ? '2px 2px 5px rgba(0, 0, 0, 0.5)' : '1px 1px 3px rgba(0, 0, 0, 0.3)',
                padding: '5px',
                opacity: isHovered ? 0.8 : 1,
            }}
        >
            {isRisk ? 'Risk' : 'No Risk'}
        </button>
    );
});

const EvaluationTableFinal = ({ tabName, movedRows, handleEvalEnd, handleEdit, isTab4Visible, rowData, id }) => {
    const [datas, setDatas] = useState([]);
    const [buttonStates, setButtonStates] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [tooltip, setTooltip] = useState({ visible: false, content: '', top: 0, left: 0 });
    const tooltipRef = useRef(null);

    const [columnWidths, setColumnWidths] = useState({
        no: 10,
        complianceRisk: 57,
        default: 1
    });

    const tableRef = useRef(null);
    const columnRefs = useRef({});
    const resizingState = useRef({ startX: 0, startWidth: 0, containerWidth: 0 });

    const loadDatasFromLocalStorage = () => {
        const storedData = JSON.parse(sessionStorage.getItem('allSheetFinal')) || [];
        const currentSheetData = storedData.find(sheetData => {
            if (tabName === "Tab1") return sheetData.sheet === "High Risk - 기술 자료 요청";
            if (tabName === "Tab2") return sheetData.sheet === "No Risk - 일반 자료 요청";
            if (tabName === "Tab3") return sheetData.sheet === "No Risk - 자료 요청 없음";
            if (tabName === "Tab4") return sheetData.sheet === "최종 Risk";
            return false;
        });

        if (currentSheetData) {
            const loadedData = tabName === "Tab4"
                ? currentSheetData.rows.map((row, index) => {
                    const rowData = { id: index + 1, no: index + 1 };

                    row.forEach((value, i) => {
                        rowData[`field${i}`] = row[i] || '';
                    });
                    return rowData;
                })
                : currentSheetData.rows.map((row, index) => {
                    const rowData = { id: index + 1, no: index + 1 };
                    row.forEach((value, i) => {
                        rowData[`field${i}`] = row[i + 5] || '';
                    });

                    rowData.complianceRisk = row[2] || '';
                    rowData.MoveColor = row[3] || '';
                    return rowData;
                });

            setDatas(loadedData);
            setButtonStates(loadedData.map(data => data.complianceRisk === 'Risk'));

            if (currentSheetData.headers) {
                const initialWidths = currentSheetData.headers.reduce((acc, header, index) => {
                    if (currentSheetData.headers) {
                        const initialWidths = currentSheetData.headers.reduce((acc, header, index) => {
                            if (header === "본문") {
                                acc[`field${index}`] = 400;
                            } else if (header === "판단 근거 문장") {
                                acc[`field${index}`] = 300;
                            } else if (header === "No") {
                                acc[`field${index}`] = 10;
                            } else if (header === '자료요청 시스템 사용 확률') {
                                acc[`field${index}`] = 130;
                            } else if (header === "자료요청 시스템 제목") {
                                acc[`field${index}`] = 110;
                            } else {
                                acc[`field${index}`] = columnWidths.default;
                            }
                            return acc;
                        }, {});

                        if (tabName === 'Tab3') {
                            initialWidths.complianceRisk = 93;
                        } else {
                            initialWidths.complianceRisk = 300;
                        }
                        setColumnWidths(prev => ({ ...prev, ...initialWidths }));
                    }
                })
            }
        }
    };

    const getColumnsFromHeaders = (tabName) => {
        const storedData = JSON.parse(sessionStorage.getItem('allSheetFinal')) || [];
        const sheetMap = {
            "Tab1": "High Risk - 기술 자료 요청",
            "Tab2": "No Risk - 일반 자료 요청",
            "Tab3": "No Risk - 자료 요청 없음",
            "Tab4": "최종 Risk"
        };
        const currentSheetData = storedData.find(sheetData => sheetData.sheet === sheetMap[tabName]);

        const columns = [{ key: 'no', label: 'Id' }];
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
        setCurrentPage(1);
    }, [tabName]);

    const startResizing = (e, columnKey) => {
        if (columnKey === 'complianceRisk') {
            console.log("ComplianceRisk 열은 크기 조정이 비활성화되었습니다.");
            return;
        }
        const containerWidth = Object.values(columnWidths).reduce((total, width) => total + width, 0);
        const startWidth = columnRefs.current[columnKey] ? columnRefs.current[columnKey].offsetWidth : 0;
        const startX = e.clientX + 150;
    
        resizingState.current = { startX, startWidth, containerWidth };
        const onMouseMove = (moveEvent) => {
            const deltaX = moveEvent.clientX - resizingState.current.startX;
            let newWidth = Math.max(resizingState.current.startWidth + deltaX, 10);

            //'no'열의 최대 너비를 10px로 제한
            if (columnKey === 'no' && newWidth > 10) {
                newWidth = 10;
            }
            if (columnKey === 'complianceRisk' && newWidth > 300) {
                newWidth = 300;
            }
    
            setColumnWidths((prevWidths) => {
                const updatedWidths = { ...prevWidths, [columnKey]: newWidth };
                const totalResizableWidth = resizingState.current.containerWidth;
                const scalingFactor = totalResizableWidth / Object.values(updatedWidths).reduce((a, b) => a + b);
                Object.keys(updatedWidths).forEach(key => {
                    if (key !== 'no' && key !== 'complianceRisk') {
                        updatedWidths[key] *= scalingFactor;
                    }
                });
    
                return updatedWidths;
            });
        };
    
        const onMouseUp = () => {
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

    const handleApplyAction = async () => {
        console.log("=== Apply 버튼 클릭됨 ===");

        let allSheetData = JSON.parse(sessionStorage.getItem('allSheetFinal')) || [];
        const highRiskSheetData = allSheetData.find(sheetData => sheetData.sheet === "High Risk - 기술 자료 요청");
        const noRiskSheetData = allSheetData.find(sheetData => sheetData.sheet === "No Risk - 자료 요청 없음");
        const potentialRiskSheetData = allSheetData.find(sheetData => sheetData.sheet === "No Risk - 일반 자료 요청");
    
        if (tabName === "Tab1") {
            if (highRiskSheetData && noRiskSheetData) {
                const itemsToMove = highRiskSheetData.rows.filter(row => row[2] === 'No Risk');
                console.log("이동할 항목:", itemsToMove);

                highRiskSheetData.rows = highRiskSheetData.rows.filter(row => row[2] !== 'No Risk');
                itemsToMove.forEach(item => {
                    const Movetype =  item[3];
                    item[3] = Movetype === 'move' ? 'None' : 'move';
                });
    
                noRiskSheetData.rows = [...itemsToMove, ...noRiskSheetData.rows];
                sessionStorage.setItem('allSheetFinal', JSON.stringify(allSheetData));
                loadDatasFromLocalStorage();
                await new Promise(resolve => setTimeout(resolve, 300));
            } else {
                console.log("오류: 이동할 수 없습니다. 필수 데이터가 누락되었습니다.");
            }
    
        } else if (tabName === "Tab2") {
            if (potentialRiskSheetData && highRiskSheetData) {
                const itemsToMove = potentialRiskSheetData.rows.filter(row => row[2] === 'Risk');
                console.log("Potential Risk에서 High Risk로 이동할 항목:", itemsToMove);

                potentialRiskSheetData.rows = potentialRiskSheetData.rows.filter(row => row[2] !== 'Risk');
                console.log("Potential Risk에서 제거된 후의 rows:", potentialRiskSheetData.rows);
                itemsToMove.forEach(item => {
                    item[3] = 'move';
                });
    
                highRiskSheetData.rows = [...itemsToMove, ...highRiskSheetData.rows];
                console.log("High Risk 탭에 추가된 후의 rows:", highRiskSheetData.rows);
                sessionStorage.setItem('allSheetFinal', JSON.stringify(allSheetData));
                loadDatasFromLocalStorage();
                await new Promise(resolve => setTimeout(resolve, 500));
            } else {
                console.log("오류: 이동할 수 없습니다. 필수 데이터가 누락되었습니다.");
            }

        } else if (tabName === "Tab3") {
            if (noRiskSheetData && highRiskSheetData) {
                const itemsToMove = noRiskSheetData.rows.filter(row => row[2] === 'Risk');
                noRiskSheetData.rows = noRiskSheetData.rows.filter(row => row[2] !== 'Risk');
                itemsToMove.forEach(item => {
                    const Movetype =  item[3];
                    item[3] = Movetype === 'move' ? 'None' : 'move';
                });

                highRiskSheetData.rows = [...itemsToMove, ...highRiskSheetData.rows];
                sessionStorage.setItem('allSheetFinal', JSON.stringify(allSheetData));
                loadDatasFromLocalStorage();
                await new Promise(resolve => setTimeout(resolve, 500));
            } else {
                console.log("오류: 이동할 수 없습니다. 필수 데이터가 누락되었습니다.");
            }
        }
        movedRows();
    };

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

                let allSheetData = JSON.parse(sessionStorage.getItem('allSheetFinal')) || [];
                allSheetData = allSheetData.map((sheetData) => {
                    if (tabName === "Tab1" && sheetData.sheet === "High Risk - 기술 자료 요청") {
                        sheetData.rows = sheetData.rows.map((row, rowIndex) => {
                            if (rowIndex === actualIndex) row[2] = updatedButtonStates[actualIndex] ? 'Risk' : 'No Risk';
                            return row;
                        });
                    } else if (tabName === "Tab2" && sheetData.sheet === "No Risk - 일반 자료 요청") {
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

                sessionStorage.setItem('allSheetFinal', JSON.stringify(allSheetData));
                return updatedDatas;
            });

            return updatedButtonStates;
        });
    }, [tabName, indexOfFirstItem]);

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

    const hideTooltip = () => {
        setTooltip({ ...tooltip, visible: false });
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                tooltipRef.current &&
                !tooltipRef.current.contains(event.target) &&
                !tableRef.current.contains(event.target)
            ) {
                hideTooltip();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '95%'}}>
                <table className="eval-table" ref={tableRef}>
                    <thead>
                        <tr>
                            {selectedColumns.map((column) => (
                                <th
                                    className={isTab4Visible === true ? 'eval-thead-padding' : 'eval-nopadding'}
                                    key={column.key}
                                    ref={(el) => {
                                        if (el) columnRefs.current[column.key] = el;
                                    }}
                                    style={{
                                        width: tabName === "Tab4" && column.key === "no" ? "18px" :
                                        `${columnWidths[column.key] || columnWidths.default}px`,
                                        position: 'relative'
                                    }}
                                >
                                    <div style={{ textAlign: 'center', alignItems: 'center' }}>
                                        <span>{column.label}</span>
                                        {column.key === 'complianceRisk' && (
                                            <button
                                                style={{
                                                    width: '150px',
                                                    position: 'relative',
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
                                    className={isTab4Visible === true ? 'eval-tbody-padding' : 'eval-nopadding'}
                                    key={colIndex}
                                    onClick={(e) => handleColumnClick(e, row[column.key])}
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

            {tooltip.visible && (
                <div
                    className="eval-tooltip"
                    ref={tooltipRef}
                    style={{ top: tooltip.top, left: tooltip.left, position: 'absolute' }}
                >
                    {tooltip.content}
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="pagination-container" style={{ textAlign: "center", flexGrow: 1, marginTop: '20px' }}>
                    <Pagination postsPerPage={itemsPerPage} totalPosts={datas.length} paginate={paginate} currentPage={currentPage} />
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <div>
                    <Link to={`/service/mail-compliance/evaluation/${id}`}
                        state={{ rowData : rowData, isResultEdit : true }}
                        className="eval-final-button-run"
                    >
                        수정하기
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default EvaluationTableFinal;
