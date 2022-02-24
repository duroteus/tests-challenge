import { OperationType } from "../../entities/Statement"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "./CreateStatementUseCase"
import { ICreateStatementDTO } from "./ICreateStatementDTO";
import { CreateStatementError } from "./CreateStatementError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

describe("Create Statement", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
  })
  it("should be able to create a new deposit operation", async () => {
    const user = await createUserUseCase.execute({
      name: "Tester",
      email: "Test@tester.com",
      password: "1234"
    });

    const deposit: ICreateStatementDTO = {
      user_id: user.id,
      amount: 400,
      description: "Test",
      type: "deposit" as OperationType
    }

    const result = await createStatementUseCase.execute(deposit)

    expect(result).toHaveProperty("id");
    expect(result.type).toEqual("deposit");
  })

  it("should be able to create a new withdraw operation", async () => {
    const user = await createUserUseCase.execute({
      name: "Tester",
      email: "Test@tester.com",
      password: "1234"
    });

    const deposit: ICreateStatementDTO = {
      user_id: user.id,
      amount: 500,
      description: "Test",
      type: "deposit" as OperationType
    }

    await createStatementUseCase.execute(deposit)

    const withdraw: ICreateStatementDTO = {
      user_id: user.id,
      amount: 300,
      description: "Test",
      type: "withdraw" as OperationType
    }

    const result = await createStatementUseCase.execute(withdraw)

    expect(result).toHaveProperty("id");
    expect(result.type).toEqual("withdraw")
  })

  it("shouldn't be able to create a new withdraw operation for user without funds", async () => {
    const user = await createUserUseCase.execute({
      name: "NoMoney",
      email: "NO@money.com",
      password: "1234"
    });

    expect(async () => {
      const withdraw: ICreateStatementDTO = {
        user_id: user.id,
        amount: 400,
        description: "Test",
        type: "withdraw" as OperationType
      }

      await createStatementUseCase.execute(withdraw)

    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
  })

  it("shouldn't be able to create a new deposit operation for a non-existing user", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "Tester",
        email: "Test@tester.com",
        password: "1234"
      });

      const statement: ICreateStatementDTO = {
        user_id: "idtester1234",
        amount: 400,
        description: "Test",
        type: "deposit" as OperationType
      }

      await createStatementUseCase.execute(statement)
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
  })
})
