import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import './PlanDialog.css';
import { postPark } from '../services/service';

export default function PlanDialog(props) {
  const { open, onClose, spaceId } = props;
  const [carPlate, setCarPlate] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  const handleSubmit = async () => {
    try {
        await postPark(
            carPlate,
            spaceId,
        )
        console.log("Park", carPlate, "at", spaceId);
    } catch (error) {
        console.error(error)
    }
    onClose();
  };

const generateRandomCarPlate = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  let randomCarPlate = '';

  for (let i = 0; i < 3; i++) {
    const randomLetter = letters[Math.floor(Math.random() * letters.length)];
    randomCarPlate += randomLetter;
  }

  randomCarPlate += '-';

  for (let i = 0; i < 4; i++) {
    const randomNumber = numbers[Math.floor(Math.random() * numbers.length)];
    randomCarPlate += randomNumber;
  }

  return randomCarPlate;
};

  useEffect(() => {
    const interval = setInterval(() => {
      const localTime = new Date();
      setCurrentTime(localTime.toLocaleString());
    }, 1000);

    if (open) {
        setCarPlate(generateRandomCarPlate());
    }
    return () => clearInterval(interval);
  }, [open]);

  const buttonStyle = {
    bgcolor: '#F7F7F7', // Grey background
    color: 'black', // White text color
    '&:hover': {
      bgcolor: 'darkgrey' // Darker grey on hover
    },
    borderRadius: '8px', // Rectangle shape with slight rounding
    textTransform: 'none', // Prevent uppercase text
    width: '113px',
    height: '49px',
    fontWeight: 'regular',
    fontSize: '24px',
    border: '1px solid #8F8D8D',
}

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        style: { 
          borderRadius: 29,
          width: 588,  // Set width
          maxHeight: 386, // Set max height
        }
      }}
    >
      <DialogTitle>
        <span className="reg-string">
            {`登記車位 `}
        </span>
        <span className="reg-spaceId">
            {spaceId}
        </span>
      </DialogTitle>
      <DialogContent>
        <span className="dialog-row">
          <span className="dialog-content">輸入車牌:</span>
          <TextField
            // autoFocus
            // margin="dense"
            id="carPlate"
            // label={textFieldLabel}
            type="text"
            // fullWidth
            // variant="standard"
            value={carPlate}
            onChange={(e) => setCarPlate(e.target.value)}
            InputProps={{ sx: { width: 300, height: 36, bgcolor: '#D9D9D9', } }}
          />
        </span>
        <DialogContentText>
        <span className="dialog-row">

          <span className="dialog-content">
              {`目前時間:`}
          </span>
          <span className="dialog-content">
              {`${currentTime}`}
          </span>
        </span>
        </DialogContentText>
      </DialogContent>
      <DialogActions>   
        <Button 
            onClick={onClose}
            sx={buttonStyle}
        >
            取消
        </Button>
        <Button 
            onClick={handleSubmit}
            sx={buttonStyle}
        >
            確認
        </Button>
      </DialogActions>
    </Dialog>
  );
}
