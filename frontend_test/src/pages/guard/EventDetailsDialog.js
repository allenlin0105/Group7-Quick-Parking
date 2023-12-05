import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { calculateDurationInHours } from "./lib/utils"
import { format } from 'date-fns';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

export function EventDetailsDialog(props) {
  const { open, onClose, title, start, end } = props;

  console.log('start in event', start)
  const handleClose = () => {
    onClose();
  };

  // Default rendering for non-all-day events
  const startTime = start
    ? format(start, 'HH:mm')
    : '';
  const endTime = end
    ? format(end, 'HH:mm')
    : '';

  return (
    <Dialog 
        onClose={handleClose} open={open} 
        fullWidth={true}
        maxWidth={'sm'}
    >
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
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <div className="details">
          {startTime} ~ {" "}
          {endTime && <span>{endTime}</span>}
        </div>
        <div className="details">
          共計 {calculateDurationInHours(start, end)} 小時
        </div>
      </DialogContent>
    </Dialog>
  );
}
