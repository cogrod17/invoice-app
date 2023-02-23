import request from "supertest";
import { Server } from "../../../server";

const validKeys = ["id", "created_at", "updated_at", "user_id", "recipient_id"];

jest.mock("pg", () => {
  const pool = {
    connect: jest.fn(),
    query: jest.fn(),
    asyncQuery: jest.fn(),
  };
  return { Pool: jest.fn(() => pool) };
});

jest.mock("../actions/createInvoice.ts", () => ({
  createInvoice: jest.fn(),
}));

describe("POST /draft/create", () => {
  const newInvoice = {
    name: "ineedaddress",
    email: "boomboom@email.com",
    address1: "1234 Cedarhurst Lane",
    zip: 33707,
  };
  const token: ["Authorization", string] = ["Authorization", ""];

  const MockServer = new Server({
    connect: jest.fn(),
    query: jest.fn(),
    asyncQuery: jest.fn(),
  });

  afterEach(() => jest.clearAllMocks());

  beforeAll(async () => {
    const res = await request(MockServer.app)
      .post("/user/login")
      .send({ email: "woohoo@email.com", password: "password" });
    token[1] = `Bearer ${res.body.access_token}`;
  });

  beforeAll(
    async () =>
      await MockServer.db.asyncQuery(
        `CREATE TEMPORARY TABLE draft_test (LIKE drafts INCLUDING ALL)`,
        []
      )
  );

  afterAll(async () => {
    await MockServer.db.asyncQuery(
      "DROP TABLE IF EXISTS pg_temp.draft_test",
      []
    );
  });

  it("failed to add authentication", async () => {
    const res = await request(MockServer.app)
      .post("/draft/create")
      .send(newInvoice);
    expect(res.statusCode).toBe(401);
  });

  it("return draft object", async () => {
    const res = await request(MockServer.app)
      .post("/draft/create")
      .set(...token)
      .send(newInvoice);
    expect(res.statusCode).toBe(200);

    expect(Object.keys(res.body).every((key) => validKeys.includes(key))).toBe(
      true
    );
  });
});
