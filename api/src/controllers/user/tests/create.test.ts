import supertest from "supertest";
import server from "../../../server";
import { validateProperties } from "../../../utils";

describe("POST /user/create", () => {
  const { app, db } = server;

  const request = supertest(app);
  const newUser = {
    email: "newUserTesTinG1@emailtest.com",
    firstname: "testingFirst",
    lastname: "testingLast",
    password: "password",
  };
  let userId: number;

  afterAll(
    async () => await db.query(`DELETE FROM users WHERE id = $1`, [userId])
  );

  it("create new user with valid and unique email, returns access_token and refresh_token", async () => {
    const res = await request.post("/user/create").send(newUser);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id");
    userId = res.body.id;
    expect(
      validateProperties(
        [
          "id",
          "email",
          "firstname",
          "lastname",
          "access_token",
          "refresh_token",
        ],
        res.body
      )
    ).toBe(true);
  });

  it("passed invalid user credentials", async () => {
    const cases = [
      { email: newUser.email },
      { email: "notarealemail", password: "password" },
    ];

    for (const c in cases) {
      const res = await request.post("/user/create").send(c);
      expect(res.statusCode).toBe(400);
    }
  });
});
