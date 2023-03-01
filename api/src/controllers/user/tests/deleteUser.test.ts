import server from "../../../server";
import supertest from "supertest";
import { signTokens } from "../../../services";

describe("DELETE  /user/delete/:id", () => {
  const { app, db } = server;
  const request = supertest(app);
  const userToDelete = {
    id: null,
    email: "deleteTest@email.com",
    firstname: "deleteMe",
    lastname: "deletelast",
    password: "password",
  };
  let access_token: string;

  afterEach(async () =>
    db
      .query("DELETE FROM users WHERE id = $1", [userToDelete.id])
      .then(() => (userToDelete.id = null))
  );

  beforeEach(async () => {
    const res = await db.query(
      `INSERT INTO users (email, firstname, lastname, password) VALUES($1, $2, $3, crypt($4, gen_salt('bf'))) RETURNING id`,
      [
        userToDelete.email,
        userToDelete.firstname,
        userToDelete.lastname,
        userToDelete.password,
      ]
    );

    if (!res.rowCount)
      throw new Error("Could not create dummy user for delete tests");
    else {
      userToDelete.id = res.rows[0].id;
      let tokens = signTokens(res.rows[0].id);
      if (tokens.access_token) access_token = tokens.access_token;
      else throw new Error("could not generate test token for this user");
    }
  });

  it("successful delete", async () => {
    const res = await request
      .delete(`/user/delete/${userToDelete.id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .send();
    expect(res.statusCode).toBe(200);
  });

  it("tries to delete user that is not self", async () => {
    const res = await request
      .delete(`/user/delete/${userToDelete.id ? userToDelete.id + 123 : 0}`)
      .set("Authorization", `Bearer ${access_token}`)
      .send();

    expect(res.statusCode).toBe(401);
  });

  it("no auth token", async () => {
    const res = await request.delete(`/user/delete/${userToDelete.id}`).send();
    expect(res.statusCode).toBe(401);
  });
});
