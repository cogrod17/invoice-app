import server from "../../../server";
import db from "../../../database";
import supertest from "supertest";

const validKeys = ["id", "created_at", "updated_at", "user_id", "recipient_id"];

const { ACCESS_TOKEN } = process.env;

describe("POST /draft/create", () => {
  const request = supertest(server.app);
  const newInvoice = {
    name: "ineedaddress",
    email: "boomboom@email.com",
    address1: "1234 Cedarhurst Lane",
    zip: 33707,
  };
  let token: ["Authorization", string] = [
    "Authorization",
    `Bearer ${ACCESS_TOKEN || ""}`,
  ];

  afterAll(async () => {
    await db.query("TRUNCATE TABLE drafts, recipients");
    db.end();
  });

  it("failed to add authentication", async () => {
    const res = await request.post("/draft/create").send(newInvoice);
    expect(res.statusCode).toBe(401);
  });

  it("return draft object with appropriate keys", async () => {
    const res = await request
      .post("/draft/create")
      .set(...token)
      .send(newInvoice);

    expect(res.statusCode).toBe(200);
    expect(Object.keys(res.body).every((key) => validKeys.includes(key))).toBe(
      true
    );
  });
});
