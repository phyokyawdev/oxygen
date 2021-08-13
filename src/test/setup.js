const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");

let mongo;

jest.setTimeout(100000);

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
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