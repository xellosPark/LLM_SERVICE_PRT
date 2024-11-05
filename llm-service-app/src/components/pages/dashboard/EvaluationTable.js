import React, { useState, useEffect, useRef } from 'react';
import Paper from '@mui/material/Paper';
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import Pagination from '../Pagination/Pagination'; // Pagination 컴포넌트 경로
import './EvaluationTable.css';

const EvaluationTable = ({ headers, rows, tabName }) => {
    // 컴포넌트가 렌더링될 때 `headers`와 `rows`를 콘솔에 출력
    // useEffect(() => {
    //     console.log('Received headers:', headers);
    //     console.log('Received rows:', rows);
    //     console.log('Current tab name:', tabName);
    // }, [headers, rows]);

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
            minWidth: '50px', // 최소 너비 설정
            maxWidth: '50px', // 최대 너비 설정
            cursor: 'default', // 크기 조절 불가능 표시
            borderTop: '2px solid #ECF0F1', // 상단 테두리 색상
            borderBottom: '2px solid #ECF0F1', // 하단 테두리 색상
        },
        '& .MuiDataGrid-cell': {
            borderRight: '1px solid rgba(224, 224, 224, 1)',
            fontSize: '12px',
            textAlign: 'center',
        },
        '& .MuiDataGrid-cell:last-child': {
            borderRight: 'none',
        },
        // Specific style for the 'spacer' column cells
        '& .MuiDataGrid-cell.spacer-cell': {
            borderTop: '2px solid #ECF0F1', // 셀 상단 테두리 색상
            borderBottom: '2px solid #ECF0F1', // 셀 하단 테두리 색상
            borderLeft: 'none', // Optionally remove the left border
            borderRight: 'none', // Optionally remove the right border
            backgroundColor: '#ECF0F1',
            boxShadow: 'none',
        },
    });

    // `rows` 데이터를 기반으로 `datas` 구조로 변환
    const datas = rows.map((row, index) => ({
        id: index + 1, // 고유 식별자
        no: index + 1, // 번호
        file: row[0] || ``, // 'file' 데이터, 없을 시 기본값 설정
        send: row[1] || ``, // '보낸사람/사용자' 데이터
        receive: row[2] || ``, // '받는사람/대화상대/호스트' 데이터
        title: row[3] || ``, // '제목' 데이터
        time: row[4] || ``, // '시각' 데이터, 없을 시 기본값 설정
        fileName: row[5] || ``, // '파일이름' 데이터
        reference: row[6] || ``, // '참조인' 데이터
        hiddenRef: row[7] || ``, // '실수취인' 데이터
        analyzeFiles: row[8] || ``, //'파일 분석 여부' 데이터
        name: row[9] || ``, //'이름' 데이터
        mainContent: row[10] || ``, // '본문' 데이터
        content: row[11] || ``, //'판단 근거 문장' 데이터
        // complianceRisk: tabName === 'Tab1' ? 'Risk' : 'No Risk', // Tab1일 경우 'Risk', 그렇지 않으면 'No Risk'
        // result: row[8] || (index % 3 === 0 ? 'Success' : 'Error'), // '평가 기록' 데이터, 기본값 설정
    }));

    // 페이지네이션 상태 정의
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12; // 페이지당 표시할 항목 수

    // 정렬 상태 관리
    const [sortModel, setSortModel] = useState([{ field: 'no', sort: 'asc' }]);

    const [tooltip, setTooltip] = useState({ visible: false, content: '', top: 0, left: 0 });
    const tooltipRef = useRef(null);

    // 정렬된 데이터를 반환하는 함수
    const getSortedData = () => {
        if (sortModel.length === 0) return datas;
        const { field, sort } = sortModel[0];
        const sortedData = [...datas].sort((a, b) => {
            if (a[field] < b[field]) return sort === 'asc' ? -1 : 1;
            if (a[field] > b[field]) return sort === 'asc' ? 1 : -1;
            return 0;
        });
        return sortedData;
    };

    const sortedData = getSortedData();

    // 현재 페이지에 해당하는 데이터 슬라이스
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

    // 페이지 변경 핸들러
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // 버튼 클릭 상태 관리
    const [buttonStates, setButtonStates] = useState(
        datas.map((data) => data.complianceRisk === 'Risk')
    );

    // 버튼 토글 핸들러
    const handleToggle = (index) => {
        const updatedStates = [...buttonStates];
        updatedStates[index] = !updatedStates[index];
        setButtonStates(updatedStates);
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



    // columns 설정
    const columns = [
        { field: 'no', headerName: 'No', width: 1, sortable: true },
        { field: 'file', headerName: 'File', width: 1, sortable: true,
            renderCell: (params) => (
                <div onClick={(e) => handleColumnClick(e, params.value)}>
                  {params.value}
                </div>
              ),
         },
        { field: 'send', headerName: '보낸사람/사용자', width: 1, sortable: true,
            renderCell: (params) => (
                <div onClick={(e) => handleColumnClick(e, params.value)}>
                  {params.value}
                </div>
              ),
         },
        { field: 'receive', headerName: '받는사람/대화상대/호스트', width: 1, sortable: true,
            renderCell: (params) => (
                <div onClick={(e) => handleColumnClick(e, params.value)}>
                  {params.value}
                </div>
              ),
         },
        { field: 'title', headerName: '제목/서브 URL/인스턴트 메신저/웹하드', width: 1,
            renderCell: (params) => (
                <div onClick={(e) => handleColumnClick(e, params.value)}>
                  {params.value}
                </div>
              ),
         },
        { field: 'time', headerName: '시각', width: 1,
            renderCell: (params) => (
                <div onClick={(e) => handleColumnClick(e, params.value)}>
                  {params.value}
                </div>
              ),
         },
        { field: 'fileName', headerName: '파일이름', width: 1,
            renderCell: (params) => (
                <div onClick={(e) => handleColumnClick(e, params.value)}>
                  {params.value}
                </div>
              ),
         },
        { field: 'reference', headerName: '참조인', width: 1,
            renderCell: (params) => (
                <div onClick={(e) => handleColumnClick(e, params.value)}>
                  {params.value}
                </div>
              ),
         },
        { field: 'hiddenRef', headerName: '실수취인/숨은참조/POP3서버 ID', width: 1,
            renderCell: (params) => (
                <div onClick={(e) => handleColumnClick(e, params.value)}>
                  {params.value}
                </div>
              ),
         },
        { field: 'analyzeFiles', headerName: '파일 분석 여부', width: 1,
            renderCell: (params) => (
                <div onClick={(e) => handleColumnClick(e, params.value)}>
                  {params.value}
                </div>
              ),
         },
        { field: 'name', headerName: '이름', width: 1,
            renderCell: (params) => (
                <div onClick={(e) => handleColumnClick(e, params.value)}>
                  {params.value}
                </div>
              ),
         },
        { field: 'mainContent', headerName: '본문', width: 400,
            renderCell: (params) => (
                <div onClick={(e) => handleColumnClick(e, params.value)}>
                  {params.value}
                </div>
              ),
         },
        { field: 'content', headerName: '판단 근거 문장', width: 400,
            renderCell: (params) => (
                <div onClick={(e) => handleColumnClick(e, params.value)}>
                  {params.value}
                </div>
              ),
         },
        {
            field: 'spacer',
            headerName: '', // No header name to hide the column header text
            width: 50,
            sortable: false,
            resizable: false, // 크기 조절 비활성화
            renderCell: () => (
                <div style={{
                    backgroundColor: '#ECF0F1', // 배경색 지정
                    width: '100%', // 셀의 전체 너비 채우기
                    height: '100%', // 셀의 전체 높이 채우기
                    border: 'none', // 테두리 제거
                    boxShadow: 'none' // 그림자 제거
                }}></div>
            ),
            cellClassName: 'spacer-cell'
        },
        {
            field: 'complianceRisk',
            headerName: 'Compliance Risk',
            width: 200,
            renderHeader: () => (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>Compliance Risk</span>
                    <button
                        style={{
                            padding: '5px 10px',
                            marginLeft: '10px',
                            backgroundColor: '#f0f0f0',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                        onClick={() => alert('버튼이 클릭되었습니다!')}
                    >
                        적용
                    </button>
                </div>
            ),
            renderCell: (params) => {
                const index = params.row.id - 1;
                return (
                    <button
                        onClick={() => handleToggle(index)}
                        style={{
                            width: '100px',
                            height: '30px',
                            color: 'white',
                            backgroundColor: buttonStates[index] ? 'red' : 'gray',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            boxShadow: '0px 3px 3px rgba(0, 0, 0, 0.2)',
                        }}
                    >
                        {buttonStates[index] ? 'Risk' : 'No Risk'}
                    </button>
                );
            }
        },
        { field: 'result', headerName: '평가 기록(선택)', width: 200, sortable: true },
    ];

    return (
        <div>
            <Paper style={{ height: 700, width: '100%', border: "none" }}>
                <CustomDataGrid
                    rows={currentItems} // 현재 페이지의 데이터만 표시
                    columns={columns} // 통합된 컬럼 설정
                    pageSize={itemsPerPage} // 페이지당 항목 수
                    autoHeight
                    hideFooter // 기본 페이지네이션 푸터 숨김
                    disableColumnMenu // 컬럼 메뉴 비활성화
                    sortModel={sortModel}
                    onSortModelChange={(model) => {
                        setSortModel(model);
                        setCurrentPage(1); // 정렬 시 페이지를 첫 번째로 리셋
                    }}
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

            {/* 커스텀 페이지네이션 컴포넌트 */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px' }}>
                <div className="pagination-container" style={{ textAlign: "center", flexGrow: 1 }}>
                    <Pagination
                        postsPerPage={itemsPerPage} // 페이지당 항목 수 전달
                        totalPosts={datas.length}   // 전체 항목 수 전달
                        paginate={paginate}         // 페이지 변경 핸들러 전달
                        currentPage={currentPage}   // 현재 페이지 전달
                    />
                </div>

                {/* Rating button */}
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
                    onClick={() => alert('평가하기 클릭')}
                >
                    평가 완료
                </button>
            </div>
        </div>
    );
};

export default EvaluationTable;
