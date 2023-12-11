import { useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { calculateDurationInHours } from "../../lib/utils"

export const EventContent = ({ eventInfo }) => {
  const contentRef = useRef(null);
  // const calculateDurationInHours = (startTime, endTime) => {
  //   const startDate = new Date(startTime);
  //   const endDate = new Date(endTime);
  //   const duration = ((endDate - startDate) / 1000 / 60 / 60).toFixed(1); // Convert milliseconds to hours
  //   return duration;
  // };

  useEffect(() => {
    if (contentRef.current) {
      const isOverflowing = contentRef.current.scrollHeight > contentRef.current.clientHeight;
      contentRef.current.style.justifyContent = isOverflowing ? 'flex-start' : 'center';
    }
  });

  // Default rendering for non-all-day events
  const startTime = format(eventInfo.event.start, 'MM/dd HH:mm');
  const endTime = eventInfo.event.end
    ? format(eventInfo.event.end, 'MM/dd HH:mm')
    : '';

  return (
    <div ref={contentRef} className='non-all-day-event-container'>
      <div className="car-number">
        {eventInfo.event.title}
      </div>
      <div className="details">
        {startTime} ~ {" "}
        {endTime && <span>{endTime}</span>}
      </div>
      <div className="details">
        共計 {calculateDurationInHours(eventInfo.event.start, eventInfo.event.end)} 小時
      </div>
    </div>
  );
};