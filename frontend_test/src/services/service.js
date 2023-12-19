import axios from "axios";

console.log(process.env.REACT_APP_API_URL);

const client = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/'
});

export function getSpaceInfo(spaceId, startDate, endDate) {
  const token = localStorage.getItem('token');
  console.log('startDate', startDate, 'endDate', endDate)
  return client.post('/space_info', 
    { space_id: spaceId - 1, start_date: startDate, end_date: endDate }, 
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

export function getAvailableSpace() {
  return client.get("/available_space");
}

export function getCars() {
  const token = localStorage.getItem('token');
  return client.get("/get_cars", 
  {
    headers: {"authorization": 'Bearer ' + token}
  });
}

export function findCar(plate) {
  return client.post("/find_car", {
    "plate": plate
  });
}

export function leave(space_id) {
  return client.post("/leave", {
    "space_id": space_id - 1
  });
}

export function postPark(plate, space_id) {
  return client.post('/park', {
    "plate": plate,
    "space_id": space_id - 1,
  });
}

export function getWarnings() {
  const token = localStorage.getItem('token');
  return client.get("/abnormal", 
  {
    headers: {"authorization": 'Bearer ' + token}
  });
}

