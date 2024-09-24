import React from 'react';
import LLMTable from './LLMTable';
import './Sub1.css'
import axios from 'axios';
import api from '../../api/api';

const Sub1 = () => {


  const handleTest = async () => {
    const ip = `${process.env.REACT_APP_API_DEV}:${process.env.REACT_APP_API_PORT}`;
    return await api.get(`${ip}/api/users`, {})
    .then((res) => {
      console.log('getdata : ', res);
    });
  }

  return (
    <div id='sub1-main'>
      <div className='sub1-main'>
        <button onClick={handleTest}> test </button>
        <button className='new-button'>+  신규 점검 생성</button>
      </div>
      <LLMTable/>
    </div>
  );
};

export default Sub1;