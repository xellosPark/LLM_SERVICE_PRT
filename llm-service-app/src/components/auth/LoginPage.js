import React, { useState } from 'react';
import './LoginPage.css'
import lightLogo from '../../logos/test_logo.jfif';

function LoginPage({ onLogin }) {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(id, pw); // ID와 PW를 부모 컴포넌트로 전달
  };

  return (
    <div className='login-container'>
      <div className='login'>
      <div className='login-img' >
        <img alt='LG LOGO' src={lightLogo} style={{width: '100px'}} />
      </div>
        <form onSubmit={handleSubmit}>
          <div className='login-box'>
            <div className='login-body'>
              <input className='login-input'
                  type="text"
                  value={id}
                  placeholder='아이디를 입력해 주세요'
                  onChange={(e) => setId(e.target.value)}
                  required
                />
              <input className='login-input'
                  type="password"
                  value={pw}
                  placeholder='비밀번호를 입력해 주세요'
                  onChange={(e) => setPw(e.target.value)}
                  required
                />
            </div>
            <div className='login-submit'>
              <button type="submit">로그인</button>
            </div>
          </div>
        </form>

        <div className="login-options">
          <span></span>
          <div>
            <span>아이디 찾기</span>
            <span className='option'></span>
            <span>비밀번호 찾기</span>
          </div>


        </div>
      </div>

    </div>
  );
}

export default LoginPage;