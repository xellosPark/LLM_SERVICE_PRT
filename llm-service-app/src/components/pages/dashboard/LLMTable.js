import React, { useEffect, useRef, useState } from 'react';
import './LLMTable.css'
import Pagination from '../Pagination/Pagination';
import Modal from '../Modal/Modal';
import { FaExternalLinkAlt } from 'react-icons/fa';

const LLMTable = () => {

  const columns = [
    { key: 'id', label: 'Id', minWidth: 10 },
    { key: 'time', label: 'Time', minWidth: 20 },
    { key: 'model', label: 'Model / Data', minWidth: 50 },
    { key: 'status', label: 'Status', minWidth: 30 },
    { key: 'risk', label: 'Risk Mails', minWidth: 100 },
    { key: 'evResult', label: 'Evaluation Result', minWidth: 100 },
    { key: 'resultFile', label: 'Result File', minWidth: 50 },
  ];  // 미리 정의된 테이블 헤더
  const datas = [
      { id: 1, time: '2024-08-24 17:02:03', model: 'Gemma:7b', result: '-', risk: '-', resultFile: '-', status: 'Success', title: '2024-08023 14:54:11', jobId: '202408231454111782' },
      { id: 2, time: '2024-09-04 14:43:03', model: 'GPT-4o', result: '-', risk: '120건 / 821건', resultFile: '-', status: 'Error' },
      { id: 3, time: '2024-09-14 07:33:03', model: 'Gemma:7b', result: '-', risk: '-', resultFile: '-', status: 'Success' },
      { id: 4, time: '2024-09-16 07:05:03', model: 'Gemini-1.5', result: '-', risk: '-', resultFile: '-', status: 'Success' },
      { id: 5, time: '2024-09-19 19:10:03', model: 'Gemma:7b', result: '-', risk: '-', resultFile: '-', status: 'Success' },
      { id: 6, time: '2024-08-31 14:50:03', model: 'GPT-4o', result: '-', risk: '-', resultFile: '-', status: 'Success' },
      { id: 7, time: '2024-08-24 15:17:03', model: 'Gemini-1.5', result: '-', risk: '-', resultFile: '-', status: 'Error' },
      { id: 8, time: '2024-09-19 13:40:03', model: 'Gemini-1.5', result: '-', risk: '-', resultFile: '-', status: 'Running' },
      { id: 9, time: '2024-09-06 14:58:03', model: 'Gemini-1.5', result: '-', risk: '120건 / 821건', resultFile: '-', status: 'Saving' },
      { id: 10, time: '2024-09-16 05:30:03', model: 'Gemma:7b', result: '-', risk: '-', resultFile: '-', status: 'Running' },
      { id: 11, time: '2024-09-17 08:53:03', model: 'GPT-4o', result: '-', risk: '120건 / 821건', resultFile: '-', status: 'Error' },
      { id: 12, time: '2024-09-04 00:41:03', model: 'Gemma:7b', result: '-', risk: '-', resultFile: '-', status: 'Error' },
      { id: 13, time: '2024-09-12 05:28:03', model: 'GPT-4o', result: '-', risk: '-', resultFile: '-', status: 'Saving' },
      { id: 14, time: '2024-08-27 23:41:03', model: 'Gemini-1.5', result: '-', risk: '120건 / 821건', resultFile: '-', status: 'Saving' },
      { id: 15, time: '2024-09-09 15:13:03', model: 'Gemma:7b', result: '-', risk: '-', resultFile: '-', status: 'Running' },
      { id: 16, time: '2024-09-07 10:05:03', model: 'GPT-4o', result: '-', risk: '-', resultFile: '-', status: 'Running' },
      { id: 17, time: '2024-09-04 02:38:03', model: 'Gemini-1.5', result: '-', risk: '-', resultFile: '-', status: 'Saving' },
      { id: 18, time: '2024-09-14 07:41:03', model: 'Gemini-1.5', result: '-', risk: '-', resultFile: '-', status: 'Running' },
      { id: 19, time: '2024-09-16 11:32:03', model: 'Gemma:7b', result: '-', risk: '-', resultFile: '-', status: 'Running' },
      { id: 20, time: '2024-09-19 01:11:03', model: 'Gemini-1.5', result: '-', risk: '120건 / 821건', resultFile: '-', status: 'Running' },
      { id: 21, time: '2024-09-06 17:15:03', model: 'Gemini-1.5', result: '-', risk: '-', resultFile: '-', status: 'Error' },
      { id: 22, time: '2024-09-10 22:55:03', model: 'Gemma:7b', result: '-', risk: '-', resultFile: '-', status: 'Success' },
      { id: 23, time: '2024-09-19 00:07:03', model: 'GPT-4o', result: '-', risk: '-', resultFile: '-', status: 'Running' },
      { id: 24, time: '2024-08-24 21:46:03', model: 'GPT-4o', result: '-', risk: '-', resultFile: '-', status: 'Saving' },
      { id: 25, time: '2024-08-24 18:36:03', model: 'Gemini-1.5', result: '-', risk: '-', resultFile: '-', status: 'Saving' },
      { id: 26, time: '2024-08-29 20:53:03', model: 'Gemini-1.5', result: '-', risk: '-', resultFile: '-', status: 'Error' },
      { id: 27, time: '2024-09-11 16:45:03', model: 'GPT-4o', result: '-', risk: '-', resultFile: '-', status: 'Saving' },
      { id: 28, time: '2024-08-22 14:47:03', model: 'Gemma:7b', result: '-', risk: '120건 / 821건', resultFile: '-', status: 'Saving' },
      { id: 29, time: '2024-09-16 16:35:03', model: 'Gemini-1.5', result: '-', risk: '-', resultFile: '-', status: 'Error' },
      { id: 30, time: '2024-09-02 18:29:03', model: 'Gemini-1.5', result: '-', risk: '-', resultFile: '-', status: 'Saving' },
      { id: 1, time: '2024-08-24 17:02:03', model: 'Gemma:7b', result: '-', risk: '-', resultFile: '-', status: 'Success' },
      { id: 2, time: '2024-09-04 14:43:03', model: 'GPT-4o', result: '-', risk: '120건 / 821건', resultFile: '-', status: 'Error' },
      { id: 3, time: '2024-09-14 07:33:03', model: 'Gemma:7b', result: '-', risk: '-', resultFile: '-', status: 'Success' },
      { id: 4, time: '2024-09-16 07:05:03', model: 'Gemini-1.5', result: '-', risk: '-', resultFile: '-', status: 'Success' },
      { id: 5, time: '2024-09-19 19:10:03', model: 'Gemma:7b', result: '-', risk: '-', resultFile: '-', status: 'Success' },
      { id: 6, time: '2024-08-31 14:50:03', model: 'GPT-4o', result: '-', risk: '-', resultFile: '-', status: 'Success' },
      { id: 7, time: '2024-08-24 15:17:03', model: 'Gemini-1.5', result: '-', risk: '-', resultFile: '-', status: 'Error' },
      { id: 8, time: '2024-09-19 13:40:03', model: 'Gemini-1.5', result: '-', risk: '-', resultFile: '-', status: 'Running' },
      { id: 9, time: '2024-09-06 14:58:03', model: 'Gemini-1.5', result: '-', risk: '120건 / 821건', resultFile: '-', status: 'Saving' },
      { id: 10, time: '2024-09-16 05:30:03', model: 'Gemma:7b', result: '-', risk: '-', resultFile: '-', status: 'Running' },
      { id: 11, time: '2024-09-17 08:53:03', model: 'GPT-4o', result: '-', risk: '120건 / 821건', resultFile: '-', status: 'Error' },
      { id: 12, time: '2024-09-04 00:41:03', model: 'Gemma:7b', result: '-', risk: '-', resultFile: '-', status: 'Error' },
      { id: 13, time: '2024-09-12 05:28:03', model: 'GPT-4o', result: '-', risk: '-', resultFile: '-', status: 'Saving' },
      { id: 14, time: '2024-08-27 23:41:03', model: 'Gemini-1.5', result: '-', risk: '120건 / 821건', resultFile: '-', status: 'Saving' },
      { id: 15, time: '2024-09-09 15:13:03', model: 'Gemma:7b', result: '-', risk: '-', resultFile: '-', status: 'Running' },
      { id: 16, time: '2024-09-07 10:05:03', model: 'GPT-4o', result: '-', risk: '-', resultFile: '-', status: 'Running' },
      { id: 17, time: '2024-09-04 02:38:03', model: 'Gemini-1.5', result: '-', risk: '-', resultFile: '-', status: 'Saving' },
      { id: 18, time: '2024-09-14 07:41:03', model: 'Gemini-1.5', result: '-', risk: '-', resultFile: '-', status: 'Running' },
      { id: 19, time: '2024-09-16 11:32:03', model: 'Gemma:7b', result: '-', risk: '-', resultFile: '-', status: 'Running' },
      { id: 20, time: '2024-09-19 01:11:03', model: 'Gemini-1.5', result: '-', risk: '120건 / 821건', resultFile: '-', status: 'Running' },
      { id: 21, time: '2024-09-06 17:15:03', model: 'Gemini-1.5', result: '-', risk: '-', resultFile: '-', status: 'Error' },
      { id: 22, time: '2024-09-10 22:55:03', model: 'Gemma:7b', result: '-', risk: '-', resultFile: '-', status: 'Success' },
      { id: 23, time: '2024-09-19 00:07:03', model: 'GPT-4o', result: '-', risk: '-', resultFile: '-', status: 'Running' },
      { id: 24, time: '2024-08-24 21:46:03', model: 'GPT-4o', result: '-', risk: '-', resultFile: '-', status: 'Saving' },
      { id: 25, time: '2024-08-24 18:36:03', model: 'Gemini-1.5', result: '-', risk: '-', resultFile: '-', status: 'Saving' },
      { id: 26, time: '2024-08-29 20:53:03', model: 'Gemini-1.5', result: '-', risk: '-', resultFile: '-', status: 'Error' },
      { id: 27, time: '2024-09-11 16:45:03', model: 'GPT-4o', result: '-', risk: '-', resultFile: '-', status: 'Saving' },
      { id: 28, time: '2024-08-22 14:47:03', model: 'Gemma:7b', result: '-', risk: '120건 / 821건', resultFile: '-', status: 'Saving' },
      { id: 29, time: '2024-09-16 16:35:03', model: 'Gemini-1.5', result: '-', risk: '-', resultFile: '-', status: 'Error' },
      { id: 30, time: '2024-09-02 18:29:03', model: 'Gemini-1.5', result: '-', risk: '-', resultFile: '-', status: 'Saving' }
  ];

  const [columnWidths, setColumnWidths] = useState({
    id: 10,
    time: 20,
    model: 50,
    status: 30,
    risk: 150,
    evResult: 100,
    resultFile: 50,
  });

  // columnRefs를 빈 객체로 초기화합니다.
  const columnRefs = useRef({});
  const resizingState = useRef({ startX: 0, startWidth: 0 });

  const [data, setData] = useState(datas);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);

  // 현재 페이지에 맞는 데이터를 계산
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

  const [contextMenu, setContextMenu] = useState(null);
  const menuRef = useRef(null); // 메뉴의 ref

  // 상태에 따라 배경색을 반환하는 함수
  const getStatusStyle = (status) => {
      const baseStyle = {          // margin 추가
          borderRadius: '8px',    // border-radius 추가
          padding: '4px 0px'      // padding도 함께 추가 가능
        };
      switch (status) {
      case 'Running':
          return { ...baseStyle, backgroundColor: '#EEF5E9', color: '#698474' }; // 초록색 배경, 초록색 텍스트
      case 'Success':
          return { ...baseStyle, backgroundColor: '#EEF5FF', color: '#5A97F1' }; // 빨간색 배경, 빨간색 텍스트
      case 'Saving':
          return { ...baseStyle, backgroundColor: '#FFF8E3', color: '#F6AD00' }; // 노란색 배경, 노란색 텍스트
      case 'Error':
          return { ...baseStyle, backgroundColor: '#FFEFEF', color: '#F6204B' }; // 노란색 배경, 노란색 텍스트
      default:
          return {}; // 기본 스타일 (변경 없음)
      }
  };

  const handleIconClick = (model) => {
    console.log(`Icon clicked for model: ${model}`);
    // 예: 특정 모델에 대한 세부 정보를 외부 링크로 열기
    setSelectedRowData(model);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // 정렬 기능 구현
  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }

    const sortedData = [...data].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    setSortConfig({ key, direction });
    setData(sortedData);
  };

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

   // 우클릭 이벤트 핸들러
   const handleRightClick = (event, rowData) => {
    event.preventDefault();
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      rowData,
    });
  };

  // 삭제 버튼 클릭 시 해당 행 삭제
  const handleDelete = () => {
    setData(data.filter(row => row.id !== contextMenu.rowData.id));
    setContextMenu(null); // 메뉴 닫기
  };

  // 메뉴 외부 클릭 시 닫기
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setContextMenu(null); // 메뉴 닫기
    }
  };

  useEffect(() => {
    // 메뉴가 열려 있을 때만 전역 클릭 이벤트를 등록
    if (contextMenu) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

    // 컴포넌트가 언마운트될 때 이벤트 리스너 정리
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [contextMenu]);

  return (
    <div>
      <div className="table-container">
        <table className='fixed-table'>
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
                  {column.label}
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
            {currentItems.map((item) => (
              <tr key={item.id} onContextMenu={(e) => handleRightClick(e, item)}>
                <td>{item.id}</td>
                <td>
                  {item.time}
                  {/* 툴팁 추가: hover 시 전체 내용이 표시됨 */}
                  <div className="tooltip">{item.time}</div>
                </td>
                <td>
                  {item.model}
                  <FaExternalLinkAlt className='icon'
                        onClick={() => handleIconClick(item)}
                      /> {/* 아이콘과 클릭 이벤트 */}
                  <div className="tooltip">{item.model}</div>
                </td>
                <td>
                  <div style={getStatusStyle(item.status)}>{item.status}</div>
                </td>
                <td>{item.risk}</td>
                <td>{item.result}</td>
                
                <td>{item.resultFile}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
        {
          isModalOpen && (
            <Modal data={selectedRowData} onClose={closeModal} />
          )
        }
        {/* 커스텀 컨텍스트 메뉴 */}
      {contextMenu && (
        <div
          ref={menuRef} // 메뉴에 대한 참조
          style={{
            position: 'absolute',
            top: `${contextMenu.y}px`,
            left: `${contextMenu.x}px`,
            border: '1px solid black',
            zIndex: 1000,
          }}
        >
          <button onClick={handleDelete} style={{border: 'none', background:'white', padding:' 10px'}}>삭제</button>
        </div>
      )}
      </div>
      
      <div>
        <Pagination
          postsPerPage={itemsPerPage} // 페이지 당 포스트 수
          totalPosts={data.length} // 전체 포스트 수
          paginate={(pageNumber) => setCurrentPage(pageNumber)} // 페이지 번호를 변경하는 함수
          currentPage={currentPage} // 현재 페이지 번호
        />
      </div>
    </div>
  );
};

export default LLMTable;