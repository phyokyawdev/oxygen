const request = require("supertest");
const app = require("@app");

describe("/v1/auth/login", () => {
  let email;
  let password;

  beforeEach(async () => {
    await global.login();

    email = "test@test.com";
    password = "12345678";
  });

  const exec = () => {
    return request(app).post("/v1/auth/login").send({ email, password });
  };

  it("should returns 401 if invalid input is provided", async () => {
    email = "test";
    password = "12345";
    const res = await exec();
    expect(res.status).toBe(401);
  });

  it("should returns 401 if wrong email is provided", async () => {
    email = "test1@test.com";
    const res = await exec();
    expect(res.status).toBe(401);
  });

  it("should returns 401 if wrong password is provided", async () => {
    password = "thisis";
    const res = await exec();
    expect(res.status).toBe(401);
  });

  it("should returns 200 and a cookie on correct input", async () => {
    const res = await exec();
    expect(res.status).toBe(200);
    expect(res.get("Set-Cookie")).toBeDefined();
  });
});
