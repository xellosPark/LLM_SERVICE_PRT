import React, { useEffect,useState } from 'react';
import LLMTable from './LLMTable';
import './DashBoard.css'
import axios from 'axios';
import api from '../../api/api';
import CreateInspection from './CreateInspection';

const DashBoard = ({subPage, setSubPage, setIsActivePage }) => {
  const [showCreateInspection, setShowCreateInspection] = useState(false);  // Manage visibility of the new section

  const handleTest = async () => {
    const ip = `${process.env.REACT_APP_API_DEV}:${process.env.REACT_APP_API_PORT}`;
    return await api.get(`${ip}/api/users`, {})
    .then((res) => {
      console.log('getdata : ', res);
    });
  }

  const handleCreate = () => {
    setSubPage('Create');
    setShowCreateInspection(true);  // Show the CreateInspection component
    setIsActivePage(true);
  }

  useEffect(()=> {
    if (subPage === 'Default') {
      setShowCreateInspection(false);
      setIsActivePage(false);
    }
  },[subPage])

  return (
    <div id='sub1-main'>
      <div className='sub1-main'>
      <div className='dashboard-title'>{showCreateInspection === false ? ( <>
                                                                          <img src="https://img.icons8.com/?size=100&id=124173&format=png&color=000000" alt="icon" style={{ width: '14px', height: '14px', marginRight: '8px' }} />
                                                                           메일 Compliance 점검
                                                                           </> ): ('')
                                                                           }</div>
        <div>
          {
            showCreateInspection === false && (
              <>
                {/* <button onClick={handleTest}> test </button> */}
                {/* <button className='new-button' onClick={handleCreate}>+  신규 점검 생성</button> */}
                <div className="newaddbutton" onClick={handleCreate}>
                  <div>
                    {/* 하단 버튼 */}
                    <button className="icon-button-add">
                      {/*  아이콘 설정 */}
                      <img src="https://img.icons8.com/ios-filled/50/BB0841/plus-math.png" alt="add function icon" />
                      신규 점검 생성
                    </button>
                  </div>
                </div>
              </>
            )
          }
        </div>
      </div>
         {/* Conditionally render LLMTable or CreateInspection */}
      <div className="body-content">
        {showCreateInspection ? <CreateInspection /> : <LLMTable />}
      </div>
      
    </div>
  );
};

export default DashBoard;