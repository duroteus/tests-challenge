import request from "supertest"
import { Connection } from "typeorm"

import { app } from "../../../../app"
import createConnection from "../../../../database"

let connection: Connection;

describe("Authenticate User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  })

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  })

  it("should be able to authenticate a user", async () => {
    await request(app).post("/api/v1/users")
    .send({
      name: "Tested",
      email: "testing@test.com",
      password: "deusehtop"
    })

    const session = await request(app).post("/api/v1/sessions")
    .send({
      email: "testing@test.com",
      password: "deusehtop"
    })

    expect(session.body).toHaveProperty("token")
  });
});
