import server from "../../../server";
import supertest from "supertest";
import { testConstants } from "../../../tests/jestSetup";

const { TEST_USER, TOKEN } = testConstants;

type Body = {
  oldPassword: string;
  newPassword: string;
};

describe("POST /user/reset_password/:id", () => {
  const { app, db } = server;
  const request = supertest(app);

  const validRequest: Body = {
    oldPassword: TEST_USER.password,
    newPassword: "newPassword",
  };

  const makeReq = async (user_id: number, body: Body) =>
    await request
      .post(`/user/reset_password/${user_id}`)
      .set(...TOKEN)
      .send(body);

  afterEach(
    async () =>
      await db.query(
        `UPDATE users SET password = crypt($1, gen_salt('bf')) WHERE id = $2`,
        [TEST_USER.password, TEST_USER.id]
      )
  );

  it("proper request", async () => {
    const res = await makeReq(TEST_USER.id, validRequest);
    expect(res.statusCode).toBe(200);
  });

  it("wrong oldPassword provided", async () => {
    const res = await makeReq(TEST_USER.id, {
      oldPassword: "thisIsNotTheOldPassword",
      newPassword: "newPassword",
    });

    expect(res.statusCode).toBe(400);
  });

  it("attempt to update different user password", async () => {
    const res = await makeReq(TEST_USER.id + 17, validRequest);
    expect(res.statusCode).toBe(401);
  });
});
