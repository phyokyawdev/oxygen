const request = require("supertest");
const mongoose = require("mongoose");

const app = require("@app");
const { Region } = require("@models/region");
const { Township } = require("@models/township");
const { User } = require("@models/user");

describe("POST /v1/plants", () => {
  let cookie, name, phones, address, location, managers;

  beforeEach(async () => {
    cookie = await global.login();
    const region = await Region.findOne();
    const township = await Township.findOne({ region: region._id });
    const manager = await User.findOne();

    name = "oxygen";
    address = {
      township: township._id,
      additionalInfo: "23rd street, Hlaing",
    };
    phones = ["+959969006061", "09401581952"];
    location = { type: "Point", coordinates: [95.1591741, 22.1298127] };
    managers = [manager._id];
  });

  const exec = () => {
    return request(app).post("/v1/plants").set("Cookie", cookie).send({
      name,
      address,
      phones,
      location,
      managers,
    });
  };

  it("return 401 if invalid cookie is provided", async () => {
    cookie = "";
    const res = await exec();
    expect(res.status).toBe(401);
  });

  it("return 400 if invalid name is provided", async () => {
    name = "";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("return 400 if invalid address is provided", async () => {
    address = {
      township: mongoose.Types.ObjectId(),
      additionalInfo: "sth",
    };
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("return 400 if invalid phones is provided", async () => {
    phones = ["09646109"];
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("return 400 if invalid location is provided", async () => {
    location = { coordinates: [95.1591741, 22.1298127] };
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("return 400 if invalid manager is provided", async () => {
    managers.push(mongoose.Types.ObjectId());
    //managers = [""];
    //const sth = await User.findOne();
    //managers = [sth._id, sth._id];
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("return 201 if optional location is not provided", async () => {
    const res = await request(app)
      .post("/v1/plants")
      .set("Cookie", cookie)
      .send({ name, address, phones, managers });

    expect(res.status).toBe(201);
  });

  it("return 201 if valid info is provided", async () => {
    const res = await exec();
    expect(res.status).toBe(201);
  });
});
