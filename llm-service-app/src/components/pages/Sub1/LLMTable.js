import React, { useState } from 'react';
import './LLMTable.css'
import Pagination from '../Pagination/Pagination';
import { FaExternalLinkAlt } from 'react-icons/fa';

const LLMTable = () => {

    const columns = ['Id', 'Time', 'Model / Data', 'Evaluation Result', 'Risk Mails', 'Result File', 'Status' ];  // 미리 정의된 테이블 헤더
    const data = [
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

    const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);

  // 현재 페이지에 맞는 데이터를 계산
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

    
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
      window.open(`https://example.com/model/${model}`, '_blank');
    };
    
      return (
        <div>
          <div className="table-container">
            <table className='fixed-table'>
              <thead>
                  <tr>
                      {columns.map((column, index) => (
                          <th key={index}>{column}</th>
                      ))}
                  </tr>
              </thead>
              <tbody>
                {currentItems.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>
                      {item.time}
                      {/* 툴팁 추가: hover 시 전체 내용이 표시됨 */}
                      <div className="tooltip">{item.time}</div>
                    </td>
                    <td>
                      {item.model}
                      <FaExternalLinkAlt
                        style={{ marginLeft: '15px', cursor: 'pointer', fontSize: '12px' }}
                        onClick={() => handleIconClick(item.model)}
                      /> {/* 아이콘과 클릭 이벤트 */}
                      <div className="tooltip">{item.model}</div>
                    </td>
                    <td>{item.result}</td>
                    <td>{item.risk}</td>
                    <td>{item.resultFile}</td>
                    <td>
                      <div style={getStatusStyle(item.status)}>{item.status}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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