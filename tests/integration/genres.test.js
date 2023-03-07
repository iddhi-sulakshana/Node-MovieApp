const request = require("supertest");
const { Genres } = require("../../models/genres");
const { Users } = require("../../models/users");
const mongoose = require("mongoose");
let server;
describe("/api/genres", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    server.close();
    await Genres.remove({});
  });
  describe("GET /", () => {
    it("should return all genres", async () => {
      await Genres.collection.insertMany([
        { name: "genre1" },
        { name: "genre2" },
      ]);
      const res = await request(server).get("/api/genres");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((x) => x.name === "genre1")).toBeTruthy();
      expect(res.body.some((x) => x.name === "genre2")).toBeTruthy();
    });
  });
  describe("GET /:id", () => {
    it("should return a genre if valid id passed", async () => {
      const genre = await new Genres({ name: "genre1" }).save();
      const res = await request(server).get("/api/genres/" + genre._id);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", genre.name);
    });
    it("should return 400 error if invalid object id passed", async () => {
      const res = await request(server).get("/api/genres/1");
      expect(res.status).toBe(400);
    });
    it("should return 404 error if invalid id passed", async () => {
      const id = new mongoose.Types.ObjectId().toHexString();
      const res = await request(server).get("/api/genres/" + id);
      expect(res.status).toBe(404);
    });
  });
  describe("POST /", () => {
    let token;
    let name;
    const exec = async () => {
      return await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name });
    };
    beforeEach(() => {
      token = new Users().generateAuthToken();
      name = "genre1";
    });
    it("should return 401 if user is not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });
    it("should return 400 error if genre is less than 5 characters", async () => {
      name = "aa";

      const res = await exec();

      expect(res.status).toBe(400);
    });
    it("should return 400 error if genre is more than 50 characters", async () => {
      name = new Array(55).join("a");
      const res = await exec();

      expect(res.status).toBe(400);
    });
    it("should save the genre if valid", async () => {
      await exec();
      const genre = await Genres.find({ name: "genre1" });
      expect(genre).not.toBeNull();
    });
    it("should return the genre if valid", async () => {
      const res = await exec();
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "genre1");
    });
  });
});
