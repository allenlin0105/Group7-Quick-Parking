const request = require("supertest");
const app = require("../app");
const config = require("../config.json");

function makeid(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

function formatDate(date) {
  let d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;

  return [year, month, day].join('-');
}


const mockPlate = makeid(10)
let token;

describe("POST /login", () => {
  test("should return token", async () => {
    const response = await request(app)
      .post("/login", {}).send({
        id: config.guards[0].id,
        passwd: config.guards[0].passwd
      });
    expect(response.body.status).toBe(200);
    expect(response.body.message).toBe('Success');
    expect(response.body.token).toBeDefined();
    token = response.body.token
  });
});

describe("POST /usage_rate", () => {
  test("should success", async () => {
    const response = await request(app)
      .post("/usage_rate", {})
      .set('authorization', `Bearer ${token}`)
      .send({
        date: "2023-11-26"
      });
    expect(response.statusCode).toBe(200);
  });
});

let available_slot;

describe("GET /available_space", () => {
  test("should return total_space, n_available_space, space_list", async () => {
    const response = await request(app)
      .get("/available_space", {})
    expect(response.statusCode).toBe(200);
    expect(response.body.total_space).toBe(config.parking_lot_size[0]);
    expect(response.body.n_available_space).toBeLessThan(config.parking_lot_size[0]);
    expect(response.body.space_list.length).toBe(response.body.n_available_space);
    available_slot = response.body.space_list[0];

  });
});

describe("POST /park", () => {
  test("should return space_id", async () => {
    const response = await request(app)
      .post("/park", {})
      .set('authorization', `Bearer ${token}`)
      .send({
        plate: mockPlate,
        space_id: available_slot
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.space_id).toBe(available_slot);
  });
});

describe("POST /find_car", () => {
  test("should return space_id and start_time", async () => {
    const response = await request(app)
      .post("/find_car", {})
      .send({
        plate: mockPlate
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.space_id).toBe(available_slot);
    expect(response.body.start_time).toBeDefined();
  });
});

describe("POST /leave", () => {
  test("should return space_id, plate, start_time, end_time", async () => {
    const response = await request(app)
      .post("/leave", {})
      .set('authorization', `Bearer ${token}`)
      .send({
        space_id: available_slot
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.space_id).toBe(available_slot);
    expect(response.body.plate).toBe(mockPlate);
    expect(response.body.start_time).toBeDefined();
    expect(response.body.end_time).toBeDefined();
  });
});

// Car already left but try to find
describe("POST /find_car", () => {
  test("should return not found", async () => {
    const response = await request(app)
      .post("/find_car", {})
      .send({
        plate: mockPlate
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("not found");
    expect(response.body.space_id).toBe(-1);
  });
});

describe("POST /space_info", () => {
  test("should return utilites and usage_list", async () => {
    // Getting today's date
    let today = new Date();

    // Getting the date 5 days ago
    let fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(today.getDate() - 5);

    let todayFormatted = formatDate(today);
    let fiveDaysAgoFormatted = formatDate(fiveDaysAgo);

    const response = await request(app)
      .post("/space_info", {})
      .set('authorization', `Bearer ${token}`)
      .send({
        space_id: 4,
        start_date: fiveDaysAgoFormatted,
        end_date: todayFormatted
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.utilities).toBeDefined();
    expect(response.body.utilities.length).toBe(6);
    expect(response.body.usage_list).toBeDefined();
  });
});