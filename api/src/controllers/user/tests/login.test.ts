import server from "../../../server";
import supertest from "supertest";
import { validateProperties } from "../../../utils";
import { testConstants } from "../../../tests/jestSetup";

const { TEST_USER } = testConstants;

/*
1. Incorrect email or password
2. correct email and password
*/

describe("POST user login", () => {
  const request = supertest(server.app);

  it("incorrect email or password", async () => {
    const cases = [
      {},
      { email: "wrong@email.com", password: "wrongpassword" },
      { email: TEST_USER?.email },
      { password: TEST_USER?.password },
      { email: TEST_USER?.email, password: "wrong" },
      { email: "wrongemail", password: TEST_USER?.password },
    ];

    for (const c in cases) {
      const res = await request.post("/user/login").send(c);
      expect(res.statusCode).toBe(400);
    }
  });

  /*
  Correct email password
  */
  it("correct email & password", async () => {
    const res = await request.post("/user/login").send({
      email: TEST_USER?.email,
      password: TEST_USER?.password,
    });
    expect(res.statusCode).toBe(200);
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
});
