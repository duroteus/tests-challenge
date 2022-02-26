import request from "supertest"
import { Connection } from "typeorm"

import { app } from "../../../../app"
import createConnection from "../../../../database"

let connection: Connection;

describe("Get Statement Operation Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  })

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  })

  it("should be able to get a user balance", async () => {
    await request(app).post("/api/v1/users").send({
      name: "Tested",
      email: "tested@test.com",
      password: "1234"
    })

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "tested@test.com",
      password: "1234"
    })

    const { token } = responseToken.body

    await request(app).post("/api/v1/statements/deposit")
    .send({
      amount: 400,
      description: "Depósito"
    })
    .set({
      Authorization: `Bearer ${token}`
    })

    const result = await request(app).get("/api/v1/statements/balance")
    .set({
      Authorization: `Bearer ${token}`
    })

    const response = await request(app).get(`/api/v1/statements/${result.body.statement[0].id}`)
    .set({
      Authorization: `Bearer ${token}`
    })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty("id")
    expect(response.body).toHaveProperty("user_id")
  })
})
