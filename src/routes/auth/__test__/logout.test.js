const request = require("supertest");
const app = require("@app");

describe("/auth/logout", () => {
  it("should clears cookie after logout", async () => {
    await global.login();

    const res = await request(app).post("/auth/logout").send({}).expect(200);
    expect(res.get("Set-Cookie")).toBeDefined();
  });
});
