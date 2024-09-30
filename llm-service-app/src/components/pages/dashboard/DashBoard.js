import React from 'react';
import LLMTable from './LLMTable';
import './DashBoard.css'
import axios from 'axios';
import api from '../../api/api';
import CreateInspection from './CreateInspection';
import { useNavigate } from 'react-router-dom';

const DashBoard = () => {
  const navigate = useNavigate();

  const handleTest = async () => {
    const ip = `${process.env.REACT_APP_API_DEV}:${process.env.REACT_APP_API_PORT}`;
    return await api.get(`${ip}/api/users`, {})
    .then((res) => {
      console.log('getdata : ', res);
    });
  }

  const handleCreate = () => {
    navigate('/create');
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
      <LLMTable/>
    </div>
  );
};

export default DashBoard;