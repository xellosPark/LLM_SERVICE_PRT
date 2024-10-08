import React, { useEffect, useState } from 'react';
import LLMTable from './LLMTable';
import './DashBoard.css'
import axios from 'axios';
import api from '../../api/api';
import CreateInspection from './CreateInspection';
import { useNavigate } from 'react-router-dom';

const DashBoard = ({subPage, setSubPage, setIsActivePage }) => {
  const navigate = useNavigate();
  const [showCreateInspection, setShowCreateInspection] = useState(false);  // Manage visibility of the new section

  const handleTest = async () => {
    const ip = `http://127.0.0.1:4000`;
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
        <div className='dashboard-title'>{showCreateInspection === false ? `메일 Compliance 점검` : ''}</div>
        <div>
          {
            showCreateInspection === false && (
              <>
                <button onClick={handleTest}> test </button>
                <button className='new-button' onClick={handleCreate}>+  신규 점검 생성</button>
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