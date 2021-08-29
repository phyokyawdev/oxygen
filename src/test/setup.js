const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const request = require("supertest");

const app = require("@app");
const database = require("../startup/database");
const { Region } = require("../models/region");
const { Township } = require("../models/township");
const { User } = require("../models/user");

let mongo;

jest.setTimeout(100000);

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await database.connect(mongoUri);
  await database.populate();
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    if (
      collection.collectionName !== "regions" &&
      collection.collectionName !== "townships"
    )
      await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.login = async () => {
  const userName = "test";
  const email = "test@test.com";
  const password = "12345678";

  const res = await request(app)
    .post("/auth/signup")
    .send({ userName, email, password })
    .expect(201);

  const cookie = res.get("Set-Cookie");
  return cookie;
};

global.getFakeCookie = async () => {
  let counter = 1;
  const userName = `test${counter}`;
  const email = `test${counter}@test.com`;
  const password = "12345678";

  const res = await request(app)
    .post("/auth/signup")
    .send({ userName, email, password })
    .expect(201);

  const cookie = res.get("Set-Cookie");
  counter++;
  return cookie;
};

global.getPlant = async (cookie, counter) => {
  const region = await Region.findOne();
  const township = await Township.findOne({ region: region._id });
  const user = await User.findOne();

  const name = counter ? "oxygen" + counter : "oxygen";
  const address = {
    township: township._id,
    additionalInfo: "23rd street, Hlaing",
  };
  const phones = ["+959969006061", "09401581952"];
  const location = { type: "Point", coordinates: [95.1591741, 22.1298127] };
  const managers = [user._id];

  const res = await request(app)
    .post("/plants")
    .set("Cookie", cookie)
    .send({ name, address, phones, location, managers })
    .expect(201);

  return res.body;
};
