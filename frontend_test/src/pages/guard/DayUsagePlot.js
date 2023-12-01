import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';

const DayUsagePlot = () => {
  const data = [
    { date: '00:00', usage: 80 },
    { date: '01:00', usage: 50 },
    { date: '02:00', usage: 10 },
    { date: '03:00', usage: 80 },
    { date: '04:00', usage: 50 },
    { date: '05:00', usage: 10 },
    { date: '06:00', usage: 80 },
    { date: '07:00', usage: 50 },
    { date: '08:00', usage: 10 },
    { date: '09:00', usage: 80 },
    { date: '10:00', usage: 50 },
    { date: '11:00', usage: 10 },
    { date: '12:00', usage: 80 },
    { date: '13:00', usage: 50 },
    { date: '14:00', usage: 10 },
    { date: '15:00', usage: 80 },
    { date: '16:00', usage: 50 },
    { date: '17:00', usage: 10 },
    { date: '18:00', usage: 80 },
    { date: '19:00', usage: 50 },
    { date: '20:00', usage: 10 },
    { date: '21:00', usage: 80 },
    { date: '22:00', usage: 50 },
    { date: '23:00', usage: 10 },
  ]

  const yAxisTickFormatter = (value) => `${value}%`;

  return (
    <ResponsiveContainer
      width="100%"
      height={400}
    >
      <BarChart
        data={data}
        margin={{ top: 20, right: 20, left: 20, bottom: 5 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis dataKey="date" />
        <YAxis 
          domain={[0, 100]}
          tickFormatter={yAxisTickFormatter}
        /> {/* Set Y-axis domain to [0, 100] */}
        <Tooltip />
        <Bar dataKey="usage" fill="#8884d8" >
          <LabelList dataKey="usage" position="top"/>
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default DayUsagePlot;
