const request = require("supertest");
const mongoose = require("mongoose");
const app = require("@app");

describe("UPDATE /v1/plants/:id", () => {
  let cookie, id, name, address, phones, location, managers, isOpen;

  beforeEach(async () => {
    cookie = await global.login();
    ({ id, name, address, phones, location, managers } = await global.getPlant(
      cookie
    ));
    delete address.region;
    address.township = address.township.id;
    managers = managers.map((manager) => manager.id);
    isOpen = true;
  });

  // PUT
  describe("PUT /v1/plants/:id", () => {
    const exec = () => {
      return request(app)
        .put(`/v1/plants/${id}`)
        .set("Cookie", cookie)
        .send({ name, address, phones, location, managers });
    };

    it("return 404 if provided plant id is not exist", async () => {
      id = mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("return 401 if updater is not plant manager or admin", async () => {
      cookie = await global.getFakeCookie();
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("return updated plant if successful", async () => {
      name = "oxygen updated";
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body.name).toBe(name);
    });
  });

  // PATCH
  describe("PATCH /v1/plants/:id", () => {
    const exec = () => {
      return request(app)
        .patch(`/v1/plants/${id}`)
        .set("Cookie", cookie)
        .send({ isOpen });
    };

    it("return 400 if isOpen field is not provided", async () => {
      const res = await request(app)
        .put(`/v1/plants/${id}`)
        .set("Cookie", cookie)
        .send();
      expect(res.status).toBe(400);
    });

    it("return 404 if provided plant id is not exist", async () => {
      id = mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("return 401 if updater is not plant manager or admin", async () => {
      cookie = await global.getFakeCookie();
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("return updated plant if successful", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body.isOpen).toBe(true);
    });
  });
});
