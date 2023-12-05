import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DayUsagePlot from './DayUsagePlot';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

export function DayUsagePlotDialog(props) {
  const { open, onClose, date } = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open} 
          fullWidth={true}
          maxWidth={'xl'}>
      <IconButton
        aria-label="close"
        onClick={onClose}
        style={{
          position: 'absolute',
          right: 8,
          top: 8,
          zIndex: 1 // Ensure it's above other elements
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogTitle>{date}</DialogTitle>
      <DialogContent>
        <DayUsagePlot date={date}/>
      </DialogContent>
    </Dialog>
  );
}
