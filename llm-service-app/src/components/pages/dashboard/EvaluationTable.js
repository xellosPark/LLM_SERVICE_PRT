import React, { useState, useEffect, useCallback, useRef } from 'react';
import Paper from '@mui/material/Paper';
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import Pagination from '../Pagination/Pagination';
import './EvaluationTable.css';

// 버튼 포커스 방지용으로 React.memo 적용 및 포커스 제거
const ToggleButton = React.memo(({ isRisk, onClick }) => (
    <button
        onClick={(e) => {
            e.preventDefault(); // 기본 이벤트 방지
            e.target.blur(); // 버튼 클릭 시 포커스를 제거하여 깜빡임 방지
            onClick();
        }}
        style={{
            width: '100px',
            height: '30px',
            color: 'white',
            backgroundColor: isRisk ? 'red' : 'gray',
            border: 'none',
            borderRadius: '5px',
            transition: 'background-color 0.3s ease',
            cursor: 'pointer',
        }}
    >
        {isRisk ? 'Risk' : 'No Risk'}
    </button>
));

const EvaluationTable = ({ tabName, movedRows }) => {
    const [datas, setDatas] = useState([]);
    const [buttonStates, setButtonStates] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [sortModel, setSortModel] = useState([{ field: 'no', sort: 'asc' }]);
    const tooltipRef = useRef(null);
    const [tooltip, setTooltip] = useState({ visible: false, content: '', top: 0, left: 0 });

    // Custom styling for DataGrid
    const CustomDataGrid = styled(DataGrid)({
        '& .MuiDataGrid-columnHeaders': {
            fontSize: '12px',
        },
        '& .MuiDataGrid-columnHeaderTitle': {
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
        },
        '& .MuiDataGrid-columnHeader[data-field="spacer"]': {
            backgroundColor: '#ECF0F1',
            border: 'none',
            minWidth: '50px',
            maxWidth: '50px',
            cursor: 'default',
            borderTop: '2px solid #ECF0F1',
            borderBottom: '2px solid #ECF0F1',
        },
        '& .MuiDataGrid-cell': {
            borderRight: '1px solid rgba(224, 224, 224, 1)',
            fontSize: '12px',
            textAlign: 'center',
        },
        '& .MuiDataGrid-cell:last-child': {
            borderRight: 'none',
        },
        '& .MuiDataGrid-cell.spacer-cell': {
            borderTop: '2px solid #ECF0F1',
            borderBottom: '2px solid #ECF0F1',
            backgroundColor: '#ECF0F1',
        },
    });

    // 로컬 스토리지에서 데이터 로드 함수
    const loadDatasFromLocalStorage = () => {
        const storedData = JSON.parse(localStorage.getItem('allSheetData')) || [];
        const currentSheetData = storedData.find(sheetData => {
            if (tabName === "Tab1") return sheetData.sheet === "High Risk - 기술 자료 요청";
            if (tabName === "Tab2") return sheetData.sheet === "Potential Risk - 일반 자료 요청";
            if (tabName === "Tab3") return sheetData.sheet === "No Risk - 자료 요청 없음";
            return false;
        });

        if (currentSheetData) {
            const loadedData = currentSheetData.rows.map((row, index) => {
                const complianceRisk = tabName === "Tab3" ? row[11] : row[12];
                const MoveColor = tabName === "Tab3" ? row[12] : row[13];
        
                return {
                    id: index + 1,
                    no: index + 1,
                    file: row[0] || '',
                    send: row[1] || '',
                    receive: row[2] || '',
                    title: row[3] || '',
                    time: row[4] || '',
                    fileName: row[5] || '',
                    reference: row[6] || '',
                    hiddenRef: row[7] || '',
                    analyzeFiles: row[8] || '',
                    name: row[9] || '',
                    mainContent: row[10] || '',
                    content: (tabName === "Tab3") ? '' : (row[11] || ''),
                    complianceRisk: complianceRisk,
                    MoveColor: MoveColor  // 'MoveColor' property to indicate conditional styling
                };
            });
            setDatas(loadedData);
            setButtonStates(loadedData.map(data => data.complianceRisk === 'Risk'));
        }
    };

    useEffect(() => {
        setCurrentPage(1);
        loadDatasFromLocalStorage();
    }, [tabName]);

    const getSortedData = () => {
        if (sortModel.length === 0) return datas;
        const { field, sort } = sortModel[0];
        return [...datas].sort((a, b) => {
            if (a[field] < b[field]) return sort === 'asc' ? -1 : 1;
            if (a[field] > b[field]) return sort === 'asc' ? 1 : -1;
            return 0;
        });
    };

    const sortedData = getSortedData();
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // 토글 기능: 버튼 포커스 제거와 debounce 추가로 깜빡임 최소화
    const handleToggle = useCallback((index) => {
        setButtonStates((prevButtonStates) => {
            const updatedButtonStates = [...prevButtonStates];
            updatedButtonStates[index] = !updatedButtonStates[index];

            setDatas((prevDatas) => {
                const updatedDatas = prevDatas.map((data, dataIndex) => {
                    if (dataIndex === index) {
                        const newRiskStatus = updatedButtonStates[index] ? 'Risk' : 'No Risk';
                        return { ...data, complianceRisk: newRiskStatus };
                    }
                    return data;
                });

                // localStorage 동기화
                let allSheetData = JSON.parse(localStorage.getItem('allSheetData')) || [];
                allSheetData = allSheetData.map((sheetData) => {
                    if (tabName === "Tab1" && sheetData.sheet === "High Risk - 기술 자료 요청") {
                        sheetData.rows = sheetData.rows.map((row, rowIndex) => {
                            if (rowIndex === index) row[12] = updatedButtonStates[index] ? 'Risk' : 'No Risk';
                            return row;
                        });
                    } else if (tabName === "Tab2" && sheetData.sheet === "Potential Risk - 일반 자료 요청") {
                        sheetData.rows = sheetData.rows.map((row, rowIndex) => {
                            if (rowIndex === index) row[12] = updatedButtonStates[index] ? 'Risk' : 'No Risk';
                            return row;
                        });
                    } else if (tabName === "Tab3" && sheetData.sheet === "No Risk - 자료 요청 없음") {
                        sheetData.rows = sheetData.rows.map((row, rowIndex) => {
                            if (rowIndex === index) row[11] = updatedButtonStates[index] ? 'Risk' : 'No Risk';
                            return row;
                        });
                    }
                    return sheetData;
                });

                localStorage.setItem('allSheetData', JSON.stringify(allSheetData));
                loadDatasFromLocalStorage();

                return updatedDatas;
            });

            return updatedButtonStates;
        });
    }, [tabName]);

    // const handleApplyAction = async () => {  // async 추가
    //     console.log("=== Apply 버튼 클릭됨 ===");

    //     // localStorage에서 데이터 가져오기
    //     let allSheetData = JSON.parse(localStorage.getItem('allSheetData')) || [];
    //     const highRiskSheetData = allSheetData.find(sheetData => sheetData.sheet === "High Risk - 기술 자료 요청");
    //     const noRiskSheetData = allSheetData.find(sheetData => sheetData.sheet === "No Risk - 자료 요청 없음");

    //     if (highRiskSheetData && noRiskSheetData) {
    //         // Step 1: High Risk에서 No Risk로 이동할 항목 필터링
    //         const itemsToMove = highRiskSheetData.rows.filter(row => row[12] === 'No Risk');
    //         console.log("이동할 항목:", itemsToMove);

    //         // Step 2: High Risk 탭에서 이동할 항목 제거
    //         highRiskSheetData.rows = highRiskSheetData.rows.filter(row => row[12] !== 'No Risk');
    //         console.log("High Risk에서 제거된 후의 rows:", highRiskSheetData.rows);

    //         // Step 3: 이동 항목을 No Risk 탭 상단에 추가하고, 배경색을 노란색으로 설정
    //         itemsToMove.forEach(item => {
    //             item[11] = item[12];        // No Risk 탭에서 사용할 컬럼에 상태 설정
    //             item[12] = '';              // 원래 위치의 상태 초기화
    //             item.MoveColor = 'move';      // 회색 배경을 위한 플래그 추가
    //         });

    //         noRiskSheetData.rows = [...itemsToMove, ...noRiskSheetData.rows];
    //         console.log("No Risk 탭에 추가된 후의 rows:", noRiskSheetData.rows);

    //         // Step 4: localStorage에 업데이트된 allSheetData 저장
    //         localStorage.setItem('allSheetData', JSON.stringify(allSheetData));

    //         // Step 5: 상태를 재로딩하여 적용
    //         loadDatasFromLocalStorage();

    //         // Step 6: 500ms 대기
    //         await new Promise(resolve => setTimeout(resolve, 300)); // 대기 시간 추가
    //     } else {
    //         console.log("오류: 이동할 수 없습니다. 필수 데이터가 누락되었습니다.");
    //     }
    // };

    const handleApplyAction = async () => {  // async 추가
        console.log("=== Apply 버튼 클릭됨 ===");
    
        // localStorage에서 데이터 가져오기
        let allSheetData = JSON.parse(localStorage.getItem('allSheetData')) || [];
        const highRiskSheetData = allSheetData.find(sheetData => sheetData.sheet === "High Risk - 기술 자료 요청");
        const noRiskSheetData = allSheetData.find(sheetData => sheetData.sheet === "No Risk - 자료 요청 없음");
        const potentialRiskSheetData = allSheetData.find(sheetData => sheetData.sheet === "Potential Risk - 일반 자료 요청");
    
        if (tabName === "Tab1") {
            // 기존 Tab1에서 No Risk로 이동하는 로직 (이전 코드 유지)
            if (highRiskSheetData && noRiskSheetData) {
                // Step 1: High Risk에서 No Risk로 이동할 항목 필터링
                const itemsToMove = highRiskSheetData.rows.filter(row => row[12] === 'No Risk');
                console.log("이동할 항목:", itemsToMove, itemsToMove.length);
                
                // Step 2: High Risk 탭에서 이동할 항목 제거
                highRiskSheetData.rows = highRiskSheetData.rows.filter(row => row[12] !== 'No Risk');
                console.log("High Risk에서 제거된 후의 rows:", highRiskSheetData.rows);
    
                // Step 3: 이동 항목을 No Risk 탭 상단에 추가하고, 배경색을 노란색으로 설정
                // itemsToMove.forEach(item => {
                //     item[11] = item[12];     // No Risk 탭에서 사용할 컬럼에 상태 설정
                //     item[12] = 'move';       // 원래 위치의 상태 초기화
                //     item[13] = '';           // 회색 배경을 위한 플래그 추가
                // });
                itemsToMove.forEach(item => {
                    const Movetype =  item[13];
                    item[13] = item[11];      // 회색 배경을 위한 플래그 추가
                    item[11] = item[12];         // No Risk 탭에서 사용할 컬럼에 상태 설정
                    item[12] = Movetype === 'move' ? 'None' : 'move';               // 원래 위치의 상태 초기화
                    
                });
    
                noRiskSheetData.rows = [...itemsToMove, ...noRiskSheetData.rows];
                console.log("No Risk 탭에 추가된 후의 rows:", noRiskSheetData.rows);
    
                // Step 4: localStorage에 업데이트된 allSheetData 저장
                localStorage.setItem('allSheetData', JSON.stringify(allSheetData));
    
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
                const itemsToMove = potentialRiskSheetData.rows.filter(row => row[12] === 'Risk');
                console.log("Potential Risk에서 High Risk로 이동할 항목:", itemsToMove);
    
                // Step 2: Potential Risk 탭에서 이동할 항목 제거
                potentialRiskSheetData.rows = potentialRiskSheetData.rows.filter(row => row[12] !== 'Risk');
                console.log("Potential Risk에서 제거된 후의 rows:", potentialRiskSheetData.rows);
    
                // Step 3: 이동 항목을 High Risk 탭 상단에 추가하고, 배경색을 회색으로 설정
                itemsToMove.forEach(item => {
                    item[12] = item[12];         // High Risk 탭에서 사용할 컬럼에 상태 설정
                    item[13] = 'move';     // 회색 배경을 위한 플래그 추가
                });
    
                highRiskSheetData.rows = [...itemsToMove, ...highRiskSheetData.rows];
                console.log("High Risk 탭에 추가된 후의 rows:", highRiskSheetData.rows);
    
                // Step 4: localStorage에 업데이트된 allSheetData 저장
                localStorage.setItem('allSheetData', JSON.stringify(allSheetData));
    
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
                const itemsToMove = noRiskSheetData.rows.filter(row => row[11] === 'Risk');
                //console.log("No Risk에서 High Risk로 이동할 항목:", itemsToMove);

                // Step 2: No Risk 탭에서 이동할 항목 제거
                noRiskSheetData.rows = noRiskSheetData.rows.filter(row => row[11] !== 'Risk');
                //console.log("No Risk에서 제거된 후의 rows:", noRiskSheetData.rows);

                // Step 3: 이동 항목을 High Risk 탭 상단에 추가하고, 배경색을 회색으로 설정
                itemsToMove.forEach(item => {
                    const Movetype =  item[12];
                    item[12] = item[11];
                    item[11] = item[13];
                    item[13] = Movetype === 'move' ? 'None' : 'move';
                    
                });

                highRiskSheetData.rows = [...itemsToMove, ...highRiskSheetData.rows];
                //console.log("High Risk 탭에 추가된 후의 rows:", highRiskSheetData.rows);

                // Step 4: localStorage에 업데이트된 allSheetData 저장
                localStorage.setItem('allSheetData', JSON.stringify(allSheetData));

                // Step 5: 상태를 재로딩하여 적용
                loadDatasFromLocalStorage();

                // Step 6: 500ms 대기
                await new Promise(resolve => setTimeout(resolve, 500)); // 대기 시간 추가
            } else {
                console.log("오류: 이동할 수 없습니다. 필수 데이터가 누락되었습니다.");
            }
        }
    };

    const handleColumnClick = (event, content) => {
        if (content === undefined || content === '') return;
    
        const clickY = event.clientY;
        const clickX = event.clientX;
    
        setTooltip({
          visible: true,
          content,
          top: clickY, // 초기 top 값
          left: clickX + 15,
        });
      };

      const closeTooltip = () => {
        setTooltip({ visible: false, content: '', top: 0, left: 0 });
      };

      useEffect(() => {
        const handleClickOutside = (event) => {
          if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
            closeTooltip();
          }
        };
    
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, []);

      useEffect(() => {
        if (tooltip.content === undefined || tooltip.content === '') return;
    
        if (tooltip.visible && tooltipRef.current) {
          const tooltipElement = tooltipRef.current;
          const windowHeight = window.innerHeight;
          const tooltipHeight = tooltipElement.offsetHeight;
          const tooltipTop = tooltip.top;
    
          const adjustedTop =
            tooltipTop + tooltipHeight > windowHeight
              ? windowHeight - tooltipHeight - 10
              : tooltipTop;
    
          setTooltip((prevTooltip) => ({
            ...prevTooltip,
            top: adjustedTop,
          }));
        }
      }, [tooltip.visible, tooltip.top]);

      const columns = [
        { field: 'no', headerName: 'Id', width: 40, minWidth: 0.5, sortable: false, //flex: 0.15, 
            renderHeader: () => null
        },
        
        { field: 'file', headerName: 'File', width: 1,  minWidth: 1, sortable: false, //flex: 0.1,
            renderCell: (params) => (
                <div onClick={(e) => handleColumnClick(e, params.value)}>
                  {params.value}
                </div>
              ),
        },
        { field: 'send', headerName: '보낸사람/사용자',  width: 1,  minWidth: 1, sortable: false, //flex: 0.1,
            renderCell: (params) => (
                <div onClick={(e) => handleColumnClick(e, params.value)}>
                  {params.value}
                </div>
              ),
        },
        { field: 'receive', headerName: '받는사람/대화상대/호스트', width: 1,  minWidth: 1, sortable: false, //flex: 0.1,
            renderCell: (params) => (
                <div onClick={(e) => handleColumnClick(e, params.value)}>
                  {params.value}
                </div>
              ),
        },
        { field: 'title', headerName: '제목/서브 URL/인스턴트 메신저/웹하드', width: 1,  minWidth: 1, sortable: false, //flex: 0.1,
            renderCell: (params) => (
                <div onClick={(e) => handleColumnClick(e, params.value)}>
                  {params.value}
                </div>
              ),
         },
        { field: 'time', headerName: '시각', width: 1,  minWidth: 1, sortable: false, //flex: 0.1,
            renderCell: (params) => (
                <div onClick={(e) => handleColumnClick(e, params.value)}>
                {params.value}
                </div>
            ),
        },
        { field: 'fileName', headerName: '파일이름', width: 1, minWidth: 1, sortable: false, //flex: 0.1,
            renderCell: (params) => (
                <div onClick={(e) => handleColumnClick(e, params.value)}>
                  {params.value}
                </div>
              ),
        },
        { field: 'reference', headerName: '참조인',minWidth: 1, width: 1, sortable: false, //flex: 0.1,
            renderCell: (params) => (
                <div onClick={(e) => handleColumnClick(e, params.value)}>
                  {params.value}
                </div>
              ),
        },
        { field: 'hiddenRef', headerName: '실수취인/숨은참조/POP3서버 ID',minWidth: 1, width: 1,sortable: false, //flex: 0.1,
            renderCell: (params) => (
                <div onClick={(e) => handleColumnClick(e, params.value)}>
                  {params.value}
                </div>
              ),
         },
        { field: 'analyzeFiles', headerName: '파일 분석 여부', width: 1,sortable: false, minWidth: 1, //flex: 0.1,
            renderCell: (params) => (
                <div onClick={(e) => handleColumnClick(e, params.value)}>
                  {params.value}
                </div>
              ),
        },
        { field: 'name', headerName: <span className="light-gray">이름</span>, width: 1,sortable: false,minWidth: 1, //flex: 0.1,
            renderCell: (params) => (
                <div onClick={(e) => handleColumnClick(e, params.value)} className="light-gray">
                  {params.value}
                </div>
              ),
         },
        { field: 'mainContent', headerName: '본문',minWidth: 1, width: 850,sortable: false, //flex: 2,
            renderCell: (params) => (
                <div onClick={(e) => handleColumnClick(e, params.value)}>
                  {params.value}
                </div>
              ),
          },
        { field: 'content', headerName: '판단 근거 문장',minWidth: 1, width: 430, sortable: false, //flex: 1,
            renderCell: (params) => (
                <div onClick={(e) => handleColumnClick(e, params.value)}>
                  {params.value}
                </div>
              ),
         },
        {
            field: 'complianceRisk',
            headerName: 'Compliance Risk',
            sortable: false,
            // resizable: false,
            minWidth: 1, width: 180, //flex: 0.5,
            renderHeader: () => (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    Compliance Risk
                    <button style={{ padding: '5px 10px', backgroundColor: '#f0f0f0', border: 'none', borderRadius: '5px' }} onClick={handleApplyAction}>
                        적용
                    </button>
                </div>
            ),
            
            renderCell: (params) => {
                const index = params.row.id - 1;
                return (
                    <ToggleButton
                        isRisk={buttonStates[index]}
                        onClick={() => handleToggle(index)}
                    />
                );
                
            }
        },
    ];

    return (
        <div>
            {/* <Paper sx={{ width: "80vw", padding: "25px", maxWidth: "100%", marginLeft: "30px"}}> */}
            <Paper sx={{ width: "80vw", maxWidth: "100%" }}>
                <DataGrid style={{width: '1700px', margin: '0 auto' }}
                    rows={currentItems}
                    columns={columns}
                    pageSize={itemsPerPage}
                    autoHeight
                    hideFooter
                    disableColumnMenu
                    sortModel={sortModel}
                    disableExtendRowFullWidth={true} // 테이블 폭을 고정
                    onSortModelChange={(model) => {
                        setSortModel(model);
                        setCurrentPage(1);
                    }}
                    getRowClassName={(params) =>
                        params.row.MoveColor === 'None' ? 'row-white' : 'row-gray'
                    }
                />
                {tooltip.visible && (
                    <div
                    className="eval-tooltip"
                    ref={tooltipRef}
                    style={{ top: tooltip.top, left: tooltip.left, position: 'absolute' }}
                    >
                    {tooltip.content}
                    </div>
                )}
            </Paper>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '30px' }}>
                <div className="pagination-container" style={{ textAlign: "center", flexGrow: 1 }}>
                    <Pagination postsPerPage={itemsPerPage} totalPosts={datas.length} paginate={paginate} currentPage={currentPage} />
                </div>
            </div>
        </div>
    );
};

export default EvaluationTable;
