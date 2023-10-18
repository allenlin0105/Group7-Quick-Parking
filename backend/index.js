const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { MongoClient } = require('mongodb');
const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);
const dbName = 'parkingDB';
const collectionName = "parkingLot";

const database = client.db(dbName);
const collections = database.collection(collectionName);

const n_parking_lots = 1;
const n_parking_places = 10;

function time_converter(timestamp) {
	const date = new Date(timestamp);
	const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric',};
	const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
	return formattedDate;
}


async function setup() {
	for (let index = 0; index < n_parking_lots; index++) {
		const doc = {
			parking_lot_id: index,
			space_is_available: Array(n_parking_places).fill(true),
			license_plate_nums: Array(n_parking_places).fill(""),
			start_time: Array(n_parking_places).fill(0),
			date_use_rate: Array(n_parking_places).fill(0),
			usage: Array(n_parking_places).fill(Array()),
		};
		const filter = {parking_lot_id: index}
		
		const result = await collections.updateOne(
			filter, 
			{ $setOnInsert: doc},
			{ upsert: true }
		);
		console.log(
			`Documents initialized.`,
		);
	}
}

async function get_available_space(parking_lot_id) {
	const query = { parking_lot_id: parking_lot_id };
	//const options = { projection: { _id: 0 } };

	const doc = await collections.findOne(query);

	let space_list = [];
	let space_count = 0;
	doc.space_is_available.forEach((is_available, idx) => {
		if (is_available) {
			space_count++;
			space_list.push(idx);
		}
	}); 
	return { space_count, space_list };
}

async function park(parking_lot_id, space_id, plate) {
	const query = {parking_lot_id : parking_lot_id};
	const doc = await collections.findOne(query);
	if (doc.space_is_available[space_id]) {
		const update = {
			$set: {
				[`space_is_available.${space_id}`] : false,
				[`license_plate_nums.${space_id}`] : plate,
				[`start_time.${space_id}`] : Date.now(),
			},
		};	
		const result = await collections.updateOne(
			query, 
			update,
		);
		
		return space_id;
	}
	return -1;
}

async function leave(parking_lot_id, space_id) {
    const query = {parking_lot_id : parking_lot_id};
	const doc = await collections.findOne(query);
    if(doc.space_is_available[space_id] == true)
        return -1;

    const usage = {
        plate : doc.license_plate_nums[space_id],
        start_time : doc.start_time[space_id],
        end_time : Date.now(),
    };
    const update = {
        $set: { [`space_is_available.${space_id}`] : true },
        $push : { [`usage.${space_id}`] : usage },
    };
    const result = await collections.updateOne(
        query, 
        update,
    );
    
    return usage;
}

async function find_car(parking_lot_id, plate){
    const query = {parking_lot_id : parking_lot_id};
	const doc = await collections.findOne(query);
    for(let i = 0; i < doc.license_plate_nums.length; i++){
        if(doc.license_plate_nums[i] == plate){
            if(doc.space_is_available[i] == true)
                return -1;
            return {
                space_id : i,
                start_time : doc.start_time[i],
            };
        }
    }
    return -1;
}

app.get('/available_space', async (req, res) => {
    const parking_lot_id = 0;
    console.log('GET /available_space');
    const {space_count, space_list} = await get_available_space(parking_lot_id);
    console.log("Number of available space = " + space_count + '\n');
    res.send({n_available_space: space_count, space_list: space_list});
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
		result.start_time = time_converter(result.start_time);
        res.send(result); 
	}
})

app.listen(port, async () => {
	await database.dropDatabase();
    await setup();
    console.log("Server is listening on port " + port + '\n');
});
