# Quick Parking Backend API Note

## How to run locally
1. NodeJS and MongoDB should be downloaded in advance
3. Run `npm install` to install required packages
4. Set parking lot parameters in `config.json`.
5. Set PORT and MONGO_URL in `.env`. If you intend to connect to Azure MongoDB, please contact me for the secret MONGO_URL.
4. Run `node index.js` to listen on port 3000

## test
available_space
```sh
curl localhost:3000/api/user/available_space
```

parking_lot_size
```sh
curl localhost:3000/api/user/parking_lot_size
```

park
```sh
curl -H "Content-Type: application/json" -X POST -d '{"plate":"xxx", "space_id":xxx}' localhost:3000/api/user/park
```

leave
```sh
curl -H "Content-Type: application/json" -X POST -d '{"space_id":xxx}' localhost:3000/api/user/leave
```

find_car
```sh
curl -H "Content-Type: application/json" -X POST -d '{"plate":"xxx"}' localhost:3000/api/user/find_car
```

space_info
```sh
curl -H "Content-Type: application/json" -H "authorization: Bearer ${token}" -X POST -d '{"space_id":xxx, "start_date":"YYYY-MM-DD", "end_date":"YYYY-MM-DD"}' localhost:3000/api/guard/space_info
```

usage_rate
```sh
curl -H "Content-Type: application/json" -H "authorization: Bearer ${token}" -X POST -d '{"date": "YYYY-MM-DD"}' localhost:3000/api/guard/usage_rate
```

login
```sh
curl -H "Content-Type: application/json" -X POST -d '{"id":"xxx", "passwd":"xxx"}' localhost:3000/api/user/login
```
abnormal
```sh
curl -H "Content-Type: application/json" -H "authorization: Bearer ${token}" localhost:3000/api/guard/abnormal
```