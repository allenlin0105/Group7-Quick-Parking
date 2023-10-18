# Quick Parking Backend API Note

## How to run locally
1. NodeJS and MongoDB should be downloaded in advance
3. Run `npm install` to install required packages
4. Run `node index.js` to listen on port 3000

## test
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
curl -H "Content-Type: application/json" -X POST -d '{"plate":"xxx"}' localhost:3000/park
```
