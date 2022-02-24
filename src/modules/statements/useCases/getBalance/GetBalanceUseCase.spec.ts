import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get Balance", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository)
    getBalanceUseCase = new GetBalanceUseCase(
        inMemoryStatementsRepository,
        inMemoryUsersRepository)
  });

  it("should be able to show user balance", async () => {
    const user = await createUserUseCase.execute({
      name: "Tester",
      email: "Test@test.com",
      password: "1234"
    });

    await createStatementUseCase.execute({
      user_id: user.id,
      type: "deposit" as OperationType,
      amount: 400,
      description: "Test"
    });

    await createStatementUseCase.execute({
      user_id: user.id,
      type: "withdraw" as OperationType,
      amount: 100,
      description: "Test"
    });

    const result = await getBalanceUseCase.execute({
      user_id: user.id
    });

    expect(result).toHaveProperty("balance");
  });

  it("shouldn't be able to show a non-existing user balance", () => {
    expect(async () => {
      await getBalanceUseCase.execute({
        user_id: "fakeUserId1234"
      })
    }).rejects.toBeInstanceOf(GetBalanceError)
  })
})
