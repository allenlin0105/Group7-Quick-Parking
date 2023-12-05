import axios from "axios";

const client = axios.create({
  baseURL: 'http://localhost:8000/api',
});

export function getSpaceInfo(spaceId, startDate, endDate) {
  console.log('startDate', startDate, 'endDate', endDate)
  return client.post('/space_info', 
    { spaceId: spaceId, start: startDate, end: endDate }
  );
}

export function getUsageRate(date) {
    console.log('date', date)
    return client.get(`/usage_rate/${date}`);
  }
  
