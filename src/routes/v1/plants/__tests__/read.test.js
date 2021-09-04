const request = require("supertest");
const app = require("@app");

describe("GET /v1/plants", () => {
  let region, township, near, isOpen, offset, limit;

  beforeEach(async () => {
    cookie = await global.login();
    const { address } = await global.getPlant(cookie, 1);
    await global.getPlant(cookie, 2);
    await global.getPlant(cookie, 3);
    await global.getPlant(cookie, 4);

    region = address.region.id;
    township = address.township.id;
    near = { type: "Point", coordinates: [95.1591742, 22.1298127] };
    offset = 0;
    limit = 20;
  });

  const execRegion = () => {
    return request(app)
      .get("/v1/plants")
      .query({
        region,
        isOpen,
        offset,
        limit,
      })
      .send();
  };

  const execTownship = () => {
    return request(app)
      .get("/v1/plants")
      .query({
        township,
        isOpen,
        offset,
        limit,
      })
      .send();
  };

  const execNear = () => {
    return request(app)
      .get("/v1/plants")
      .query({
        near,
        isOpen,
        offset,
        limit,
      })
      .send();
  };

  it("return 400 for invalid region", async () => {
    region = 1;
    const res = await execRegion();
    expect(res.status).toBe(400);
  });

  it("return 400 for invalid township", async () => {
    township = 1;
    const res = await execTownship();
    expect(res.status).toBe(400);
  });

  it("return 400 for invalid near", async () => {
    near = [123, 111];
    const res = await execNear();
    expect(res.status).toBe(400);
  });

  it("return 400 if both region, township and near are provided", async () => {
    const res = await request(app)
      .get("/v1/plants")
      .query({
        region,
        township,
        near,
        isOpen,
        offset,
        limit,
      })
      .send();

    expect(res.status).toBe(400);
  });

  // happy path
  it("return list of plants, provided valid region", async () => {
    const res = await execRegion();
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(4);
  });

  it("return list of plants, provided valid township", async () => {
    const res = await execTownship();
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(4);
  });

  it("return list of plants, provided valid near", async () => {
    const res = await execNear();
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(4);
  });

  it("return list of plants with provided offset and limit", async () => {
    offset = 1;
    limit = 2;
    const res = await execRegion();
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
  });
});
