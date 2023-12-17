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

const mockPlate = makeid(10)

// No authenitcation 401

describe("POST /usage_rate", () => {
  test("should return 401", async () => {
    const response = await request(app)
      .post("/usage_rate", {})
      .send({
        date: "2023-11-26"
      });
    expect(response.statusCode).toBe(401);
  });
});

describe("POST /space_info", () => {
  test("should return 401", async () => {
    const response = await request(app)
      .post("/space_info", {})
      .send({
        space_id: 4,
        start_date: "2023-12-03",
        end_date: "2023-12-09"
      });
    expect(response.statusCode).toBe(401);
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

// Invalid user
describe("POST /login", () => {
  test("should return failed", async () => {
    const response = await request(app)
      .post("/login", {}).send({
        id: "54321",
        passwd: "54321"
      });
    expect(response.body.status).toBe(400);
    expect(response.body.message).toBe('Failed');
  });
});

// Authentication for the following tests
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

// No car but leave
describe("POST /leave", () => {
  test("should return no car", async () => {
    const response = await request(app)
      .post("/leave", {})
      .set('authorization', `Bearer ${token}`)
      .send({
        space_id: available_slot
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('No car in the space');
  });
});

// Space not available but park
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
    expect(response.body.space_id).toBe(-1);
  });
});

// Find non-existent car
describe("POST /find_car", () => {
  test("should return not found", async () => {
    const notExistPlate = makeid(10)
    const response = await request(app)
      .post("/find_car", {})
      .send({
        plate: notExistPlate
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("not found");
    expect(response.body.space_id).toBe(-1);
  });
});