import request from "supertest"
import { Connection } from "typeorm"

import { app } from "../../../../app"
import createConnection from "../../../../database"

let connection: Connection;

describe("Show User Profile Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  })

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  })

  it("should be able to show user profile", async () => {
    await request(app).post("/api/v1/users")
    .send({
      name: "Teston",
      email: "teston@testing.com",
      password: "deusehtop"
    })

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "teston@testing.com",
      password: "deusehtop"
    });

    const { token } = responseToken.body

    const response = await request(app)
    .get("/api/v1/profile")
    .set({
      Authorization: `Bearer ${token}`
    })

    expect(response.status).toBe(200)
  });
});
