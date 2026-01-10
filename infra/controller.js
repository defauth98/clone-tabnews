import { InternalServerError, MethodNotAllowedError } from "./errors";

export function onNoMatchHandler(request, response) {
  const publicMethodNotAllowedErrorObject = new MethodNotAllowedError();

  response.status(405).json(publicMethodNotAllowedErrorObject);
}

export function onErrorHandler(error, request, response) {
  const publicInternalErrorObject = new InternalServerError({
    cause: error,
    statusCode: error.statusCode,
  });

  response.status(500).json(publicInternalErrorObject);
}
