import React, { useState } from "react"
import "./Home.css"
import { login } from "../services/service.js"
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useNavigate } from 'react-router-dom';

export default function Login({ open, onClose, onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);
  const [showMenu, setShowMenu] = useState(false)
  const navigate = useNavigate();

  const handleLogin = async () => {
    // // 假設這是你的後端驗證邏輯
    // const validCredentials = {
    //   username: 'user123',
    //   password: 'password123',
    // };

    const { data } = await login(username, password);

    console.log(data)
    // 比對輸入的帳號密碼與系統中存儲的資訊
    if (data.status === 200) {
      // 登入成功
      localStorage.setItem('token', data.token);
      setShowMenu(true)
      // onLogin();
      // handleClose();
    } else {
      // 登入失敗
      // alert('登入失敗，請檢查帳號密碼');
      setShowError(true)
    }
  };

  const handleClose = () => {
    onClose();
    setShowError(false)
    setUsername('')
    setPassword('')
    setShowMenu(false)
  }

  const goToManagePage = () => {
    navigate('/guard')
  }

  const goToRegisterPage = () => {
    navigate('/guard/parking')
  }

  const buttonStyle = {
    bgcolor: '#1b2928', // Grey background
    color: 'white', // White text color
    '&:hover': {
      bgcolor: 'darkgrey',
      color: 'black'
    },
    borderRadius: '10px', // Rectangle shape with slight rounding
    fontSize: '1em',
    paddingTop: '6px',
    paddingBottom: '3px',
    paddingLeft: '10px',
    paddingRight: '10px'
}

  return (
    <Dialog 
    open={open} 
    onClose={handleClose}
    PaperProps={{
      style: { 
        borderRadius: '10px',
        width: '100%',  // Set width
        maxWidth: 480,
        padding: 5
        // maxHeight: 386, // Set max height
      }
    }}
  >
    <DialogTitle sx={{fontWeight: "bold", fontSize: "1.25em"}}>
      登入系統
    </DialogTitle>
    <DialogContent>
      <div className="dialog-row">
         <span>帳號：</span>
         <TextField
           placeholder="請輸入管理員帳號"
           value={username}
           onChange={(e) => setUsername(e.target.value)}
           size="small"
           style={{
             width: '80%',
             paddingTop: 5,
             paddingBottom: 5
           }}
         />
      </div>
        <div className="dialog-row">
          <span>密碼：</span>
          <TextField
            type="password"
            placeholder="請輸入密碼"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            size="small"
            style={{
              width: '80%',
              paddingTop: 5,
              paddingBottom: 5
            }}
          />
        </div>
        {
          showError && <span style={{color: 'red'}}>登入失敗，請檢查帳號密碼</span>
        }
    </DialogContent>
    <DialogActions>
      {
      showMenu ? 
        <div style={{ display: 'flex', gap: 10}}>
          <Button 
              onClick={goToManagePage}
              sx={buttonStyle}
          >
              進入管理系統
          </Button>
          <Button 
              onClick={goToRegisterPage}
              sx={buttonStyle}
          >
              進入登記系統
          </Button>
        </div>
        :
        <div style={{ display: 'flex', gap: 10}}>
        <Button 
            onClick={handleClose}
            sx={buttonStyle}
        >
            取消
        </Button>
        <Button 
            onClick={handleLogin}
            sx={buttonStyle}
        >
            登入
        </Button>
       </div>
      } 
    </DialogActions>
  </Dialog>
  );
}