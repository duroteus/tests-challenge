import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserError } from "./CreateUserError"
import { CreateUserUseCase } from "./CreateUserUseCase"

let createUseruseCase: CreateUserUseCase
let inMemoryUsersRepository: InMemoryUsersRepository

describe("Create User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUseruseCase = new CreateUserUseCase(inMemoryUsersRepository)
  })

  it("should be able to create a new user", async () => {
    await createUseruseCase.execute({
      name: "test",
      email: "test@test.com",
      password: "1234"
    })
  })

  it("shouldn't be able to create a user with a registered email", () => {
    expect(async () => {
      await createUseruseCase.execute({
        name: "test",
        email: "test@test.com",
        password: "1234"
      })

      await createUseruseCase.execute({
        name: "test",
        email: "test@test.com",
        password: "1234"
      })
    }).rejects.toBeInstanceOf(CreateUserError)
  })
})
