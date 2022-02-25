import request from "supertest"
import { Connection } from "typeorm"

import { app } from "../../../../app"
import createConnection from "../../../../database"

let connection: Connection;

describe("Create User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  })

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  })

  it("should be able to createa new user", async () => {
    const response = await request(app).post("/api/v1/users")
    .send({
      name: "Testing",
      email: "tested@testing.com",
      password: "deusehtop"
    })

    expect(response.status).toBe(201);
  });

  it("shouldn't be able to create a user with an already registered email", async () => {
    const response = await request(app).post("/api/v1/users")
    .send({
      name: "Testing",
      email: "tested@testing.com",
      password: "deusehtop"
    })

    expect(response.status).toBe(400)
  })
})
