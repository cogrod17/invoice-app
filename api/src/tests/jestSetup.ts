import server from "../server";
import { validateProperties } from "../utils";

interface TestUser {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  password: string;
}

interface TestConstants {
  TEST_USER: TestUser;
  TOKEN: ["Authorization", string];
  ACCESS_TOKEN: string;
  REFRESH_TOKEN: string;
}

const testUser = {
  id: 25,
  email: "test@test.com",
  firstname: "testFirst",
  lastname: "testLast",
  password: "password",
};

const access_token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjI1LCJ0eXBlIjoiYWNjZXNzVG9rZW4iLCJvcHRpb25zIjp7fSwiaWF0IjoxNjc3Mjc0OTU4fQ.v3ikAO5rrvRWRqs83iCparu6qMYmkjotKwFtp0sOZhs";

export const testConstants: TestConstants = {
  TEST_USER: { ...testUser },
  TOKEN: ["Authorization", `Bearer ${access_token}`],
  ACCESS_TOKEN: access_token,
  REFRESH_TOKEN:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjI1LCJ0eXBlIjoicmVmcmVzaFRva2VuIiwib3B0aW9ucyI6e30sImlhdCI6MTY3NzI3NDk1OH0.eqDMinSVoJfC3JbaIfq2wiJuNnCmbGX9f-0rjTmWm1U",
};

afterAll(async () => server.db.end());

beforeAll(async () => {
  const res = await server.db.query(
    `
  INSERT INTO users(email, firstname, lastname, password)  
  VALUES ($1, $2, $3, crypt($4, gen_salt('bf'))) 
  ON CONFLICT (email) DO UPDATE
  SET email = $1, firstname = $2, lastname = $3, password = crypt($4, gen_salt('bf'))
  RETURNING *
  `,
    [testUser.email, testUser.firstname, testUser.lastname, testUser.password]
  );

  const correctUserReturn = validateProperties(
    Object.keys(testUser),
    res.rows[0]
  );
  if (correctUserReturn) {
    testConstants.TEST_USER = { ...res.rows[0], password: "password" };
  } else {
    throw new Error("There was an error with the test user");
  }
});
