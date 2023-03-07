const request = require("supertest");
const { Users } = require("../../models/users");
const { Genres } = require("../../models/genres");
let server;
let token;
describe("auth-middleware", () => {
  beforeEach(() => {
    token = new Users().generateAuthToken();
    server = require("../../index");
  });
  afterEach(async () => {
    await Genres.remove({});
    server.close();
  });
  const exec = () => {
    return request(server)
      .post("/api/genres")
      .set("x-auth-token", token)
      .send({ name: "genre1" });
  };
  it("should return 401 if no token is provided", async () => {
    token = "";
    const res = await exec();
    expect(res.status).toBe(401);
  });
  it("should return 400 if token is invalid", async () => {
    token = "a";
    const res = await exec();
    expect(res.status).toBe(400);
  });
  it("should return 200 if token is valid", async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  });
});
