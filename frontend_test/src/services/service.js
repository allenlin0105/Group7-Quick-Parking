import axios from "axios";

const client = axios.create({
  // baseURL: 'http://localhost:8000/api',
  baseURL: 'http://localhost:3000',
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

export function getAvailableSpace() {
  return client.get("/available_space");
}

export function postPark(plate, space_id) {
  return client.post('/park', {
    plate: plate,
    space_id: space_id,
  });
}