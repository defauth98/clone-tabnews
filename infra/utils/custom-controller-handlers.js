import { InternalServerError } from "../errors";

export function onNoMatchHandler(request, response) {
  response.status(405).end();
}

export function onErrorHandler(error, request, response) {
  const publicInternalErrorObject = new InternalServerError({ cause: error });

  console.log("\n Erro no next-connect");
  console.error(error);

  response.status(500).json(publicInternalErrorObject);
}
