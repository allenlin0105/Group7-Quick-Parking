import React, { useState } from "react"
import "./Home.css"

export default function Login({ onClose, onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // 假設這是你的後端驗證邏輯
    const validCredentials = {
      username: 'user123',
      password: 'password123',
    };

    // 比對輸入的帳號密碼與系統中存儲的資訊
    if (username === validCredentials.username && password === validCredentials.password) {
      // 登入成功
      onLogin();
      onClose();
    } else {
      // 登入失敗
      alert('登入失敗，請檢查帳號密碼');
    }
  };

  return (
    <div>
      <div className="login-container">
        <h1 className="login-h1">登入系統</h1>
        <div className="login-form">
          <label htmlFor="username">帳號：</label>
          <input
            type="text"
            placeholder="請輸入管理員帳號"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: '10em',
              fontSize: '1em',
              marginRight: '0.2em',
            }}
          />
          <br />
          <label htmlFor="password">密碼：</label>
          <input
            type="password"
            placeholder="請輸入密碼"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '10em',
              fontSize: '1em',
              marginRight: '0.2em',
            }}
          />
          <div>
            <button onClick={handleLogin}>登入</button>
            <button onClick={onClose}>取消</button>
          </div>
        </div>
      </div>
      <div className="login-overlay"></div>
    </div>
  );
}