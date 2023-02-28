import server from "../../../server";
import supertest from "supertest";

const validKeys = ["id", "created_at", "updated_at", "user_id", "recipient_id"];

const { ACCESS_TOKEN } = process.env;

describe("POST /draft/create", () => {
  const { db, app } = server;

  const request = supertest(app);
  const newInvoice = {
    name: "ineedaddress",
    email: "boomboom@email.com",
    address1: "1234 Cedarhurst Lane",
    zip: 33707,
  };
  const token: ["Authorization", string] = [
    "Authorization",
    `Bearer ${ACCESS_TOKEN || ""}`,
  ];

  afterAll(async () => await db.query("TRUNCATE TABLE drafts, recipients"));

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
