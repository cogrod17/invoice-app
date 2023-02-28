import server from "../../../server";
import supertest from "supertest";
import { validateProperties } from "../../../utils";

const { TEST_USER } = process.env;

interface TestUser {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

/*
1. Incorrect email or password
2. correct email and password
*/

describe("POST user login", () => {
  const request = supertest(server.app);
  const user: TestUser | undefined = JSON.parse(TEST_USER || "");

  it("incorrect email or password", async () => {
    const cases = [
      {},
      { email: "wrong@email.com", password: "wrongpassword" },
      { email: user?.email },
      { password: user?.password },
      { email: user?.email, password: "wrong" },
      { email: "wrongemail", password: user?.password },
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
      email: user?.email,
      password: user?.password,
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
