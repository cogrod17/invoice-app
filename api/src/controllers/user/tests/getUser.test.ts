import server from "../../../server";
import supertest from "supertest";
import { validateProperties } from "../../../utils";
import { testConstants } from "../../../tests/jestSetup";

const { TEST_USER, TOKEN } = testConstants;

describe("GET /user/:id", () => {
  const { app } = server;
  const request = supertest(app);

  it("get user with appropriate id", async () => {
    const res = await request
      .get(`/user/${TEST_USER.id}`)
      .set(...TOKEN)
      .send();

    expect(res.statusCode).toBe(200);
    expect(
      validateProperties(["id", "email", "firstname", "lastname"], res.body)
    ).toBe(true);
  });

  it("incorrect user id passed in params", async () => {
    const res = await request
      .get("/user/1")
      .set(...TOKEN)
      .send();

    expect(res.statusCode).toBe(401);
  });
});
