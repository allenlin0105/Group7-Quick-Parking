import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import { getUsageRate } from '../../services/service';
import "./DayUsagePlot.css"

export default function DayUsagePlot(props){
  const { date } = props
  const [usageData, setUsageData] = useState(null)

  const fetchUsage = async (date) => {
    const { data } = await getUsageRate(date)
    console.log('usage', data)
    data.sort((a, b) => a.hour - b.hour);
    setUsageData(data)
  }

  useEffect(() => {
    setUsageData(null)
    fetchUsage(date);
  }, [date])

  const yAxisTickFormatter = (value) => `${value}%`;
  const xAxisTickFormatter = (value) => `${String(value).padStart(2, '0')}:00`;

  return (
    <ResponsiveContainer
      width="100%"
      height={400}
    >
      <BarChart
        data={usageData}
        margin={{ top: 20, right: 20, left: 20, bottom: 5 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis dataKey="hour" 
          tickFormatter={xAxisTickFormatter}
          tick={{ fontSize: "1.15em" }}
        />
        <YAxis 
        // label={{ value: '使用率', angle: -90, position: 'insideLeft' }}
          domain={[0, 100]}
          tickFormatter={yAxisTickFormatter}
          tick={{ fontSize: "1.15em" }}
        /> {/* Set Y-axis domain to [0, 100] */}
        <Bar dataKey="usage_rate" fill="#a9a5f0" >
          <LabelList dataKey="usage_rate" position="top" className="hideOnSmallScreen" style={{ fontSize: "1.15em" }}/>
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};