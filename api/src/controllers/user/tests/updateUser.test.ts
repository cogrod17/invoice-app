import server from "../../../server";
import supertest from "supertest";
import { testConstants } from "../../../tests/jestSetup";
import { validateProperties } from "../../../utils";

const { TEST_USER, TOKEN } = testConstants;

describe("PUT /user/update/:id", () => {
  const { db, app } = server;
  const request = supertest(app);

  const updateUser = {
    id: TEST_USER.id,
    email: "updatedTest@email.com",
    firstname: "updatedFirstTest",
    lastname: "updatedLastTest",
  };

  const makeReq = async (id: number) =>
    await request
      .put(`/user/update/${id}`)
      .set(...TOKEN)
      .send(updateUser);

  afterAll(
    async () =>
      await db.query(
        `UPDATE users SET email = $1, firstname = $2, lastname = $3 WHERE id = $4`,
        [TEST_USER.email, TEST_USER.firstname, TEST_USER.lastname, TEST_USER.id]
      )
  );

  it("update user info with valid data", async () => {
    const res = await makeReq(TEST_USER.id);

    expect(res.statusCode).toBe(200);
    expect(validateProperties(Object.keys(updateUser), res.body));
  });

  it("trying to update a different user", async () => {
    const res = await makeReq(TEST_USER.id + 17);
    expect(res.statusCode).toBe(401);
  });

  it("no auth given", async () => {
    const res = await request
      .put(`/user/update/${TEST_USER.id}`)
      .send(updateUser);

    expect(res.statusCode).toBe(401);
  });
});
