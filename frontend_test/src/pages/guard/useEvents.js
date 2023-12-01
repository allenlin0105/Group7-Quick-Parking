import React, { useState, useEffect } from 'react';

const data = [
  {
    date: '2023-11-28',
    usageRate: 75,
    events: [
      { title: 'ABC-12334567', start: '2023-11-28T10:00:00', end: '2023-11-28T11:00:00' },
      { title: 'DEF-12334567', start: '2023-11-27T22:00:00', end: '2023-11-28T05:00:00' },
      { title: 'GHI-12334567', start: '2023-11-26T10:00:00', end: '2023-11-26T11:00:00' }
      // ... other events for this date
    ],
  },
  // ... other days
];

export const useEvents = () => {
  const [events, setEvents] = useState([])
  // const data = [
  //   {
  //     date: '2023-11-24',
  //     usageRate: 75,
  //     events: [
  //       { title: 'ABC-12334567', start: '2023-11-28T10:00:00', end: '2023-11-28T11:00:00' },
  //       { title: 'DEF-12334567', start: '2023-11-27T22:00:00', end: '2023-11-28T05:00:00' },
  //       { title: 'GHI-12334567', start: '2023-11-26T10:00:00', end: '2023-11-26T11:00:00' }
  //       // ... other events for this date
  //     ],
  //   },
  //   // ... other days
  // ];

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
      if (space.events.length > 0) {
        space.events.forEach((eventInfo) => {
          setEvents(prev => ([
            ...prev,
            {...eventInfo, color: 'lightblue', textColor: 'black'}
          ]));
        })
      }
    })
  }

  useEffect(() => {
    getEvents(data)
  }, [data])

  return ({
    events,
    getEvents
  })
}