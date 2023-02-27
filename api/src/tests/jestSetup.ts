import server from "../server";

const testUser = {
  email: "test@test.com",
  firstName: "testFirst",
  lastName: "testLast",
  password: "password",
};

process.env.ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjI1LCJ0eXBlIjoiYWNjZXNzVG9rZW4iLCJvcHRpb25zIjp7fSwiaWF0IjoxNjc3Mjc0OTU4fQ.v3ikAO5rrvRWRqs83iCparu6qMYmkjotKwFtp0sOZhs";
process.env.REFRESH_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjI1LCJ0eXBlIjoicmVmcmVzaFRva2VuIiwib3B0aW9ucyI6e30sImlhdCI6MTY3NzI3NDk1OH0.eqDMinSVoJfC3JbaIfq2wiJuNnCmbGX9f-0rjTmWm1U";
process.env.TEST_USER = JSON.stringify(testUser);

beforeAll(async () => {
  const res = await server.db.query(
    `
  INSERT INTO users(email, firstname, lastname, password)  
  VALUES ($1, $2, $3, crypt($4, gen_salt('bf'))) 
  ON CONFLICT (email) DO UPDATE
  SET email = $1, firstname = $2, lastname = $3, password = crypt($4, gen_salt('bf'))
  RETURNING *
  `,
    [testUser.email, testUser.firstName, testUser.lastName, testUser.password]
  );

  process.env.TESTING_USER_ID = `${res.rows[0].id}`;
});

afterAll(async () => server.db.end());
