const request = require("supertest");
const app = require("@app");

describe("GET /v1/regions", () => {
  let region;

  it("should return list of regions", async () => {
    const res = await request(app).get("/v1/regions").send();
    region = res.body[0];

    expect(res.status).toBe(200);
  });

  it("should return region object if valid id is provided", async () => {
    const res = await request(app).get(`/v1/regions/${region.id}`).send();

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject(region);
  });

  it("should return 404 if invalid id is provided", async () => {
    const res = await request(app).get("/v1/regions/1").send();

    expect(res.status).toBe(404);
  });
});
