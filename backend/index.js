const express = require("express");
const cors = require("cors");
const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { DateTime } = require("luxon");
const config = require("./config.json");
const sha256 = require('js-sha256');
const {expressjwt: expressjwt} = require('express-jwt')
const jwt = require('jsonwebtoken')

// Load environment variable
require('dotenv').config()
// Mongo setup
const { MongoClient } = require('mongodb');
//const url = 'mongodb://127.0.0.1:27017';
const url = process.env.MONGO_URL
const client = new MongoClient(url);
const dbName = 'parkingDB';
const database = client.db(dbName);

const parking_lot_coll = database.collection("parkingLot");
const usage_coll = database.collection("usage");
//const guard_coll = database.collection("guard");

function time_converter(timestamp) {
	return DateTime.fromMillis(timestamp).setZone('Asia/Taipei').toISO();
}


async function setup() {
    const n_parking_lots = config.n_parking_lots;
    for (let i = 0; i < n_parking_lots; i++) {
        const n_spaces = config.parking_lot_size[i];
		const parking_lot = {
			parking_lot_id: i,
            size: n_spaces,
			space_is_available: Array(n_spaces).fill(true),
			license_plate_nums: Array(n_spaces).fill(""),
			start_time: Array(n_spaces).fill(0),
			//usage_rate : Array(),
			//usage: Array(n_spaces).fill(Array()),
		};
		
		const result = await parking_lot_coll.updateOne(
            { parking_lot_id: i },
			{ $setOnInsert: parking_lot },
			{ upsert: true }
		);
		console.log(
			`Parking lot initialized.`,
		);
	}
    
    const guards = config.guards;
    for(let i = 0; i < config.guards.length; i++){
        const guard = {
            guard_id: sha256(guards[i].id),
            passwd: sha256(guards[i].passwd),
            login: false,
        }
        const result = await parking_lot_coll.updateOne(
            { guard_id : guards[i].id},
            { $setOnInsert: guard},
            {upsert: true},
        );
    }
}

async function get_available_space(parking_lot_id) {
	const parking_lot_query = { parking_lot_id: parking_lot_id };
	const parking_lot = await parking_lot_coll.findOne(parking_lot_query);

	let space_list = [];
	let space_count = 0;
	parking_lot.space_is_available.forEach((is_available, idx) => {
		if (is_available) {
			space_count++;
			space_list.push(idx);
		}
	}); 
	return { space_count, space_list };
}

async function get_total_space(parking_lot_id) {
    const parking_lot = await parking_lot_coll.findOne({parking_lot_id: parking_lot_id});
    return parking_lot.size;
}

async function park(parking_lot_id, space_id, plate) {
	const parking_lot_query = {parking_lot_id : parking_lot_id};
	const parking_lot = await parking_lot_coll.findOne(parking_lot_query);
	if (parking_lot.space_is_available[space_id]) {
		let result = await parking_lot_coll.updateOne(
			parking_lot_query, 
			{
                $set: {
				[`space_is_available.${space_id}`] : false,
				[`license_plate_nums.${space_id}`] : plate,
				[`start_time.${space_id}`] : Date.now(),
			    },
            },
		);

        const usage = {
            parking_lot_id : parking_lot_id,
            space_id : space_id,
            plate : plate,
            start_time : Date.now(),
            end_time : Number.MAX_VALUE,
        };
        result = await usage_coll.insertOne(usage);
		
		return space_id;
	}
	return -1;
}

async function leave(parking_lot_id, space_id) {
    const parking_lot_query = {parking_lot_id : parking_lot_id};
	const parking_lot = await parking_lot_coll.findOne(parking_lot_query);
    if(parking_lot.space_is_available[space_id] == true)
        return -1;
    const update = {
        $set: {
            [`space_is_available.${space_id}`] : true,
        },
    };
    let result = await parking_lot_coll.updateOne(
        parking_lot_query, 
        {$set : {[`space_is_available.${space_id}`] : true,},},
        //update,
    );

    const usage_query = {
        parking_lot_id : parking_lot_id,
        space_id : space_id,
        plate : parking_lot.license_plate_nums[space_id],
        end_time : Number.MAX_VALUE,
    };
    const time = Date.now()
    result  = await usage_coll.updateOne(
        usage_query,
        { $set : {end_time : time} },
    );
    usage_query.end_time = time;
    const usage = await usage_coll.findOne(usage_query)
    return usage;
}

async function find_car(parking_lot_id, plate){
    const query = {parking_lot_id : parking_lot_id};
	const parking_lot = await parking_lot_coll.findOne(query);
    for(let i = 0; i < parking_lot.license_plate_nums.length; i++){
        if(parking_lot.license_plate_nums[i] == plate){
            if(parking_lot.space_is_available[i] == true)
                return -1;
            return {
                space_id : i,
                used_time : (Date.now() - parking_lot.start_time[i]) / 1000,
            };
        }
    }
    return -1;
}

async function space_info(parking_lot_id, space_id, start_day, end_day){
    const time = new Date();
    const end_time = Math.min(DateTime.now().setZone('Asia/Taipei').toMillis(), DateTime.fromISO(end_day).setZone('Asia/Taipei').endOf('day').toMillis())
    const start_time = DateTime.fromISO(start_day).setZone('Asia/Taipei').startOf('day').toMillis()
    const day_delta = 1000 * 3600 * 24;
    
    const usage_query = {
        parking_lot_id : parking_lot_id,
        space_id : space_id,
        end_time : { $gte : start_time},
    }
    let usage_list = await usage_coll.find(usage_query);//.sort({start_time : 1});
    usage_list = await usage_list.toArray();
    // sort by start_time by ascending order
    usage_list.sort((a,b) => (a.start_time > b.start_time) ? 1 : ((b.start_time > a.start_time) ? -1 : 0))
    let ret = structuredClone(usage_list);

    // calculate utility for the passed week
    let utilities = Array();
    let day_start = start_time;
    let day_end = start_time + day_delta;
    while(day_start < end_time){
        let time_sum = 0;
        // calculate utility(usage) of a day
        while(usage_list.length && usage_list[0].start_time < day_end){
            time_sum += Math.min(usage_list[0].end_time, day_end) - Math.max(usage_list[0].start_time, day_start);
            usage_list[0].start_time = Math.min(day_end, usage_list[0].end_time);
            if(usage_list[0].start_time == usage_list[0].end_time)
                usage_list.shift();
        }
        date_str = DateTime.fromMillis(day_start).setZone('Asia/Taipei').toISO().split('T')[0]
        utilities.push({date : date_str, utility : Math.round(time_sum / day_delta * 100)});
        day_start = day_end;
        day_end = Math.min(day_end + day_delta, end_time);
    }

    return {utilities, usage_list : ret};
}

async function usage_rate(parking_lot_id, date){
    const parking_lot_query = {parking_lot_id : parking_lot_id};
	const parking_lot = await parking_lot_coll.findOne(parking_lot_query);
    console.log('parking_lot', parking_lot)
    const end_time = Math.min(DateTime.now().setZone('Asia/Taipei').toMillis(), DateTime.fromISO(date).setZone('Asia/Taipei').endOf('day').toMillis());
    const start_time = DateTime.fromISO(date).setZone('Asia/Taipei').startOf('day').toMillis();
    
    let time = end_time;
    let hour = parseInt(DateTime.fromMillis(time).setZone('Asia/Taipei').toISO().split('T')[1].split(':')[0])
    results = [];
    while(time >= start_time){
        const usage_query = {
            parking_lot_id : parking_lot_id,
            end_time : { $gt : time } ,
            start_time : { $lt : time } ,
        }
        let n_cars = await usage_coll.countDocuments(usage_query);
        results.push({ hour : hour, usage_rate : Math.round((n_cars / parking_lot.space_is_available.length) * 100)});
        time -= 1000 * 3600;
        hour--;
        console.log('hour', hour)
    }
    const uniqueResults = Array.from(new Set(results.map(item => item.hour)))
        .map(hour => {
            return results.find(item => item.hour === hour);
        });
    return uniqueResults;
}

async function login(id, passwd){
    const guard = {guard_id : sha256(id), passwd : sha256(passwd)};
    const result = await parking_lot_coll.findOne(guard);
    if(result)
        return true;
    return false;
}


//-----------------------------------------------------------------------------------
app.use(
    expressjwt({ secret: config.jwt_secret, algorithms: ["HS256"] }).unless({
      path: ['/available_space', '/parking_lot_size', '/park', '/leave', '/find_car', '/login'],
    })
)

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {   
      res.status(401).send('invalid token')
    }
})
  
app.post("/login", async (req, res) => {
    const id = req.body.id;
    const passwd = req.body.passwd;
    const result = await login(id, passwd);
    console.log('POST /login\n');

    if (!result) {
        return res.send({
            status: 400,
            message: "Failed",
        });
    }
    
    const tokenStr = jwt.sign({ username: id }, config.jwt_secret, {
        expiresIn: "30m",
    });
    res.send({
        status: 200,
        message: "Success",
        token: tokenStr,
    });
});

app.get('/available_space', async (req, res) => {
    const parking_lot_id = 0;
    console.log('GET /available_space\n');
    const {space_count, space_list} = await get_available_space(parking_lot_id);
    const total_space = await get_total_space(parking_lot_id);
    res.send({total_space: total_space, n_available_space: space_count, space_list: space_list});
})

app.get('/parking_lot_size', async (req, res) => {
    const parking_lot_id = 0;
    console.log('GET /parking_lot_size\n');
    const result = await get_total_space(parking_lot_id);
    res.send({size : result});
})

app.post('/park', async (req, res) => {
    const parking_lot_id = 0;
    const plate = req.body.plate;
    const space_id = req.body.space_id;
    console.log('POST /park');
    const id = await park(parking_lot_id, space_id, plate);
    console.log(
        `${plate} park at patking lot ${parking_lot_id}, space id ${space_id}\n`,
    );
    res.send({space_id: id});
})

app.post('/leave', async (req, res) =>{
    const parking_lot_id = 0;
    const space_id = req.body.space_id;
    console.log('POST /leave');
    result = await leave(parking_lot_id, space_id);
    console.log(
        `A car left the parking lot ${parking_lot_id}, space id ${space_id}, ${JSON.stringify(result)}\n`,
    );
    if(result == -1)
        res.send("No car in the space");
    else{
		result.start_time = time_converter(result.start_time);
		result.end_time = time_converter(result.end_time);
        res.send(result);
	}
})

app.post('/find_car', async (req, res) => { 
    const parking_lot_id = 0;
    const plate = req.body.plate;
    console.log('POST /find_car');
    const result = await find_car(parking_lot_id, plate)
    console.log(JSON.stringify(result) + '\n');
    if(result == -1)
        res.send("not found");
    else{
        res.send(result); 
	}
})

app.post('/space_info', async(req, res) => {
    const parking_lot_id = 0;
    const space_id = req.body.space_id;
    const start_date = req.body.start_date;
    const end_date = req.body.end_date;
    const result = await space_info(parking_lot_id, space_id, start_date, end_date);
    console.log('POST/space_info');

    for(let i = 0; i < result.usage_list.length; i++){
        result.usage_list[i].start_time = DateTime.fromMillis(result.usage_list[i].start_time).setZone('Asia/Taipei').toISO();
        result.usage_list[i].end_time = DateTime.fromMillis(result.usage_list[i].end_time).setZone('Asia/Taipei').toISO();
    }
    //console.log(result.usage_list)
    res.send(result);
})

app.post('/usage_rate', async(req, res) => {
    const parking_lot_id = 0;
    const date = req.body.date;
    const result = await usage_rate(parking_lot_id, date);
    console.log('POST/usage_rate');
    res.send(result);
})

app.listen(port, async () => {
	if(config.reset){
        // await database.dropDatabase();
        await setup();
    }
    console.log("Server is listening on port " + port + '\n');
});