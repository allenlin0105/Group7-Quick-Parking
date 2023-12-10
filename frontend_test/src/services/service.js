import axios from "axios";

const client = axios.create({
  baseURL: 'http://localhost:8000/',
});

export function getSpaceInfo(spaceId, startDate, endDate) {
  const token = localStorage.getItem('token');
  console.log('startDate', startDate, 'endDate', endDate)
  return client.post('/space_info', 
    { space_id: spaceId, start_date: startDate, end_date: endDate }, 
    {
      headers: {"authorization": 'Bearer ' + token}
    }
  );
}

export function getUsageRate(date) {
  const token = localStorage.getItem('token');
  console.log('date', date)
  return client.post('/usage_rate', 
    {date: date},
    {
      headers: {"authorization": 'Bearer ' + token}
    }
  );
}

export function getAvailalbeSpace() {
  return client.get('/available_space');
}

export function login(id, passwd) {
  console.log('id', id)
  return client.post('/login', 
    { id: id, passwd: passwd });
}

