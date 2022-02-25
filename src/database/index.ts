import { Connection, createConnection, getConnectionOptions } from "typeorm";

export default async (host = "fin_database"): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions();

  return createConnection(
      Object.assign(defaultOptions, {
          host: process.env.NODE_ENV === "test" ? "localhost" : host,
          database:
              process.env.NODE_ENV === "test"
                  ? "fin_database"
                  : defaultOptions.database,
      })
  );
};
