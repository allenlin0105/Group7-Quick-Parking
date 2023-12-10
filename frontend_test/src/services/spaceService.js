import axios from 'axios';

const client = axios.create({
    baseURL: 'http://localhost:3000',
  });

const getAvailableSpace = async () => {
    const response = await client.get('/available_space');
    return response.data;
};

const postPark = async (plate, space_id) => {
    const response = await client.post('/park', {
        plate: plate,
        space_id: space_id,
    });
    return response.data;
}

export default {
    getAvailableSpace,
    postPark,
}