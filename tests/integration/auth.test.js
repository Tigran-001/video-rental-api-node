const request = require("supertest");
const { Genre } = require("../../models/genre");
const { User } = require("../../models/user");

describe("authorization middleware", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await server.close();
    await Genre.deleteMany({});
  });

  let token;
  const exec = () => {
    return request(server)
      .post("/api/genres")
      .set("x-auth-token", token)
      .send({ name: "genre1" });
  };

  beforeEach(() => {
    token = new User().generateAuthToken();
  });
  test("should return 401 if no auth token is porvided.", async () => {
    token = "";
    const res = await exec();
    expect(res.status).toBe(401);
  });

  test("should return 400 if no auth token is porvided.", async () => {
    token = "a";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  test("should return 200 if no auth token is porvided.", async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  });
});
