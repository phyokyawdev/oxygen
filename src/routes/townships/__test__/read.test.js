const request = require("supertest");
const mongoose = require("mongoose");
const app = require("@app");
const { Region } = require("../../../models/region");
const { Township } = require("../../../models/township");

describe("GET /townships", () => {
  let region_id;
  let township_id;

  beforeEach(async () => {
    const region = await Region.findOne();
    region_id = region._id;

    const township = await Township.findOne({ region: region_id });
    township_id = township._id;
  });

  const exec = () => {
    return request(app).get(`/regions/${region_id}/townships/${township_id}`);
  };

  it("should return 404 if invalid region_id and township_id is provided", async () => {
    region_id = 1;
    township_id = 1;
    const res = await exec();
    expect(res.status).toBe(404);
  });

  it("should return 404 if provided ids are not exist", async () => {
    region_id = mongoose.Types.ObjectId();
    township_id = mongoose.Types.ObjectId();
    const res = await exec();
    expect(res.status).toBe(404);
  });

  it("should return list of townships of region provided", async () => {
    township_id = "";
    const res = await exec();
    expect(res.status).toBe(200);
  });

  it("should return township if valid region_id and township_id is provided", async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  });
});
