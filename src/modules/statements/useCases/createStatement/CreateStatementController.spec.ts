import request from "supertest"
import { Connection } from "typeorm"

import { app } from "../../../../app"
import createConnection from "../../../../database"
import { CreateStatementError } from "./CreateStatementError";

let connection: Connection;

describe("Create Statement Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  })

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  })

  it("Should be able to create a deposit operation", async () => {
    await request(app).post("/api/v1/users").send({
      name: "Tester",
      email: "test@test.com",
      password: "1234"
    })

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "test@test.com",
      password: "1234"
    })

    const { token } = responseToken.body

    const response = await request(app).post("/api/v1/statements/deposit")
    .send({
      amount: 400,
      description: "Depósito"
    })
    .set({
      Authorization: `Bearer ${token}`
    })

    expect(response.status).toBe(201);
    expect(response.body.type).toEqual("deposit");
  })

  it("Should be able to create a withdraw operation", async () => {
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

    const response = await request(app).post("/api/v1/statements/withdraw")
    .send({
      amount: 300,
      description: "Saque"
    })
    .set({
      Authorization: `Bearer ${token}`
    })

    expect(response.status).toBe(201)
    expect(response.body.type).toEqual("withdraw");
  })

  it("Shouldn't be able to create a withdraw operation without funds", async () => {
    await request(app).post("/api/v1/users").send({
      name: "Tested",
      email: "testter@test.com",
      password: "1234"
    })

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "testter@test.com",
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

    const response = await request(app).post("/api/v1/statements/withdraw")
    .send({
      amount: 500,
      description: "Saque"
    })
    .set({
      Authorization: `Bearer ${token}`
    })

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty("message")
  })
})
