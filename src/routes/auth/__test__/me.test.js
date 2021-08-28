const request = require("supertest");
const app = require("@app");

describe("/auth/me", () => {
  it("should respond with detail about the current user", async () => {
    const cookie = await global.login();

    const res = await request(app)
      .get("/auth/me")
      .set("Cookie", cookie)
      .send()
      .expect(200);
    expect(res.body.id).toBeDefined();
  });

  it("should respond 401 if not authenticated", async () => {
    return request(app).get("/auth/me").send().expect(401);
  });
});
