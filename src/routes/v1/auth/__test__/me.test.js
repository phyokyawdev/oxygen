const request = require("supertest");
const app = require("@app");

describe("/v1/auth/me", () => {
  it("should respond with detail about the current user", async () => {
    const cookie = await global.login();

    const res = await request(app)
      .get("/v1/auth/me")
      .set("Cookie", cookie)
      .send()
      .expect(200);
    expect(res.body.id).toBeDefined();
  });

  it("should respond 401 if not authenticated", async () => {
    return request(app).get("/v1/auth/me").send().expect(401);
  });
});
