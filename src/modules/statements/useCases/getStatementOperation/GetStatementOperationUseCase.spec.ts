import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase

describe("Get Statement Operation", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
      );
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
      );
  })

  it("should be able to get a statement operation", async () => {
    const user = await createUserUseCase.execute({
      name: "Tester",
      email: "Test@test.com",
      password: "1234"
    });

    const operation: ICreateStatementDTO = {
      user_id: user.id,
      amount: 400,
      description: "test",
      type: "deposit" as OperationType
    };

    const result = await createStatementUseCase.execute(operation);

    const statement = await getStatementOperationUseCase.execute({
      user_id: user.id,
      statement_id: result.id as string,
    });

    expect(statement).toHaveProperty("id");
    expect(statement).toHaveProperty("user_id");
  })

  it("shouldn't be able to get a statement of a non-existing user", async () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: "fakeUserId1234",
        statement_id: "fakeStatementId1234"
      })
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)
  })

  it("shouldn't be able to get a non-existing statement", async () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: "Tester",
        email: "Test",
        password: "1234"
      });

      await getStatementOperationUseCase.execute({
        user_id: user.id,
        statement_id: "fakeStatementId1234"
      });
    })
  })
})
