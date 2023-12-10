import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import "./History.css";
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import locale from '@fullcalendar/core/locales/zh-tw';
import { EventContent } from './EventContent'
import { DayUsagePlotDialog } from './DayUsagePlotDialog';
import { EventDetailsDialog } from './EventDetailsDialog';
import { getSpaceInfo } from '../../services/service';
import { useLocation } from 'react-router-dom';

export default function History(){
  const [dayUsagePlotDialogOpen, setDayUsagePlotDialogOpen] = useState(false);
  const [eventDetailsDialogOpen, setEventDetailsDialogOpen] = useState(false);
  const [eventDialogTitle, setEventDialogTitle] = useState(null);
  const [eventDialogStart, setEventDialogStart] = useState(null);
  const [eventDialogEnd, setEventDialogEnd] = useState(null);
  const [usagePlotDate, setUsagePlotDate] = useState(null);
  
  // const handleClickOpen = () => {
  //   setOpen(true);
  // };
  const location = useLocation();
  const { spaceId } = location.state
  
  const handleDayUsagePlotDialogClose = (value) => {
    setDayUsagePlotDialogOpen(false);
    // setSelectedValue(value);
  };

  const handleEventDetailsDialogClose = (value) => {
    setEventDetailsDialogOpen(false);
    // setSelectedValue(value);
  };

  // const { events } = useEvents()

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

  const handleEventClick = (clickInfo) => {
    if (clickInfo.event.allDay) {
      // Handle all-day events
      setDayUsagePlotDialogOpen(true)
      const date = format(clickInfo.event.start, 'yyyy-MM-dd')
      
      setUsagePlotDate(date)
      // alert("All-day event clicked:", clickInfo.event.title);
      // You can use a modal or other UI element to display details
    } else {
      // Handle timed (non-all-day) events
      setEventDetailsDialogOpen(true);
      setEventDialogTitle(clickInfo.event.title)
      setEventDialogStart(clickInfo.event.start)
      setEventDialogEnd(clickInfo.event.end)
      // alert("Timed event clicked:", clickInfo.event.title);
      // Different UI or action for timed events
    }
  };

  const [events, setEvents] = useState([]);
  const getEvents = (data) => {
    setEvents([])
    data.forEach((space) => {
      if (space.usageRate) {
        setEvents(prev => ([
          ...prev,
          {
            title: space.usageRate.toString(),
            start: space.date,
            end: space.date,
            // styles
            // textColor: "black",
            className: "all-day-event"
          }
        ]));
      }
      if (space.usages.length > 0) {
        space.usages.forEach((e) => {
          setEvents(prev => ([
            ...prev,
            {...{title: e.plateNumber, start: e.start, end: e.end}, color: 'lightblue', textColor: 'black'}
          ]));
        })
      }
    })
  }

  const fetchEvents = async (startDate, endDate) => {
    try {
      const { data } = await getSpaceInfo(spaceId, startDate, endDate);
      console.log('data', data)
      getEvents(data)
      // setEvents(data); // Assuming the API returns an array of events
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleDatesSet = (dateInfo) => {
    const startDate = dateInfo.startStr.toString().split('T')[0]
    const endDate = dateInfo.endStr.toString().split('T')[0]
    fetchEvents(startDate, endDate);
  };
  console.log('spaceId', spaceId)
  return (
    <>
      <div style={{padding: 8}}>
        <h1>車位 {spaceId}</h1>
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
          eventClick={handleEventClick}
          datesSet={handleDatesSet}
        />
      </div>
      <DayUsagePlotDialog
        open={dayUsagePlotDialogOpen}
        onClose={handleDayUsagePlotDialogClose}
        date={usagePlotDate}
      />
      <EventDetailsDialog
        open={eventDetailsDialogOpen}
        onClose={handleEventDetailsDialogClose}
        title={eventDialogTitle}
        start={eventDialogStart}
        end={eventDialogEnd}
      />
    </>
  );
};