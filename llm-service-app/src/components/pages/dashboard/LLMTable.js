import React, { useEffect, useState } from 'react';
import { Paper, Menu, MenuItem, Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Pagination from '../Pagination/Pagination';
import { FaExternalLinkAlt } from 'react-icons/fa';
import './LLMTable.css';
import { LoadAllChecksTable, LoadFilesTable, LoadJoinChecksEvalTable } from '../../api/DBControllers';
import FileTableModal from '../Modal/FileTableModal';
import { LuDownload } from "react-icons/lu";
import { HiQuestionMarkCircle } from "react-icons/hi2";
import { Navigate, useNavigate, Link } from 'react-router-dom';

const LLMTable = ({handleItemClick}) => {
  const [data, setData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data ? data.slice(indexOfFirstItem, indexOfLastItem) : [];

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [menuPosition, setMenuPosition] = useState(null);
  const navigate = useNavigate();

  const capitalizeFirstLetter = (str) => {
   if (!str) return str; // 문자열이 빈 경우 바로 반환
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleIconClick = async (model) => {
    // 예: 특정 모델에 대한 세부 정보를 외부 링크로 열기
    const fileData = await LoadFilesTable(model.job_id);
    const data = { id: model.id, ...fileData }
    
    setSelectedRowData(data);
    setIsModalOpen(true);
  };

  const timeReplace = (time) => {
    // 특정 문자 집합 제거
    let result = time.replace(/[TZ,]/g, (match) => (match === 'T' ? ' ' : '')); // "e", "o", ","를 모두 제거
    return result;
  }

  const hanbleEvaluation = (data) => {
    //localStorage.setItem('activeComponent', 'Evaluation');
    localStorage.setItem('Job_Id', data.job_id);
    localStorage.setItem('Evaluation_Start', true);
    handleItemClick('Evaluation');
  }

  

  // 상태에 따라 배경색을 반환하는 함수
  const getStatusStyle = (status) => {
      const baseStyle = {
          display: 'flex',
          borderRadius: '8px',    // border-radius 추가
          padding: '0px 0px',      // padding도 함께 추가 가능
          maxWidth: '100px',
          minWidth: '80px',
        };
      switch (status) {
      case 'running':
          return { ...baseStyle, backgroundColor: '#FFF8E3', color: '#F1A500',  border: '2px solid #F1A500' }; // 노란색 배경, 노란색 텍스트
      case 'success':
          return { ...baseStyle, backgroundColor: '#EEF5E9', color: '#527B5D', border: '2px solid #527B5D' }; // 초록색 배경, 초록색 텍스트
      case 'saving':
          return { ...baseStyle, backgroundColor: '#EEF5FF', color: '#4274D1', border: '2px solid #4274D1' }; // 파랑색 배경, 파랑색 텍스트
      case 'error':
          return { ...baseStyle, backgroundColor: '#FFEFEF', color: '#D9143B', border: '2px solid #D9143B' }; // 빨강색 배경, 빨강색 텍스트
      default:
          return {}; // 기본 스타일 (변경 없음)
      }
  };

  const loadRiskMails = (rowData) => {
    const data = `${rowData.risk_num ? rowData.risk_num : '-'} / ${rowData.keyword_filtered_num ? rowData.keyword_filtered_num : '-'}`
    return data + '건';
  }

  const columns = [
    { field: 'id', headerName: 'Id', flex: 0.5, align: 'center', headerAlign: 'center',
      renderCell: (params) => (
        <div onContextMenu={(event) => handleCellClick(params, event)}>
          {params.value}
        </div>
      ),
     },
    { field: 'created_time', headerName: 'Time', flex: 3, align: 'center', headerAlign: 'center',
      
            renderCell: (params) => (
              <div onContextMenu={(event) => handleCellClick(params, event)}>
                {params.value}
              </div>
            ),
     },
    { field: 'model_name', headerName: 'Model / Data', flex: 2, align: 'center', headerAlign: 'center', sortable: false,
    renderCell: (params) => {
        const rowData = params.row;
        
        return (
          <>
          <div onContextMenu={(event) => handleCellClick(params, event)}>
            <span style={{cursor: 'pointer'}} onClick={() => handleIconClick(rowData)}>
              {capitalizeFirstLetter(params.value)}
              <FaExternalLinkAlt className='icon'/>         
            </span>
          </div>
          
          </>
        );
      }
    },
    { field: 'checks_status', headerName: 'Status', flex: 2, headerAlign: 'center', sortable: false,
      renderCell: (params) => {
        const rowData = params.row;
        
        return (
          <>
          <div onContextMenu={(event) => handleCellClick(params, event)}
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
            <div className='status' style={getStatusStyle(rowData.checks_status)}>
              {capitalizeFirstLetter(params.value)} {rowData.checks_status === 'error' && 
                <Tooltip style={{fontSize: '20px'}} title={<span style={{fontSize: '16px'}}>{rowData.message}</span>} arrow>
                  <span>
                    <HiQuestionMarkCircle className='status-error' />
                  </span>
                  
                </Tooltip>
                
                }
            </div>
          </div>
          </>
        );
      }
    },
    {field: 'risk', headerName: 'Risk Mails', flex: 2, align: 'center', headerAlign: 'center', sortable: false,
      renderCell: (params) => {
        const rowData = params.row;
        return (
          <>
          <div onContextMenu={(event) => handleCellClick(params, event)}>
          {params.value}
            { rowData.checks_status === 'success' ? loadRiskMails(rowData) : `-` }
          </div>
          
          </>
          
        );
      }
    },
    {
      field: 'result', headerName: 'Evaluation Result', flex: 2, align: 'center', headerAlign: 'center',
      renderCell: (params) => {
          const rowData = params.row;
          return (
            <div onContextMenu={(event) => handleCellClick(params, event)}>
              {params.value}
              {rowData.checks_status === 'success' && rowData.evaluations_status === 'success' ? (
                <button className='eval_result'><span>{rowData.evaluation_result.toFixed(2)+'%'}</span></button>
              ) : rowData.checks_status === 'success' ? (
              <button className='result-button' onClick={() => hanbleEvaluation(rowData)}>
                평가하기
            </button>) : rowData.status === 'success' ? <button></button> : '-'}
            </div>
            
          );
      }
    },
    { field: 'resultFile', headerName: 'Result File', flex: 2, align: 'center', headerAlign: 'center',
      renderCell: (params) => {
        const rowData = params.row;
        
        return (
          <div onContextMenu={(event) => handleCellClick(params, event)}>
            {params.value}
            {
              rowData.checks_status === 'success' && rowData.evaluations_status === 'success' ? <LuDownload style={{fontSize: '18px', marginTop: '5px'}}/> :
              rowData.checks_status === 'success' ? <LuDownload style={{fontSize: '18px', marginTop: '5px'}}/> : '-'
            }
          </div>
        );
      }
     }
];

const handleContextMenu = (event) => {
  console.log('오른쪽 클릭');
  event.preventDefault();
  //event.stopPropagation();
};

const handleCellClick = (params, event) => {
  if (event.type === 'contextmenu') {
    event.preventDefault(); // 기본 컨텍스트 메뉴 방지
    setMenuPosition({ mouseX: event.clientX, mouseY: event.clientY }); // 마우스 클릭 위치 저장
    setSelectedRowData(params.row); // 선택된 행 설정
  }
};

const handleCloseMenu = () => {
  setMenuPosition(null);
  setSelectedRowData(null);
};

const handleDeleteRow = () => {
  if (selectedRowData) {
    setData((prevRows) => prevRows.filter((row) => row.id !== selectedRowData.id));
    handleCloseMenu();
  }
};

  const LoadTable = async () => {
    const tableData = await LoadAllChecksTable();
    setData(tableData);
  }

  useEffect(() => {
        LoadTable();
      }, []);

  return (
    <>
      <Paper sx={{ width: "88vw", padding: "20px", maxWidth: "100%"}} onContextMenu={handleContextMenu}>
      
      <div style={{ height: 700, width: '100%' }}>
        <DataGrid
          rows={currentItems}
          columns={columns}
          pageSize={itemsPerPage}
          autoHeight
          hideFooter
          disableColumnMenu
          disableColumnResize
          sx={{
           
            "& .MuiDataGrid-root": {
              overflowX: "hidden", // 수평 스크롤을 제거하여 화면을 넘지 않도록 설정
            },
            "& .MuiDataGrid-cell": {
              textOverflow: "ellipsis", // 텍스트가 넘칠 경우 말줄임표(...) 처리
              overflow: "hidden",
              whiteSpace: "nowrap", // 텍스트 줄바꿈 방지
            },
            "& .MuiDataGrid-columnHeadersInner": {
              "& .MuiDataGrid-columnSeparator--sideRight": {
                display: "none", // 마지막 구분선을 숨겨서 오른쪽 끝에 표시되지 않도록 설정
              },
            },
         
          }}
        />
      </div>
      <Menu
        anchorReference="anchorPosition"
        anchorPosition={menuPosition ? { top: menuPosition.mouseY, left: menuPosition.mouseX } : undefined}
        open={Boolean(menuPosition)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleDeleteRow}>Delete</MenuItem>
      </Menu>
      <div className="pagination-container" style={{ textAlign: "center", marginTop: "20px" }}>
        <Pagination
          postsPerPage={itemsPerPage}
          totalPosts={data?.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      </div>
    </Paper>

    {
      isModalOpen && (
        <FileTableModal data={selectedRowData} onClose={closeModal} />
      )
    }
    
    </>
    
  );
};

export default LLMTable;