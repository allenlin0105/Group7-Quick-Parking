import React, { useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import "./History.css";
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import locale from '@fullcalendar/core/locales/zh-tw';
import { useEvents } from './useEvents';
import { EventContent } from '../../components/EventContent'
import DayUsagePlot from './DayUsagePlot';

const FullCalendarComponent = () => {
  const { events } = useEvents()

  const renderEventContent = (eventInfo) => {
    if (eventInfo.event.allDay) {
      return (
        <div className="all-day-event-container">
          <div className="all-day-event">
            <span style={{fontSize: 30}}>{eventInfo.event.title}</span>
            <span style={{fontSize: 20}}>%</span>
          </div>
        </div>
      );
    }

    return <EventContent eventInfo={eventInfo} />;
  };

  const handleDayHeaderContent = (args) => {
    // Format the day header using date-fns
    return { 
      html: format(args.date, 'MM/dd eee', { locale: zhTW }) // Use Chinese locale
    };
  };

  const handleAllDayContent = (args) => {
    return(<span>使用率</span>)
  }

  return (
    <>
      <div style={{padding: 8}}>
        <h1>車位</h1>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: 'prev,next',
            // center: 'title',
            right: 'today timeGridWeek,timeGridDay'
          }}
          events={events}
          eventContent={renderEventContent}
          allDayContent={handleAllDayContent}
          dayHeaderContent={handleDayHeaderContent} 
          locale={locale}
          slotLabelFormat={{
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }}
        />
      </div>
      <div>
        <DayUsagePlot/>
      </div>
    </>
  );
};

export default FullCalendarComponent;
