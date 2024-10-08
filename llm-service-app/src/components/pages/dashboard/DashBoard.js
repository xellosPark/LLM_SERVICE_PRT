import React, { useState } from 'react';
import LLMTable from './LLMTable';
import './DashBoard.css'
import axios from 'axios';
import api from '../../api/api';
import CreateInspection from './CreateInspection';
import { useNavigate } from 'react-router-dom';

const DashBoard = () => {
  const navigate = useNavigate();
  const [showCreateInspection, setShowCreateInspection] = useState(false);  // Manage visibility of the new section

  const handleTest = async () => {
    const ip = `${process.env.REACT_APP_API_DEV}:${process.env.REACT_APP_API_PORT}`;
    return await api.get(`${ip}/api/users`, {})
    .then((res) => {
      console.log('getdata : ', res);
    });
  }

  const handleCreate = () => {
    setShowCreateInspection(true);  // CreateInspection 컴포넌트 표시
  }

  return (
    <div id='sub1-main'>
      <div className='sub1-main'>
        <div className='dashboard-title'>메일 Compliance 점검</div>
        <div>
          <button onClick={handleTest}> test </button>
          <button className='new-button' onClick={handleCreate}>+  신규 점검 생성</button>
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