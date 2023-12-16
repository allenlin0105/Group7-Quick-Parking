# Quick Parking Backend API Note

## How to run locally

1. NodeJS and MongoDB should be downloaded in advance
2. Run `npm install` to install required packages
3. Run `node index.js` to listen on port 3000

## APIs

available_space

```sh
curl localhost:3000/available_space
```

park

```sh
curl -H "Content-Type: application/json" -X POST -d '{"plate":"xxx", "space_id":xxx}' localhost:3000/park
```

leave

```sh
curl -H "Content-Type: application/json" -X POST -d '{"space_id":xxx}' localhost:3000/leave
```

find_car

```sh
curl -H "Content-Type: application/json" -X POST -d '{"plate":"xxx"}' localhost:3000/find_car
```

space_info

```sh
curl -H "Content-Type: application/json" -H "authorization: Bearer ${token}" -X POST -d '{"space_id":xxx, "start_date":"YYYY-MM-DD", "end_date":"YYYY-MM-DD"}' localhost:3000/space_info
```

usage_rate

```sh
curl -H "Content-Type: application/json" -H "authorization: Bearer ${token}" -X POST -d '{"date": "YYYY-MM-DD"}' localhost:3000/usage_rate
```

login

```sh
curl -H "Content-Type: application/json" -X POST -d '{"id":"xxx", "passwd":"xxx"}' localhost:3000/login
```

## Run test

```sh
npm test
```
