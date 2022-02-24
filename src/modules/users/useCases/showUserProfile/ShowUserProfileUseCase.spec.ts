import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"

let showUserProfileUseCase: ShowUserProfileUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Show User Profile", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
  });

  it("should be able to show a user profile", async () => {
    const user = await createUserUseCase.execute({
      name: "tester",
      email: "test@test.com",
      password: "1234"
    });

    const result = await showUserProfileUseCase.execute(user.id);

    expect(user).toEqual(result);
  });

  it("shouldn't be able to show a non-existing user profile", () => {
    expect(async () => {
      const user_id = "a12e6ead-d2c9-457a-9208-2b7e99528658"
      await showUserProfileUseCase.execute(user_id)
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
