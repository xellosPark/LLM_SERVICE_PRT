import React, { useState } from 'react';
import './LoginPage.css';
import lightLogo from '../../logos/prai-gen_logo_line.png';

function LoginPage({ onLogin }) {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(id, pw); // 부모 컴포넌트로 ID와 PW 전달
  };

  return (
    <div className="login-container">
      <div className="login">
        <div className="login-img" style={{ textAlign: 'left' }}>
          <img
            alt="LG LOGO"
            src={lightLogo}
            style={{ width: '150px', marginTop: '10px', marginBottom: '4px' }}
          />
          <p
            style={{
              fontSize: '30x',
              fontWeight: 'bold',
              marginLeft: '3px',
              marginBottom: '25px',
            }}
          >
            PRI Gen.AI Playground
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="login-box">
            <div className="login-body">
              <input
                className="login-input"
                type="text"
                value={id}
                placeholder="아이디를 입력해 주세요."
                onChange={(e) => setId(e.target.value)}
                required
              />
              <input
                className="login-input"
                type="password"
                value={pw}
                placeholder="비밀번호를 입력해 주세요."
                onChange={(e) => setPw(e.target.value)}
                required
              />
            </div>
            <div className="login-submit">
              <button type="submit">로그인</button>
            </div>
          </div>
        </form>

        <div className="login-options">
          <div>
            <span>아이디 찾기</span>
            <span className="option"></span>
            <span>비밀번호 찾기</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;