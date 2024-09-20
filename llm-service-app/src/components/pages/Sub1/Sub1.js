import React from 'react';
import LLMTable from './LLMTable';
import './Sub1.css'

const Sub1 = () => {
  return (
    <div id='sub1-main'>
      <div className='sub1-main'>
        <button className='new-button'>+  신규 점검 생성</button>
      </div>
      
      <LLMTable/>
    </div>
  );
};

export default Sub1;