import database from "infra/database";
import { ValidationError } from "infra/errors";

async function create(userInputValues) {
  await validateEmail(userInputValues.email);
  await validateUsername(userInputValues.username);

  const results = await runInsertQuery(userInputValues);
  return results;

  async function runInsertQuery(userInputValues) {
    const results = await database.query({
      text: `
      INSERT INTO
        users (username,email,password) 
      VALUES 
        ($1, $2, $3)
      RETURNING
        *
    ;`,
      values: [
        userInputValues.username,
        userInputValues.email,
        userInputValues.password,
      ],
    });

    return results.rows[0];
  }

  async function validateEmail(email) {
    const results = await database.query({
      text: `
        SELECT
          *
        FROM
          users
        WHERE
          LOWER(email) = LOWER($1)
      ;`,
      values: [email],
    });

    if (results.rowCount > 0) {
      throw new ValidationError({
        message: "O email informado já está sendo utilizado.",
        action: "Utilize outro email para realizar esta operação.",
      });
    }
  }

  async function validateUsername(username) {
    const results = await database.query({
      text: `
        SELECT
          *
        FROM
          users
        WHERE
          LOWER(username) = LOWER($1)
      ;`,
      values: [username],
    });

    if (results.rowCount > 0) {
      throw new ValidationError({
        message: "O username informado já está sendo utilizado.",
        action: "Utilize outro username para realizar esta operação.",
      });
    }
  }
}

const user = {
  create,
};

export default user;
