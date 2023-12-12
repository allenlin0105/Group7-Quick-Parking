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
import { format } from "date-fns"

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
      setCurrentTime(format(localTime, 'yyyy/MM/dd HH:mm'));
    }, 1000);

    if (open) {
        setCarPlate(generateRandomCarPlate());
    }
    return () => clearInterval(interval);
  }, [open]);

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
      onClose={onClose}
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
      <DialogTitle>
        <span className="reg-string">
            {`登記車位 `}
        </span>
        <span className="reg-spaceId reg-string">
            {spaceId}
        </span>
      </DialogTitle>
      <DialogContent sx={{fontSize: "18px"}}>
        <div className="dialog-row">
          <span>{`輸入車牌：`}</span>
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
            size="small"
            style={{
              width: '75%',
              paddingTop: 5,
              paddingBottom: 5
            }}
          />
        </div>
        <div className="dialog-row">
          <span>
              {`目前時間：`}
          </span>
          <span>
              {`${currentTime}`}
          </span>
        </div>
      </DialogContent>
      <DialogActions sx={{fontSize: "18px"}}>   
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
