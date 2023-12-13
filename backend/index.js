const app = require("./app");
const config = require("./config.json");
const port = 3000

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

app.listen(port, async () => {
	if(config.reset){
        // await database.dropDatabase();
        await setup();
    }
    console.log("Server is listening on port " + port + '\n');
});